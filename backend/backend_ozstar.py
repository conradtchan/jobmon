import copy
import gzip
import json
import math
import pwd
import re
import subprocess
import time
from collections import OrderedDict
from glob import glob
from os import path

import ganglia
import influx_config
import jobmon_config as config
import pyslurm
import showbf
from backend_base import BackendBase
from constants import KB
from influxdb_client import InfluxDBClient


class Backend(BackendBase):
    def init(self):
        # Dict of username mappings
        self.usernames = {}

        # Maximum memory usage of a job
        self.mem_max = {}

        # Load max usage
        self.load_max_mem_usage()

        # GPU_layout_cache
        self.gpu_layout_cache = OrderedDict()

    def pre_update(self):
        # Ganglia
        self.log.info("Getting Ganglia data")
        self.ganglia_data = ganglia.Stats(do_cpus=True).all

        # Slurm
        self.log.info("Getting Slurm data")
        self.pyslurm_node = pyslurm.node().get()
        self.pyslurm_job = pyslurm.job().get()

        # Influx
        self.log.info("Getting memory data")
        self.update_mem_data()
        self.prune_mem_max()

    def update_mem_data(self):
        self.log.info("Querying influx")
        influx_result = self.query_influx()

        # Get active jobs (and call job_ids which generates full ID mapping)
        running_jobs = [
            job_id for job_id in self.job_ids() if self.job_state(job_id) == "RUNNING"
        ]

        self.log.info("Parsing influx data")
        mem_data = {}

        # Jobs with memory stats found
        jobs_with_stats = []

        for table in influx_result:
            record = table.records[0]

            slurm_job_id = int(record["job"])

            if self.job_state(slurm_job_id=slurm_job_id) == "RUNNING":

                # Convert to full ID
                job_id = self.full_id[slurm_job_id]

                jobs_with_stats += [job_id]

                node = record["host"]
                mem = record["_value"]

                if job_id not in mem_data:
                    mem_data[job_id] = {"mem": {}, "memMax": 0}

                mem_data[job_id]["mem"][node] = mem

        for job_id in mem_data:

            # Initialise max memory record
            if job_id not in self.mem_max:
                self.mem_max[job_id] = 0

            for node in mem_data[job_id]["mem"]:
                # Convert KB to MB
                mem_data[job_id]["mem"][node] = math.ceil(
                    mem_data[job_id]["mem"][node] / KB
                )
                self.mem_max[job_id] = int(
                    max(self.mem_max[job_id], mem_data[job_id]["mem"][node])
                )
                mem_data[job_id]["memMax"] = self.mem_max[job_id]

        # Turn list of jobs with memory stats into a set to remove duplicates
        jobs_with_stats = set(jobs_with_stats)

        self.log.info(
            f"Memory stats found for {len(jobs_with_stats)}/{len(running_jobs)} jobs"
        )

        self.mem_data = mem_data

    def load_max_mem_usage(self):
        filenames = config.FILE_NAME_PATTERN.format("*")
        filepaths = path.join(config.DATA_PATH, filenames)
        data_files = glob(filepaths)
        times = []
        for x in data_files:
            filename = path.basename(x)
            match = re.search(config.FILE_NAME_PATTERN.format(r"(\d+)"), filename)
            if match is not None:
                times += [match.group(1)]

        if len(times) > 0:
            t_latest = max(times)

            self.log.info("Loading max memory data from {:}".format(t_latest))

            filename = config.FILE_NAME_PATTERN.format(t_latest)
            filepath = path.join(config.DATA_PATH, filename)
            with gzip.open(filepath, "r") as f:
                json_text = f.read().decode("utf-8")
                data = json.loads(json_text)

                for job_id, job in data["jobs"].items():
                    if job["state"] == "RUNNING":
                        if id not in self.mem_max:
                            self.mem_max[job_id] = 0
                        self.mem_max[job_id] = int(
                            max(self.mem_max[job_id], job["memMax"])
                        )

        else:
            self.log.error("No files found to load max memory data from")

    def query_influx(self):
        # InfluxDB client for memory stats
        client = InfluxDBClient(
            url=influx_config.URL,
            org=influx_config.ORG,
            token=influx_config.TOKEN,
        )

        query_api = client.query_api()

        # Sum up the memory usage of all tasks in a job using
        # the last value of each task, and then group by job ID and host
        query = f'from(bucket:"{influx_config.BUCKET}")\
        |> range(start: -60s)\
        |> filter(fn: (r) => r["_measurement"] == "RSS")\
        |> last()\
        |> group(columns: ["job", "host"])\
        |> last()'

        return query_api.query(query=query, org=influx_config.ORG)

    def prune_mem_max(self):
        n = 0
        for job_id in list(self.mem_max.keys()):
            if job_id not in self.id_map.keys():
                n += 1
                del self.mem_max[job_id]
        self.log.info(
            "Pruned {:}/{:} old max memory records".format(n, len(self.mem_max))
        )

    def cpu_usage(self, name):
        data = self.ganglia_data[name]

        try:
            total = {
                "user": float(data["cpu_user"]),
                "nice": float(data["cpu_nice"]),
                "system": float(data["cpu_system"]),
                "wait": float(data["cpu_wio"]),
                "idle": float(data["cpu_idle"]),
            }

            total_array = [math.floor(total[x]) for x in config.CPU_KEYS]

            core = []
            i = 0
            while True:
                try:
                    core += [
                        {
                            "user": float(data["multicpu_user{:}".format(i)]),
                            "nice": float(data["multicpu_nice{:}".format(i)]),
                            "system": float(data["multicpu_system{:}".format(i)]),
                            "wait": float(data["multicpu_wio{:}".format(i)]),
                            "idle": float(data["multicpu_idle{:}".format(i)]),
                        }
                    ]
                    i += 1
                except KeyError:
                    break

            # Some machines report cores with a different numbering, so we map to that
            # Could generalize for n sockets
            core_swap = False
            for prefix in config.COLUMN_ORDER_CPUS:
                if prefix in name:
                    core_swap = True

            if core_swap:
                core_left = []
                core_right = []
                for i, x in enumerate(core):
                    if i % 2 == 0:
                        core_left += [x]
                    else:
                        core_right += [x]
                core = core_left + core_right

            core_array = [[math.floor(c[x]) for x in config.CPU_KEYS] for c in core]

            # total_array and core_array are more memory efficient formats
            return {"total": total_array, "core": core_array}

        except KeyError:
            self.log.error(f"{name} cpu user/nice/system/wio/idle not in ganglia")

    def mem(self, name):
        data = self.ganglia_data[name]

        try:
            used = (
                float(data["mem_total"])
                - float(data["mem_buffers"])
                - float(data["mem_cached"])
                - float(data["mem_free"])
            )

            # convert to MB
            return {
                "used": math.ceil(used / KB),
                "total": math.ceil(float(data["mem_total"]) / KB),
            }

        except KeyError:
            now = time.time()
            if now - data["reported"] < config.NODE_DEAD_TIMEOUT:
                self.log.error(f"{name} mem gmond data is incomplete")

    def swap(self, name):
        data = self.ganglia_data[name]

        try:
            # convert to MB
            return {
                "free": math.ceil(float(data["swap_free"]) / KB),
                "total": math.ceil(float(data["swap_total"]) / KB),
            }
        except KeyError:
            self.log.error(f"{name} swap not in ganglia")
            return {
                "free": 0,
                "total": 0,
            }

    def disk(self, name):
        data = self.ganglia_data[name]
        try:
            return {
                "free": math.ceil(float(data["disk_free"])),
                "total": math.ceil(float(data["disk_total"])),
            }
        except KeyError:
            self.log.error(f"{name} disk not in ganglia")
            return {
                "free": 0,
                "total": 0,
            }

    def gpus(self, name):
        data = self.ganglia_data[name]
        g = {}
        gpu_count = 0
        for i in range(7):
            metric_name = "gpu{:d}_util".format(i)
            if metric_name in data.keys():
                gpu_count += 1
                api_name = "gpu{:d}".format(i)
                g[api_name] = float(data[metric_name])

        return g

    def infiniband(self, name):
        data = self.ganglia_data[name]
        n = {}
        if "ib_bytes_in" in data.keys():
            n["bytes_in"] = math.ceil(float(data["ib_bytes_in"]))

        if "ib_bytes_out" in data.keys():
            n["bytes_out"] = math.ceil(float(data["ib_bytes_out"]))

        if "ib_pkts_in" in data.keys():
            n["pkts_in"] = math.ceil(float(data["ib_pkts_in"]))

        if "ib_pkts_out" in data.keys():
            n["pkts_out"] = math.ceil(float(data["ib_pkts_out"]))

        if len(n.keys()) > 0:
            return n

    def lustre(self, name):
        data = self.ganglia_data[name]
        lustre_data = {}
        if "farnarkle_fred_read_bytes" in data.keys():
            lustre_data["read"] = math.ceil(float(data["farnarkle_fred_read_bytes"]))

        if "farnarkle_fred_write_bytes" in data.keys():
            lustre_data["write"] = math.ceil(float(data["farnarkle_fred_write_bytes"]))

        if len(lustre_data.keys()) > 0:
            return lustre_data

    def jobfs(self, name):
        data = self.ganglia_data[name]
        j = {}
        if "diskstat_sda_read_bytes_per_sec" in data.keys():
            j["read"] = math.ceil(float(data["diskstat_sda_read_bytes_per_sec"]))

        if "diskstat_sda_write_bytes_per_sec" in data.keys():
            j["write"] = math.ceil(float(data["diskstat_sda_write_bytes_per_sec"]))

        if len(j.keys()) > 0:
            return j

    def node_up(self, name):
        data = self.ganglia_data[name]
        now = time.time()
        return now - data["reported"] < config.NODE_DEAD_TIMEOUT

    def is_counted(self, name):
        if name in self.pyslurm_node.keys():
            for prefix in config.CORE_COUNT_NODES:
                if prefix in name:
                    return True

        return False

    def n_cpus(self, name):
        if name in self.pyslurm_node.keys():
            return self.pyslurm_node[name]["cpus"]

        return 0

    def n_gpus(self, name):
        if name in self.pyslurm_node.keys():
            n = 0
            for gres in self.pyslurm_node[name]["gres"]:
                g = gres.split(":")
                if g[0] == "gpu":
                    n += int(g[2][0])
            return n

        return 0

    def hostnames(self):
        return self.ganglia_data.keys()

    def job_ids(self):
        pyslurm_ids = self.pyslurm_job.keys()

        full_ids = []
        self.id_map = {}
        self.full_id = {}

        for job_id in pyslurm_ids:
            job_entry = self.pyslurm_job[job_id]

            # Expand queued queued array jobs into sub jobs
            if job_entry["array_task_str"] is not None:
                for sub_id in self.expand_array(job_entry["array_task_str"]):
                    full_ids += [str(job_id) + "_" + str(sub_id)]
                    self.id_map[full_ids[-1]] = job_id

            else:

                # Change the running job ID to a full ID
                if (
                    job_entry["array_task_id"] is not None
                    and job_entry["array_job_id"] is not None
                ):
                    full_ids += [
                        str(job_entry["array_job_id"])
                        + "_"
                        + str(job_entry["array_task_id"])
                    ]

                # Regular running job
                else:
                    full_ids += [str(job_id)]

                # Map between the full ID back to the original ID
                self.id_map[full_ids[-1]] = job_id

                # Map between the the original ID to the full ID
                self.full_id[job_id] = full_ids[-1]

        return full_ids

    @classmethod
    def expand_array(cls, r):
        # ignore % 'run-at once'
        if "%" in r:
            r = r.split("%")[0]
        # remember step
        step = 1
        if ":" in r:
            i = r.split(":")
            r = i[0]
            step = int(i[1])
        cc = cls.expand_array_range(r)
        if step == 1:
            return cc
        c = []
        for i in cc:
            if i % step == 0:  # might not be correct. eg 1-8:4 vs. 0-7:4. whatevs
                c.append(i)
        return c

    @classmethod
    def expand_array_range(cls, r):
        # "0,5-6,17,23-25" ->  [0,5,6,17,23,24,25]
        c = []
        for i in r.split(","):
            ss = i.split("-")
            if len(ss) > 1:  # found a range
                # If range is truncated, just append first number
                if ss[1] == "...":
                    c.append(int(ss[0]))
                else:
                    for j in range(int(ss[0]), int(ss[1]) + 1):
                        c.append(j)
            else:
                if "..." in i:
                    # Found an incomplete range, can't do anything
                    continue
                else:
                    # found a single
                    c.append(int(i))
        return c

    def job_name(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        return job["name"]

    def job_username(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        username = pwd.getpwuid(job["user_id"])[0]
        short_name = self.hide_username(username)
        return short_name

    def hide_username(self, name):
        if name not in self.usernames.keys():
            new_name = name[:3]
            add_letters = 0
            postfix = None
            for long_name, short_name in self.usernames.items():
                while short_name == new_name:
                    add_letters += 1

                    # Add a number if out of characters
                    if 3 + add_letters > len(name):
                        if postfix is None:
                            postfix = str(3 + add_letters - len(name))
                        else:
                            postfix = str(int(postfix) + 1)
                        new_name = name + postfix
                    else:
                        new_name = name[: 3 + add_letters]

            self.usernames[name] = new_name

        return self.usernames[name]

    def job_ncpus(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        return job["num_cpus"]

    def job_ngpus(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        if job["tres_alloc_str"] is not None:
            if "gpu=" in job["tres_alloc_str"]:
                return int(job["tres_alloc_str"].split("gpu=")[1][0])

        return 0

    def job_state(self, job_id=None, slurm_job_id=None):
        if job_id is not None:
            job = self.pyslurm_job[self.id_map[job_id]]
        elif slurm_job_id is not None:
            job = self.pyslurm_job[slurm_job_id]
        return job["job_state"]

    def job_layout(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        layout = copy.deepcopy(job["cpus_alloc_layout"])

        # Expand to HT core labelling if necessary
        for node in layout.keys():
            for ht_node in config.HT_NODES:
                if ht_node[0] in node:
                    extra_layout = []
                    for i in range(1, ht_node[2]):
                        extra_layout += [x + i * ht_node[1] for x in layout[node]]
                    layout[node] += extra_layout

        return layout

    def job_gpu_layout(self, job_id):
        # Only get GPU layout for jobs that:
        # - are a GPU job
        # - are actively running (otherwise scontrol will return an error)
        if self.job_ngpus(job_id) > 0 and self.job_state(job_id) == "RUNNING":
            MAXSIZE = 10000
            if job_id in self.gpu_layout_cache:
                self.log.debug(f"Job {job_id} recalled from GPU layout cache")
                layout = self.gpu_layout_cache[job_id]
            else:
                self.log.debug(
                    f"Job {job_id} not in GPU layout cache; getting from scontrol"
                )
                layout = self.scontrol_gpu(job_id)

            # Minimise the number of scontrol calls by caching the results
            # - Assume that GPU affinity is fixed for the lifetime of the job
            # - scontrol should only be called once per job
            # - Cache up to 10,000 jobs (there are typically 3000 jobs running on OzSTAR)
            # - Cannot use lru_cache because specific values cannot be cleared

            # If expecting a layout but scontrol isn't returning it yet, don't cache
            if layout is {} and self.job_ngpus(job_id) > 0:
                return layout
            else:
                self.gpu_layout_cache[job_id] = layout

            while len(self.gpu_layout_cache) > MAXSIZE:
                self.log.warn(
                    f"GPU layout cache size ({MAXSIZE}) exceeded; removing earliest item"
                )
                # Remove earliest item
                self.gpu_layout_cache.popitem(last=False)
        else:
            layout = {}

        return layout

    def scontrol_gpu(self, job_id):
        layout = {}
        hostlist = list(self.job_layout(job_id).keys())

        # Don't call scontrol unless there is a hostlist
        if len(hostlist) > 0:
            process = subprocess.run(
                "/apps/slurm/latest/bin/scontrol show job -d {:}".format(job_id),
                shell=True,
                stdout=subprocess.PIPE,
            )
            output = process.stdout.decode()

            # Iterate over hosts
            for host in hostlist:
                split_name = re.split(r"(\d+)", host)
                host_base = split_name[0]
                host_number = split_name[1]

                match = re.search(
                    f"Nodes={host_base}.*{host_number}"
                    + r".*GRES=gpu:.*\d\(IDX:(.{1,3})\)",
                    output,
                )
                if match is not None:
                    range_string = match.group(1)
                    layout[host] = [int(x) for x in range_string.split("-")]

        return layout

    def job_time_limit(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        return job["time_limit"]

    def job_run_time(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        return int(job["run_time"] / 60)

    def job_start_time(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]
        return job["start_time"]

    def job_mem(self, job_id):
        if job_id in self.mem_data:
            return self.mem_data[job_id]["mem"]
        else:
            return 0

    def job_mem_max(self, job_id):
        if job_id in self.mem_data:
            return self.mem_data[job_id]["memMax"]
        else:
            return 0

    def job_has_mem_stats(self, job_id):
        return job_id in self.mem_data

    def job_mem_request(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        if job["min_memory_cp"] is not None:
            return (
                job["min_memory_cp"]
                * max(job["ntasks_per_node"], 1)
                * max(job["cpus_per_task"], 1)
            )
        else:
            return job["min_memory_node"]

    def core_usage(self, data, silent=False):
        usage = {"avail": 0, "running": 0, "users": {}}

        # Count the available cores
        for hostname, node in data["nodes"].items():
            if node["isCounted"]:
                usage["avail"] += node["nCpus"]

        # Count the bonus cores (only get added to available when used)
        bonus_nodes = []
        n_bonus = 0

        for i, job in data["jobs"].items():
            if job["state"] == "RUNNING":
                usage["running"] += job["nCpus"]

                # if job is running on a bonus node then add the bonus node to avail
                for hostname in job["layout"]:
                    node = data["nodes"][hostname]
                    if not node["isCounted"]:
                        if hostname not in bonus_nodes:
                            bonus_nodes += [hostname]
                            usage["avail"] += node["nCpus"]
                            n_bonus += node["nCpus"]

                # Add to the individual user count
                username = job["username"]
                if username not in usage["users"]:
                    usage["users"][username] = 0
                usage["users"][username] += job["nCpus"]

        if not silent:
            self.log.info(
                "Core utilization: {:}/{:} ({:} bonus cores are active)".format(
                    usage["running"], usage["avail"], n_bonus
                )
            )

        return usage

    def calculate_backfill(self):
        now = time.time()
        data = showbf.do_all()
        u, bcu = showbf.get_core_usage(data)

        bf = {}

        for node_type in config.BF_NODES:
            bf[node_type] = {}
            b = bcu[node_type]

            # b.bins(): core counts
            # b.cnt(i): number of nodes with i available
            # b.timesMax(i): max time available for slot
            for i in sorted(b.bins()):
                tmax = b.timesMax(i)
                tmin = b.timesMin(i)
                if tmax is not None:
                    tmax -= now
                if tmin is not None:
                    tmin -= now
                bf[node_type][i] = {"count": b.cnt(i), "tMax": tmax, "tMin": tmin}

        return bf
