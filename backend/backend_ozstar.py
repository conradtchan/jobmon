import copy
import math
import pwd
import re
import subprocess
import time
from collections import OrderedDict

import influx_config
import jobmon_config as config
import pyslurm
import showbf
from backend_base import BackendBase
from constants import KB, MB
from influxdb_client import InfluxDBClient


class Backend(BackendBase):
    def init(self):
        # InfluxDB client query API
        self.influx_client = InfluxDBClient(
            url=influx_config.URL,
            org=influx_config.ORG,
            token=influx_config.TOKEN,
            timeout="30s",
        )

        # Dict of username mappings
        self.usernames = {}

        # Maximum memory usage of a job
        self.mem_max = {}

        # Load max usage
        self.load_max_mem_usage()

        # GPU_layout_cache
        self.gpu_layout_cache = OrderedDict()

        # Lustre jobstats
        self.lustre_data = {}
        self.lustre_data_rate = {}
        self.previous_lustre_ts = time.time()

        # Get hostnames for converting lustre client IPs to hostnames
        self.get_etc_hostnames()

    def pre_update(self):
        # Slurm
        self.log.info("Getting Slurm data")
        self.pyslurm_node = pyslurm.node().get()
        self.pyslurm_job = pyslurm.job().get()

        # Get active jobs (and call job_ids which generates full ID mapping)
        self.n_running_jobs = self.count_running_jobs()

        # Influx
        self.log.info("Getting Influx data")
        self.trigger_influx_tasks()
        self.update_telegraf_data()
        self.update_mem_data()
        self.prune_mem_max()
        self.update_lustre_jobstats()
        self.update_lustre_per_node()

    def count_running_jobs(self):
        n = len(
            [job_id for job_id in self.job_ids() if self.job_state(job_id) == "RUNNING"]
        )
        self.log.info(f"Counted {n} running jobs")
        return n

    def trigger_influx_tasks(self):
        """
        Queries that should run as InfluxDB tasks, but triggered via jobmon instead
        """
        self.log.info("Triggering InfluxDB tasks")
        tasks = {
            "Spoof per-node lustre stats": 'from(bucket: "ozstar")\
            |> range(start: -2m, stop:-30s)\
            |> filter(fn: (r) => r["_measurement"] == "lustre2")\
            |> filter(fn: (r) => r["_field"] == "read_bytes" or r["_field"] == "write_bytes")\
            |> filter(fn: (r) => exists r["client"])\
            |> aggregateWindow(every: 20s, fn: mean, createEmpty: false)\
            |> group(columns: ["_measurement", "_field", "client"])\
            |> aggregateWindow(every: 20s, fn: sum, createEmpty: false)\
            |> derivative(nonNegative: true)\
            |> range(start: -90s)\
            |> to(bucket: "lustre-per-node")',
            "Derivatives": 'from(bucket: "ozstar")\
            |> range(start: -2m, stop:-30s)\
            |> filter(fn: (r) => r["_measurement"] =~ /net|infiniband/)\
            |> filter(fn: (r) => exists r["host"])\
            |> derivative(nonNegative: true)\
            |> range(start: -90s)\
            |> to(bucket: "ozstar-derivs")\
            from(bucket: "ozstar")\
            |> range(start: -2m, stop:-30s)\
            |> filter(fn: (r) => r["_measurement"] == "diskio")\
            |> filter(fn: (r) => r["name"] =~ /sda2|nvme0n1p1|vdb2|vda1|nvme0n1/)\
            |> filter(fn: (r) => exists r["host"])\
            |> derivative(nonNegative: true)\
            |> range(start: -90s)\
            |> to(bucket: "ozstar-derivs")',
        }

        for name, query in tasks.items():
            self.log.info(f"Task: {name}")
            self.query_influx(query)

    def update_telegraf_data(self):
        telegraf_data = {}

        bucket_telegraf = influx_config.BUCKET_TELEGRAF
        bucket_derivs = bucket_telegraf + "-derivs"

        # window = buffer (20s) + update interval (30s) + frequency
        # for derivatives: + derivative task interval (5s) + frequency
        measurements = {
            "cpu": {
                "tag_name": "cpu",
                "window": 20 + 30 + 10,
                "bucket": bucket_telegraf,
            },
            "mem": {
                "tag_name": None,
                "window": 20 + 30 + 30,
                "bucket": bucket_telegraf,
            },
            "swap": {
                "tag_name": None,
                "window": 20 + 30 + 30,
                "bucket": bucket_telegraf,
            },
            "nvidia_smi": {
                "tag_name": "index",
                "window": 20 + 30 + 10,
                "bucket": bucket_telegraf,
            },
            "jobfs": {
                "tag_name": "jobid",
                "window": 20 + 30 + 60,
                "bucket": bucket_telegraf,
            },
            "net": {
                "tag_name": "interface",
                "window": 20 + 30 + 15 + 5 + 15,
                "bucket": bucket_derivs,
            },
            "infiniband": {
                "tag_name": None,  # This input has a "device" tag, but ignore it, assuming only one device
                "window": 20 + 30 + 10 + 5 + 10,
                "bucket": bucket_derivs,
            },
            "diskio": {
                "tag_name": "name",
                "window": 20 + 30 + 30 + 5 + 30,
                "bucket": bucket_derivs,
            },
        }

        telegraf_data = {}

        for key, settings in measurements.items():
            influx_result = self.query_influx_telegraf(
                key, settings["window"], settings["bucket"]
            )
            self.log.info(f"Influx returned {len(influx_result)} tables")

            for table in influx_result:
                record = table.records[0]

                host = record["host"]
                if host not in telegraf_data:
                    telegraf_data[host] = {}

                measurement = record.get_measurement()
                if measurement not in telegraf_data[host]:
                    telegraf_data[host][measurement] = {}

                field = record.get_field()
                floor_value = math.floor(record.get_value())
                if settings["tag_name"] is None:
                    telegraf_data[host][measurement][field] = floor_value
                else:
                    tag = record.values[settings["tag_name"]]
                    if tag not in telegraf_data[host][measurement]:
                        telegraf_data[host][measurement][tag] = {}
                    telegraf_data[host][measurement][tag][field] = floor_value

        self.telegraf_data = telegraf_data

    def update_mem_data(self):
        influx_result = self.query_influx_memory()

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
            f"Memory stats found for {len(jobs_with_stats)}/{self.n_running_jobs} jobs"
        )

        self.mem_data = mem_data

    def load_max_mem_usage(self):
        """
        Read previous max memory usage from influxdb
        """

        influx_result = self.query_influx_max_mem()

        mem_max = {}

        for table in influx_result:
            record = table.records[0]

            job_id = int(record["job_id"])
            mem_max[job_id] = int(record["_value"])

        self.mem_max = mem_max

        self.log.info(f"Loaded {len(mem_max)} max memory usage records from influxdb")

    def query_influx(self, query):
        query_api = self.influx_client.query_api()
        result = query_api.query(query=query, org=influx_config.ORG)
        del query_api
        return result

    def query_influx_memory(self):
        self.log.info("Querying Influx: memory")
        # Sum up the memory usage of all tasks in a job using
        # the last value of each task, and then group by job ID and host
        query = f'from(bucket:"{influx_config.BUCKET_MEM}")\
        |> range(start: -90s)\
        |> filter(fn: (r) => r["_measurement"] == "RSS")\
        |> last()\
        |> drop(columns: ["_start", "_stop", "_time"])\
        |> group(columns: ["job", "host"])\
        |> sum()'

        return self.query_influx(query)

    def query_influx_lustre(self):
        self.log.info("Querying Influx: lustre")
        # jobHarvest already reduces the data, so just query it by job
        # the timestamp is the collection time, which is delayed by 20s
        query = f'from(bucket: "{influx_config.BUCKET_LUSTRE_JOBSTATS}")\
        |> range(start: -50s,)\
        |> filter(fn: (r) => r["_field"] == "read_bytes" or r["_field"] == "write_bytes" or r["_field"] == "iops")\
        |> last()\
        |> drop(columns: ["_start", "_stop", "_time"])\
        |> group(columns: ["job", "fs", "server"])'

        return self.query_influx(query)

    def query_influx_telegraf(self, key, window, bucket):
        self.log.info(f"Querying Influx: telegraf ({key})")

        query = f'from(bucket:"{bucket}")\
        |> range(start: -{window}s)\
        |> filter(fn: (r) => r["_measurement"] == "{key}")\
        |> drop(columns: ["_start", "_stop", "_time"])\
        |> last()'

        return self.query_influx(query)

    def query_influx_lustre_per_node(self):
        self.log.info("Querying Influx: lustre per node")

        query = 'from(bucket: "lustre-per-node")\
        |> range(start: -90s)\
        |> last()\
        |> drop(columns: ["_start", "_stop", "_time"])'

        return self.query_influx(query)

    def query_influx_max_mem(self):
        self.log.info("Querying Influx: max mem")

        query = 'from(bucket: "jobmon-stats")\
        |> range(start: -1d)\
        |> filter(fn: (r) => r["_measurement"] == "job_max_memory")\
        |> last()\
        |> drop(columns: ["_start", "_stop", "_time"])'

        return self.query_influx(query)

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
        # CPU measurements are stored as an array for efficiency
        # CPU key order: ["user", "nice", "system", "wait", "idle"]

        if self.node_up(name, silent=True):
            if "cpu" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["cpu"]

                total = [
                    tdata["cpu-total"]["usage_user"],
                    tdata["cpu-total"]["usage_nice"],
                    tdata["cpu-total"]["usage_system"],
                    tdata["cpu-total"]["usage_iowait"],
                    tdata["cpu-total"]["usage_idle"],
                ]

                core = []
                i = 0
                while True:
                    try:
                        core += [
                            [
                                tdata[f"cpu{i}"]["usage_user"],
                                tdata[f"cpu{i}"]["usage_nice"],
                                tdata[f"cpu{i}"]["usage_system"],
                                tdata[f"cpu{i}"]["usage_iowait"],
                                tdata[f"cpu{i}"]["usage_idle"],
                            ]
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

                return {"total": total, "core": core}

            else:
                self.log.error(
                    f"{name} cpu user/nice/system/wio/idle not in influx/telegraf"
                )

    def mem(self, name):
        if self.node_up(name, silent=True):
            if "mem" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["mem"]
                # convert to MB
                return {
                    "used": math.ceil(tdata["used"] / MB),
                    "total": math.ceil(tdata["total"] / MB),
                }

            else:
                self.log.error(f"{name} mem not in influx/telegraf")

    def swap(self, name):
        if self.node_up(name, silent=True):
            if "swap" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["swap"]
                # convert to MB
                return {
                    "free": math.ceil(float(tdata["free"]) / MB),
                    "total": math.ceil(float(tdata["total"]) / MB),
                }
            else:
                self.log.error(f"{name} swap not in influx/telegraf")

    def gpus(self, name):
        if self.node_up(name, silent=True):
            # Not all nodes have GPUS
            if "nvidia_smi" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["nvidia_smi"]
                g = {}
                for i in tdata:
                    g[f"gpu{i}"] = tdata[i]["utilization_gpu"]

                return g

    def infiniband(self, name):
        if self.node_up(name, silent=True):
            if "infiniband" in self.telegraf_data[name]:
                return self.telegraf_data[name]["infiniband"]

            elif "net" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["net"]

                interface = "ib0"
                for eth_node in config.ETH_NODES:
                    if eth_node in name:
                        interface = config.ETH_NODES[eth_node]

                use_net_data = False
                if interface in tdata.keys():
                    if {
                        "bytes_recv",
                        "bytes_sent",
                        "packets_recv",
                        "packets_sent",
                    } <= tdata[interface].keys():
                        use_net_data = True

                if use_net_data:
                    return {
                        "bytes_in": tdata[interface]["bytes_recv"],
                        "bytes_out": tdata[interface]["bytes_sent"],
                        "pkts_in": tdata[interface]["packets_recv"],
                        "pkts_out": tdata[interface]["packets_sent"],
                    }
                else:
                    self.log.error(f"{name} ib/net not in influx")

            else:
                self.log.error(f"{name} ib/net not in influx")

    def lustre(self, name):
        if self.node_up(name, silent=True):
            if name in self.lustre_per_node_data:
                lustre_data = {}
                data = self.lustre_per_node_data[name]
                if {"read_bytes", "write_bytes"} <= data.keys():
                    lustre_data["read"] = math.ceil(data["read_bytes"])
                    lustre_data["write"] = math.ceil(data["write_bytes"])
                else:
                    self.log.error(f"{name} has no lustre per-node stats")

                return lustre_data

    def jobfs(self, name):
        if self.node_up(name, silent=True):
            if "diskio" in self.telegraf_data[name]:
                tdata = self.telegraf_data[name]["diskio"]

                device = config.JOBFS_DEV["default"]
                for pattern in config.JOBFS_DEV:
                    if pattern in name:
                        device = config.JOBFS_DEV[pattern]

                if device in tdata:
                    return {
                        "read": tdata[device]["read_bytes"],
                        "write": tdata[device]["write_bytes"],
                    }
                else:
                    self.log.error(
                        f"{name} diskio device {device} not in influx/telegraf"
                    )
            else:
                self.log.error(f"{name} diskio not in influx/telegraf")

    def jobfs_usage(self, job_id):
        usage = {}
        for name in self.job_layout(job_id):
            node_data = self.telegraf_data.get(name, {})
            # The quota command (/usr/sbin/xfs_quota -xc report /jobfs/local)
            # uses the full job ID rather than the array ID
            job_data = node_data.get("jobfs", {}).get(str(self.id_map[job_id]), {})
            if job_data:
                usage[name] = job_data.get("size", 0)

        return usage

    def jobfs_request(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        # Default value
        request = 0

        if "tres_alloc_str" in job:
            # The string looks like this: 'cpu=32,mem=150G,node=1,billing=32,gres/tmp=161061273600'
            # Get the /tmp size in MB
            if job["tres_alloc_str"] is not None:
                for gres in job["tres_alloc_str"].split(","):
                    if "gres/tmp=" in gres:
                        request = int(gres.split("=")[1]) / MB

                        # The request is a total across all nodes, so divide by the number of nodes
                        request /= int(job["num_nodes"])
                        break

        return request

    def node_up(self, name, silent=False):
        up = False

        # Cannot just check for the host because infiniband values
        # are spoofed. So check specifically for CPU values instead.
        if name in self.telegraf_data:
            measurements = self.telegraf_data[name]
            if "cpu" in measurements:
                up = True

        if not up and not silent:
            self.log.error(f"{name} is down")
        return up

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
        # Filter to 1h and mem only to avoid an expensive query
        query = f'import "influxdata/influxdb/schema"\
            schema.tagValues(bucket:"{influx_config.BUCKET_TELEGRAF}",\
            tag:"host", start: -1h, predicate: (r) => r._measurement == "mem",)\
            |> sort()'
        result = self.query_influx(query)
        table = result[0]
        hostnames = [x.get_value() for x in table]

        filtered_hostnames = [x for x in hostnames if self.match_hostname(x)]

        return filtered_hostnames

    @staticmethod
    def match_hostname(hostname):
        for pattern in config.NODES:
            if pattern in hostname:
                return True
        return False

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
                    start = ss[0]
                    end = ss[1]
                    if "..." in end:
                        if end.strip("...") > start:
                            end = end.strip("...")
                        else:
                            # Just append the first number
                            end = start
                    # Range may be followed by "...", but is still complete
                    for j in range(int(start), int(end) + 1):
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
            if job_id in self.id_map:
                job = self.pyslurm_job[self.id_map[job_id]]
            else:
                job = None
        elif slurm_job_id is not None:
            if slurm_job_id in self.pyslurm_job:
                job = self.pyslurm_job[slurm_job_id]
            else:
                job = None

        if job is None:
            return None
        else:
            return job["job_state"]

    def job_layout(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        layout = copy.deepcopy(job["cpus_alloc_layout"])

        # Remove node from layout if the job is running but influx doesn't report it as up
        # This means that something is out of sync of the job has crashed
        if self.job_state(job_id) == "RUNNING":
            for node in list(layout.keys()):
                if self.node_up(node) is False:
                    self.log.warn(f"Removing node {node} from layout for job {job_id}")
                    del layout[node]

        return layout

    def job_gpu_layout(self, job_id):
        # Default empty dict if layout cannot be found
        layout = {}

        # Only get GPU layout for jobs that:
        # - are a GPU job
        # - are actively running (otherwise scontrol will return an error)
        if self.job_ngpus(job_id) > 0:
            state = self.job_state(job_id)
            if state == "RUNNING":
                MAXSIZE = 10000
                if job_id in self.gpu_layout_cache:
                    self.log.debug(f"Job {job_id} recalled from GPU layout cache")
                    layout = self.gpu_layout_cache[job_id]
                else:
                    self.log.debug(
                        f"Job {job_id} not in GPU layout cache; getting from scontrol"
                    )
                    layout = self.scontrol_gpu(job_id)

                    # Make sure each item in the GPU layout is also in the CPU layout
                    # This is in case scontrol returns an incorrect value
                    for node in layout:
                        if node not in self.job_layout(job_id):
                            self.log.warn(
                                f"Node {node} in GPU layout for job {job_id} not in CPU layout"
                            )
                            del layout[node]

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

            # Job has already finished
            elif state != "PENDING":
                # Remove from layout
                self.gpu_layout_cache.pop(job_id, None)

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
                    + r".*GRES=.*gpu:.*\d\(IDX:(.{1,3})\)",
                    output,
                )
                if match is not None:
                    range_string = match.group(1)
                    # Convert range into list of individual GPUs,
                    # e.g. 0-1 -> [0, 1]
                    # e.g. 0,2,3 -> [0, 2, 3]
                    # e.g. 0-1,3 -> [0, 1, 3]
                    layout[host] = self.expand_array_range(range_string)

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
            return {}

    def job_mem_max(self, job_id):
        if job_id in self.mem_data:
            return self.mem_data[job_id]["memMax"]
        else:
            return 0

    def job_mem_request(self, job_id):
        job = self.pyslurm_job[self.id_map[job_id]]

        # Check if the job has a minimum memory per CPU specified
        if job["min_memory_cpu"] is not None:
            # If the job specifies tasks per node and CPUs per task
            if job["ntasks_per_node"] > 0 and job["cpus_per_task"] > 0:
                # Calculate the total memory request based on tasks per node and CPUs per task
                return (
                    job["min_memory_cpu"]
                    * job["ntasks_per_node"]
                    * job["cpus_per_task"]
                )
            # If the job specifies the number of CPUs and nodes
            elif job["num_cpus"] > 0 and job["num_nodes"] > 0:
                # Calculate the total memory request based on the number of CPUs and nodes
                return job["min_memory_cpu"] * job["num_cpus"] / job["num_nodes"]
            else:
                # Log an error if the job does not have a valid memory request
                self.log.error(f"Job {job_id} has no valid memory request")
                return 0

        # Check if the job is requesting memory per gpu (e.g. --mem-per-gpu=160GB)
        if job["mem_per_tres"] is not None:
            # Example value: 'gres/gpu:163840'
            mem_per_gpu = int(job["mem_per_tres"].split(":")[1])
            return mem_per_gpu * self.job_ngpus(job_id)

        else:
            # If no minimum memory per CPU is specified, return the minimum memory per node
            return job["min_memory_node"]

    def job_lustre(self, job_id):
        if job_id in self.lustre_data_rate:
            return self.lustre_data_rate[job_id]
        else:
            return {}

    def update_lustre_jobstats(self):
        now = time.time()
        influx_result = self.query_influx_lustre()
        lustre_data = {}
        lustre_data_rate = {}

        # Jobs with lustre stats found
        jobs_with_stats = []

        for table in influx_result:
            # Cycle loop if there are no records in this table
            if len(table.records) == 0:
                continue

            # Every record in this table has the same ID, so just use the first
            job_id = table.records[0]["job"]

            if self.job_state(job_id) == "RUNNING":
                jobs_with_stats += [job_id]

                run_time = self.job_run_time(job_id)

                for d in [lustre_data, lustre_data_rate]:
                    if job_id not in d:
                        d[job_id] = {}

                # Unpack values
                for record in table.records:
                    assert record["job"] == job_id

                    fs = record.values["fs"]

                    for d in [lustre_data, lustre_data_rate]:
                        if fs not in d[job_id]:
                            d[job_id][fs] = {
                                "mds": {"read_bytes": 0, "write_bytes": 0, "iops": 0},
                                "oss": {"read_bytes": 0, "write_bytes": 0, "iops": 0},
                            }

                    server = record.values["server"]
                    value = round(record.get_value(), 2)
                    field = record.get_field()

                    # Calculate derivative using previous value
                    if (
                        job_id in self.lustre_data
                        and fs in self.lustre_data[job_id]
                        and server in self.lustre_data[job_id][fs]
                        and field in self.lustre_data[job_id][fs][server]
                    ):
                        prev_value = self.lustre_data[job_id][fs][server][field]
                        time_diff = now - self.previous_lustre_ts
                        if time_diff > 0:
                            derivative = (value - prev_value) / time_diff
                        else:
                            self.log.error(
                                f"Time difference between lustre jobstats is {time_diff} seconds"
                            )
                    elif run_time <= 1:
                        # The job has been running for less than a minute
                        # First value, so approximate derivative using sampling frequency
                        derivative = value / config.UPDATE_INTERVAL
                    else:
                        derivative = 0

                    lustre_data[job_id][fs][server][field] = value
                    lustre_data_rate[job_id][fs][server][field] = derivative

        self.log.info(
            f"Lustre stats found for {len(jobs_with_stats)}/{self.n_running_jobs} jobs"
        )
        self.lustre_data = lustre_data
        self.lustre_data_rate = lustre_data_rate
        self.previous_lustre_ts = now

    def update_lustre_per_node(self):
        influx_result = self.query_influx_lustre_per_node()

        lustre_per_node_data = {}

        for table in influx_result:
            # Cycle loop if there are no records in this table
            if len(table.records) == 0:
                continue

            client = table.records[0]["client"]
            ip = client.split("@")[0]

            # If IP is not in /etc/hosts, ignore it
            if ip in self.hosts:
                # Assume the first hostname is the full hostname
                hostname = self.hosts[ip][0]

                if hostname not in lustre_per_node_data:
                    lustre_per_node_data[hostname] = {}

                for record in table.records:
                    lustre_per_node_data[hostname][
                        record.get_field()
                    ] = record.get_value()

        self.lustre_per_node_data = lustre_per_node_data

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

    def get_etc_hostnames(self):
        """
        Parses /etc/hosts file and returns a dict of the hostnames of each IP
        Adapted from https://stackoverflow.com/a/48917507
        """
        with open("/etc/hosts", "r") as f:
            hostlines = f.readlines()
        hostlines = [
            line.strip()
            for line in hostlines
            if not line.startswith("#") and line.strip() != ""
        ]
        self.hosts = {}
        for line in hostlines:
            values = line.split("#")[0].split()
            ip = values[0]
            hostnames = values[1:]
            self.hosts[ip] = hostnames

    def write_influx(self):
        """
        Write statistics to InfluxDB
        """
        self.log.info("Writing stats to Influx")

        # Set up write API
        write_api = self.influx_client.write_api()

        # Report jobmon performance (how long it takes to run)
        write_api.write(
            bucket=influx_config.BUCKET_JOBMON,
            org=influx_config.ORG,
            record=[
                {
                    "measurement": "jobmon_cadence",
                    "fields": {"value": self.time_taken},
                    "time": self.time_start,
                }
            ],
            write_precision="s",
        )

        # Data to write
        data = []

        # Report job max memory usage
        for job_id in self.mem_max:
            data += [
                {
                    "measurement": "job_max_memory",
                    "tags": {
                        "job_id": job_id,
                    },
                    "fields": {"value": self.mem_max[job_id]},
                    "time": self.time_start,
                }
            ]

        # Report job instantaneous average CPU usage
        cpu_usage = self.job_average_cpu_usage()
        for job_id in cpu_usage:
            data += [
                {
                    "measurement": "average_cpu_usage",
                    "tags": {
                        "job_id": job_id,
                    },
                    "fields": {"value": cpu_usage[job_id]},
                    "time": self.time_start,
                }
            ]

        # Report job instantaneous average GPU usage
        gpu_usage = self.job_average_gpu_usage()
        for job_id in gpu_usage:
            data += [
                {
                    "measurement": "average_gpu_usage",
                    "tags": {
                        "job_id": job_id,
                    },
                    "fields": {"value": gpu_usage[job_id]},
                    "time": self.time_start,
                }
            ]

        write_api.write(
            bucket=influx_config.BUCKET_JOBMON,
            org=influx_config.ORG,
            record=data,
            write_precision="s",
        )

        # Close write API
        write_api.close()

    def job_average_cpu_usage(self):
        """
        Calculate the average CPU usage of every job using the layout provided by Slurm
        """

        # Initialize dictionary to store CPU usage for each job
        cpu_usage = {}

        # For each job
        for job_id, job in self.data["jobs"].items():
            # If the job is running
            if job["state"] == "RUNNING":
                # Create entry in dictionary for this job
                cpu_usage[job_id] = 0

                # For each host in the layout
                for hostname in job["layout"]:
                    # If the node has data
                    if hostname in self.data["nodes"]:
                        # Get the average CPU usage of the cores being used on the host
                        node = self.data["nodes"][hostname]

                        for core in job["layout"][hostname]:
                            cpu_usage[job_id] += node["cpu"]["core"][core][
                                0
                            ]  # index 0 for cpu_user

                # Divide by the number of cores
                cpu_usage[job_id] /= job["nCpus"]

        return cpu_usage

    def job_average_gpu_usage(self):
        """
        Calculate the average GPU usage of every job using the layout provided by Slurm
        """

        # Initialize dictionary to store GPU usage for each job
        gpu_usage = {}

        # For each job
        for job_id, job in self.data["jobs"].items():
            # If the job is running and uses GPUs
            if job["state"] == "RUNNING" and job["nGpus"] > 0:
                # Create entry in dictionary for this job
                gpu_usage[job_id] = 0

                # For each host in the GPU layout
                for hostname in job["gpuLayout"]:
                    # If the node has data
                    if hostname in self.data["nodes"]:
                        # Get the average GPU usage of the GPUs being used on the host
                        node = self.data["nodes"][hostname]
                        for gpu in job["gpuLayout"][hostname]:
                            gpu_usage[job_id] += node["gpus"][f"gpu{gpu}"]

                # Divide by the number of GPUs
                gpu_usage[job_id] /= job["nGpus"]

        return gpu_usage
