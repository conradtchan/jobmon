import gzip
import json
import math
import pwd
import re
import time
from datetime import datetime
from glob import glob
from os import path, remove

import influx_config
import jobmon_config as config
import jobmon_ganglia as ganglia
import pyslurm
import showbf
from constants import KB
from file_utils import write_data
from influxdb import InfluxDBClient
from jobmon_gpu_mapping import GPUmapping

API_VERSION = 13


class BackendBase:
    def __init__(self, no_history):
        # Data
        self.data = {}

        # Backfill data
        self.backfill = {}

        # Dict of username mappings
        self.usernames = {}

        # Initialise GPU mapping determination
        self.ga = GPUmapping()

        # Maximum memory usage of a job
        self.mem_max = {}

        # Load usage from disk
        self.usage_cache = {"history": {}}
        if not no_history:
            self.usage_from_disk()

    @classmethod
    def timestamp(cls):
        # Seconds since epoch
        d = datetime.now()
        return int(time.mktime(d.timetuple()))

    @staticmethod
    def cpu_usage(data, name):
        """
        Returns the CPU usage percentage for the node
            {"total": total_array, "core": core_array}

        For compactness, data is returnd as an array rather than a dictionary
        in the layout:
            [user, nice, sys, wait, idle]

        Values should add to 100

        Examples:
            total_array = [90, 0, 0, 0, 10]
            core_array = [
                [90, 0, 0, 0, 10],
                [90, 0, 0, 0, 10],
                [90, 0, 0, 0, 10],
                [90, 0, 0, 0, 10],
            ]

        """

        return {}

    @staticmethod
    def mem(data, name):
        """
        Returns the memory usage for the node
        (in megabytes)

        Example:
            {"used": 1000, "total": 4000}
        """

        return {}

    @staticmethod
    def swap(data, name):
        """
        Returns the swap usage for the node
        (in megabytes)

        Example:
            {"free": 1000, "total": 4000}
        """

        return {}

    @staticmethod
    def disk(data, name):
        """
        Returns the disk usage for the node
        (in megabytes)

        Example:
            {"free": 1000, "total": 4000}
        """

        return {}

    @staticmethod
    def gpus(data):
        """
        Returns the GPU usage percentage for the node

        Example:
            {"gpu0_util": 90, "gpu1_util": 100}
        """

        return {}

    @staticmethod
    def infiniband(data):
        """
        Returns the infiniband usage for the node
        (in bytes and packets)

        Example:
            {
                "ib_bytes_in": 100,
                "ib_bytes_out": 200,
                "ib_pkts_in": 300,
                "ib_pkts_out": 400,
            }
        """

        return {}

    @staticmethod
    def lustre(data):
        """
        Returns the infiniband traffic for the node
        (in bytes)

        Example:
            {"read": 100, "write": 200}
        """

        return {}

    @staticmethod
    def jobfs(data):
        """
        Returns the read/write stats on JOBFS for the node
        (in bytes)

        Example:
            {"read": 100, "write": 200}
        """

        return {}

    @classmethod
    def nodes(cls):
        all = ganglia.Stats(do_cpus=True).all

        now = time.time()  # seconds since 1970

        pyslurm_nodes = pyslurm.node().get()

        nodes = {}
        for host in all.keys():
            nodes[host] = {}

            # If node is up
            if now - all[host]["reported"] < config.NODE_DEAD_TIMEOUT:
                nodes[host]["up"] = True
            else:
                nodes[host]["up"] = False

            nodes[host]["cpu"] = cls.cpu_usage(all[host], host)
            nodes[host]["mem"] = cls.mem(all[host], host)
            nodes[host]["swap"] = cls.swap(all[host], host)
            nodes[host]["disk"] = cls.disk(all[host], host)
            nodes[host]["gpus"] = cls.gpus(all[host])
            nodes[host]["infiniband"] = cls.infiniband(all[host])
            nodes[host]["lustre"] = cls.lustre(all[host])
            nodes[host]["jobfs"] = cls.jobfs(all[host])

            nodes[host]["isCounted"] = False
            if host in pyslurm_nodes.keys():
                for prefix in config.CORE_COUNT_NODES:
                    if prefix in host:
                        nodes[host]["isCounted"] = True
                        break
                nodes[host]["nCpus"] = pyslurm_nodes[host]["cpus"]
                nodes[host]["nGpus"] = 0
                for gres in pyslurm_nodes[host]["gres"]:
                    g = gres.split(":")
                    if g[0] == "gpu":
                        nodes[host]["nGpus"] += int(g[2][0])

        return nodes

    def hide_username(self, name):
        if name not in self.usernames.keys():
            new_name = name[:3]
            add_letters = 0
            for long_name, short_name in self.usernames.items():
                while short_name == new_name:
                    add_letters += 1

                    # Add a number if out of characters
                    if 3 + add_letters > len(name):
                        new_name = name + str(3 + add_letters - name)
                    else:
                        new_name = name[: 3 + add_letters]

            self.usernames[name] = new_name

        return self.usernames[name]

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
            else:  # found a single
                c.append(int(i))
        return c

    @staticmethod
    def cpu_layout(layout):
        # Expand to HT core labelling if necessary
        for node in layout.keys():
            for ht_node in config.HT_NODES:
                if ht_node[0] in node:
                    extra_layout = []
                    for i in range(1, ht_node[2]):
                        extra_layout += [x + i * ht_node[1] for x in layout[node]]
                    layout[node] += extra_layout

        return layout

    def job_info(self, slurm_job):
        num_gpus = 0
        if slurm_job["tres_alloc_str"] is not None:
            if "gpu=" in slurm_job["tres_alloc_str"]:
                num_gpus = int(slurm_job["tres_alloc_str"].split("gpu=")[1][0])

        return {
            "name": slurm_job["name"],
            "username": self.hide_username(pwd.getpwuid(slurm_job["user_id"])[0]),
            "nCpus": slurm_job["num_cpus"],
            "state": slurm_job["job_state"],
            "layout": self.cpu_layout(slurm_job["cpus_alloc_layout"]),
            "timeLimit": slurm_job["time_limit"],  # minutes
            "runTime": int(slurm_job["run_time"] / 60),  # minutes
            "nGpus": num_gpus,
            "mem": {},  # populate later
            "memMax": {},  # populate later
            "hasMem": False,
            "memReq": self.requested_memory(slurm_job),  # mb
        }

    def add_job_mem_info(self, j, id_map):
        print("Getting memory stats")
        # InfluxDB client for memory stats
        influx_client = InfluxDBClient(
            host=influx_config.HOST,
            port=influx_config.PORT,
            username=influx_config.USERNAME,
            password=influx_config.PASSWORD,
        )
        # Choose database
        influx_client.switch_database("ozstar_slurm")

        # Query all jobs for current memory usage
        query = "SELECT host, MAX(value) FROM RSS WHERE time > now() - {:}s  GROUP BY job, host, task".format(
            config.UPDATE_INTERVAL * 4
        )
        result = influx_client.query(query)

        # Count jobs
        active_slurm_jobs = []
        for array_id in j:
            if j[array_id]["state"] == "RUNNING":
                active_slurm_jobs += [array_id]

        count_stat = 0
        for array_id in active_slurm_jobs:
            key = ("RSS", {"job": str(id_map[array_id])})
            nodes = list(result[key])

            if len(nodes) > 0:
                count_stat += 1
                j[array_id]["hasMem"] = True

                mem_sum = {}
                # Current memory usage
                for x in nodes:
                    node_name = x["host"]
                    mem = x["max"]

                    # Sum up memory usage from different tasks
                    if node_name in mem_sum:
                        mem_sum[node_name] += mem
                    else:
                        mem_sum[node_name] = mem

                # Determine max over time
                if array_id not in self.mem_max:
                    self.mem_max[array_id] = 0

                # Convert KB to MB
                for node_name in mem_sum:
                    mem_mb = math.ceil(mem_sum[node_name] / KB)
                    self.mem_max[array_id] = int(max(self.mem_max[array_id], mem_mb))
                    mem_sum[node_name] = mem_mb

                # Add to job dict
                j[array_id]["mem"] = mem_sum
                j[array_id]["memMax"] = self.mem_max[array_id]

                if len(mem_sum) != len(j[array_id]["layout"]):
                    print(
                        "{:} has {:} mem nodes but {:} cpu nodes".format(
                            array_id, len(nodes), len(j[array_id]["layout"])
                        )
                    )

            else:
                print(
                    "{:} ({:}) has no memory stats".format(array_id, id_map[array_id])
                )

        print("Memory stats: {:} / {:}".format(count_stat, len(active_slurm_jobs)))

    @staticmethod
    def requested_memory(slurm_job):
        if slurm_job["min_memory_cpu"] is not None:
            return (
                slurm_job["min_memory_cpu"]
                * max(slurm_job["ntasks_per_node"], 1)
                * max(slurm_job["cpus_per_task"], 1)
            )
        else:
            return slurm_job["min_memory_node"]

    def add_job_gpu_mapping(self, j):
        # Update GPU mapping and determine
        self.ga.update_jobs(j)
        self.ga.determine()

        # Give all jobs a gpuLayout entry
        for jid in j:
            j[jid]["gpuLayout"] = {}

        # Populate GPU layout for GPU jobs
        for jid in self.ga.mapping:
            for host in self.ga.mapping[jid]:
                j[jid]["gpuLayout"][host] = self.ga.mapping[jid][host]

    def jobs(self):
        # Get job info from slurm
        slurm_jobs = pyslurm.job().get()

        j = {}

        # Map between array syntax and job numbers
        id_map = {}

        for job_id in slurm_jobs:
            s = slurm_jobs[job_id]

            if s["array_task_str"] is not None:  # queued array job(s)
                # expand into separate sub jobs
                for t in self.expand_array(s["array_task_str"]):
                    jid = str(job_id) + "_" + str(t)
                    j[jid] = self.job_info(s)

            else:
                if (
                    s["array_task_id"] is not None and s["array_job_id"] is not None
                ):  # running array task
                    # change the jobid to be array syntax
                    jid = str(s["array_job_id"]) + "_" + str(s["array_task_id"])
                else:
                    jid = str(job_id)

                j[jid] = self.job_info(s)

                id_map[jid] = job_id
                #      array_id   integer

        # Add memory information
        self.add_job_mem_info(j, id_map)

        # Prune max memory usage dict based on the current data
        self.prune_mem_max(j)

        # Add GPU mapping
        self.add_job_gpu_mapping(j)

        return j

    def update_data(self):
        data = {}
        data["api"] = API_VERSION
        data["timestamp"] = self.timestamp()
        data["nodes"] = self.nodes()
        data["jobs"] = self.jobs()
        self.data = data

    def update_core_usage(self, data=None):
        # For loading in usage from disk
        if data is not None:
            self.data = data

        usage = {"avail": 0, "running": 0}
        for hostname, node in self.data["nodes"].items():
            if node["isCounted"]:
                usage["avail"] += node["nCpus"]

        bonus_nodes = []
        n_bonus = 0

        for id, job in self.data["jobs"].items():
            if job["state"] == "RUNNING":
                usage["running"] += job["nCpus"]

                # if job is running on a bonus node then add the bonus node to avail
                for hostname in job["layout"]:
                    node = self.data["nodes"][hostname]
                    if not node["isCounted"]:
                        if hostname not in bonus_nodes:
                            bonus_nodes += [hostname]
                            usage["avail"] += node["nCpus"]
                            n_bonus += node["nCpus"]

        self.usage_cache["history"][self.data["timestamp"]] = usage

    def load_mem_max(self, data):
        # Determining max memory usage of a job
        n = 0
        for id, job in data["jobs"].items():
            if job["state"] == "RUNNING":
                if id not in self.mem_max:
                    self.mem_max[id] = 0
                self.mem_max[id] = int(max(self.mem_max[id], job["memMax"]))
                n += 1

    def prune_mem_max(self, jobs):
        n = 0
        for jobid in list(self.mem_max.keys()):
            if jobid not in jobs:
                n += 1
                del self.mem_max[jobid]
        print("Pruned {:}/{:} old max memory records".format(n, len(self.mem_max)))

    def usage_from_disk(self):
        filenames = config.FILE_NAME_PATTERN.format("*")
        filepaths = path.join(config.DATA_PATH, filenames)
        data_files = glob(filepaths)
        times = []
        for x in data_files:
            filename = path.basename(x)
            match = re.search(config.FILE_NAME_PATTERN.format(r"(\d+)"), filename)
            if match is not None:
                times += [match.group(1)]

        t_latest = max(times)
        for t in times:
            print("Loading timestamp {:}".format(t))
            filename = config.FILE_NAME_PATTERN.format(t)
            filepath = path.join(config.DATA_PATH, filename)
            with gzip.open(filepath, "r") as f:
                json_text = f.read().decode("utf-8")
                data = json.loads(json_text)
                self.update_core_usage(data=data)
                if t == t_latest:
                    self.load_mem_max(data)

    def history(self):
        now = self.timestamp()

        h = {"history": {}}
        for t in sorted(list(self.usage_cache["history"].keys())):
            if now - t < config.HISTORY_LENGTH:
                h["history"][t] = self.usage_cache["history"][t]
            elif now - t > config.HISTORY_DELETE_AGE:
                filename = config.FILE_NAME_PATTERN.format(t)
                filepath = path.join(config.DATA_PATH, filename)
                try:
                    del self.usage_cache["history"][t]
                    remove(filepath)
                except KeyError:
                    print("Tried to remove {:}, but already deleted".format(filename))

        return h

    def update_backfill(self):
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

        self.backfill = bf

    def write(self):
        output_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(""))
        write_data(self.data, output_file)

        record_file = path.join(
            config.DATA_PATH, config.FILE_NAME_PATTERN.format(self.data["timestamp"])
        )
        write_data(self.data, record_file)

        # Write history file
        history_file = path.join(config.DATA_PATH, config.FILE_NAME_HISTORY)
        write_data(self.history(), history_file)

        # Write backfill file
        backfill_file = path.join(config.DATA_PATH, config.FILE_NAME_BACKFILL)
        write_data(self.backfill, backfill_file)
