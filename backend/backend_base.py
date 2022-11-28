import gzip
import json
import logging
import re
import time
from datetime import datetime
from glob import glob
from os import path, remove

import jobmon_config as config
from file_utils import write_data

API_VERSION = 14


class BackendBase:
    def cpu_usage(self, name):
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

    def mem(self, name):
        """
        Returns the memory usage for the node
        (in megabytes)

        Example:
            {"used": 1000, "total": 4000}
        """

        return {}

    def swap(self, name):
        """
        Returns the swap usage for the node
        (in megabytes)

        Example:
            {"free": 1000, "total": 4000}
        """

        return {}

    def disk(self, name):
        """
        Returns the disk usage for the node
        (in megabytes)

        Example:
            {"free": 1000, "total": 4000}
        """

        return {}

    def gpus(self, name):
        """
        Returns the GPU usage percentage for the node

        Example:
            {"gpu0_util": 90, "gpu1_util": 100}
        """

        return {}

    def infiniband(self, name):
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

    def lustre(self, name):
        """
        Returns the infiniband traffic for the node
        (in bytes)

        Example:
            {"read": 100, "write": 200}
        """

        return {}

    def jobfs(self, name):
        """
        Returns the read/write stats on JOBFS for the node
        (in bytes)

        Example:
            {"read": 100, "write": 200}
        """

        return {}

    def node_up(self, name):
        """
        Returns True if the node is up, False if the node is down
        """

        return True

    def is_counted(self, name):
        """
        Returns True if the node should be counted in the total cores
        """

        return True

    def n_cpus(self, name):
        """
        Returns the number of CPU cores on the node
        """

        return 0

    def n_gpus(self, name):
        """
        Returns the number of GPUs on the node
        """

        return 0

    def hostnames(self):
        """
        Returns a list of node hostnames
        """

        return []

    def job_ids(self):
        """
        Returns a list of job IDs
        """

        return []

    def job_name(self, job_id):
        """
        Return the string name of the job
        """

        return ""

    def job_username(self, job_id):
        """
        Return the string user running the job
        """

        return ""

    def job_ncpus(self, job_id):
        """
        Return the number of CPU cores used by the job
        """

        return 0

    def job_ngpus(self, job_id):
        """
        Return the number of GPUs used by the job
        """

        return 0

    def job_state(self, job_id):
        """
        Return the string state of the job
        E.g. "PENDING", "RUNNING", "SUSPENDED", "COMPLETING", "COMPLETED"
        """

        return ""

    def job_layout(self, job_id):
        """
        Return a dictionary describing the CPU layout of the job

        In the format
        {hostname: core_array}

        E.g.
        {'john1': [0,1,2,3], 'john2': [11,12,13,14]}
        """

        return {}

    def job_gpu_layout(self, job_id):
        """
        Return a dictionary describing the GPU layout of the job

        In the format
        {hostname: gpu_array}

        E.g.
        {'john1': [0,1]}
        """

        return {}

    def job_time_limit(self, job_id):
        """
        Return the scheduled time limit of the job in minutes
        """

        return 0

    def job_run_time(self, job_id):
        """
        Return the current run time of the job in minutes
        """

        return 0

    def job_start_time(self, job_id):
        """
        Return the estimated start time of the job (timestamp)
        """

        return 0

    def job_mem(self, job_id):
        """
        Return the current memory usage of the job in MB
        """

        return 0

    def job_mem_max(self, job_id):
        """
        Return the max memory usage of the job in MB
        """

        return 0

    def job_mem_request(self, job_id):
        """
        Return the requested memory allocation in MB
        """

        return 0

    def job_lustre(self, job_id):
        """
        Return the lustre jobstats
        """

        return {}

    def core_usage(self, data, silent=False):
        """
        Return the core utilization

        Example:
            usage = {"avail": 800, "running": 750}
        """

        return {"avail": 0, "running": 0}

    def pre_update(self):
        """
        Run an update step (optional)

        For example, load data from other modules or APIs
        """

        return

    def calculate_backfill(self):
        """
        Returns a dict of the backfill availability

        Format:
            bf = {queue_name: {core_count: {"count": number_of_nodes, "tMax": max_time, "tMin", min_time}}}
        """

        return {}

    def __init__(self, no_history):
        # Logging
        self.log = logging.getLogger("jobmon")

        self.log.info("Initialising Job Monitor backend")

        # Data
        self.data = {}

        # Backfill data
        self.backfill = {}

        self.init()

        # Load usage from disk
        self.usage_cache = {"history": {}}
        if not no_history:
            self.usage_from_disk()

    def init(self):
        """
        Additional init function to be run after the logger is initialised,
        but before the usage is read from the disk
        """
        return

    @staticmethod
    def timestamp():
        # Seconds since epoch
        d = datetime.now()
        return int(time.mktime(d.timetuple()))

    def nodes(self):
        """
        Returns a dictionary of all of the node data

        Do not override this function
        """
        self.log.info("Parsing node data")
        nodes = {}
        for host in self.hostnames():
            nodes[host] = {}

            nodes[host]["up"] = self.node_up(host)
            nodes[host]["cpu"] = self.cpu_usage(host)
            nodes[host]["mem"] = self.mem(host)
            nodes[host]["swap"] = self.swap(host)
            nodes[host]["disk"] = self.disk(host)
            nodes[host]["gpus"] = self.gpus(host)
            nodes[host]["infiniband"] = self.infiniband(host)
            nodes[host]["lustre"] = self.lustre(host)
            nodes[host]["jobfs"] = self.jobfs(host)
            nodes[host]["isCounted"] = self.is_counted(host)
            nodes[host]["nCpus"] = self.n_cpus(host)
            nodes[host]["nGpus"] = self.n_gpus(host)

        return nodes

    def jobs(self):
        """
        Returns a dictionary of all of the job data

        Do not override this function
        """
        self.log.info("Parsing job data")
        j = {}

        for job_id in self.job_ids():
            j[job_id] = {}

            j[job_id]["name"] = self.job_name(job_id)
            j[job_id]["username"] = self.job_username(job_id)
            j[job_id]["nCpus"] = self.job_ncpus(job_id)
            j[job_id]["nGpus"] = self.job_ngpus(job_id)
            j[job_id]["state"] = self.job_state(job_id)
            j[job_id]["layout"] = self.job_layout(job_id)
            j[job_id]["gpuLayout"] = self.job_gpu_layout(job_id)
            j[job_id]["timeLimit"] = self.job_time_limit(job_id)
            j[job_id]["runTime"] = self.job_run_time(job_id)
            j[job_id]["startTime"] = self.job_start_time(job_id)
            j[job_id]["mem"] = self.job_mem(job_id)
            j[job_id]["memMax"] = self.job_mem_max(job_id)
            j[job_id]["memReq"] = self.job_mem_request(job_id)
            j[job_id]["lustre"] = self.job_lustre(job_id)

        return j

    def update_data(self):
        """
        Write all the data into a dictionary

        Do not override this function
        """
        self.pre_update()
        data = {}
        data["api"] = API_VERSION
        data["timestamp"] = self.timestamp()
        data["nodes"] = self.nodes()
        data["jobs"] = self.jobs()
        self.data = data

    def update_core_usage(self, data=None):
        """
        Calculate the core utilization, then add to the history dict

        Do not override this function
        """

        self.log.info("Updating core usage history")
        # For loading in usage from disk
        if data is None:
            data = self.data

        # Suppress printout to log
        self.usage_cache["history"][data["timestamp"]] = self.core_usage(
            data, silent=True
        )

    def usage_from_disk(self):
        """
        Load the past system usage from disk

        Do not override this function
        """
        filenames = config.FILE_NAME_PATTERN.format("*")
        filepaths = path.join(config.DATA_PATH, filenames)
        data_files = glob(filepaths)
        times = []
        for x in data_files:
            filename = path.basename(x)
            match = re.search(config.FILE_NAME_PATTERN.format(r"(\d+)"), filename)

            if match is not None:
                times += [match.group(1)]

        time_start = self.timestamp()

        for t in times:
            time_now = self.timestamp()
            # If the loading time is longer than the usual update interval,
            # then run a cycle before continuing to load
            if time_now - time_start > config.UPDATE_INTERVAL * 4:
                self.log.info("Loading paused to update data")
                self.update_data()
                self.update_backfill()
                # Write without squashing history data (not yet fully loaded)
                self.write(no_history=True)
                time_start = self.timestamp()
                self.log.info("Loading continuing...")

            self.log.info("Loading timestamp {:}".format(t))
            filename = config.FILE_NAME_PATTERN.format(t)
            filepath = path.join(config.DATA_PATH, filename)

            # Try to open the file, but it may have been deleted already
            try:
                with gzip.open(filepath, "r") as f:
                    json_text = f.read().decode("utf-8")
                    data = json.loads(json_text)
                    self.update_core_usage(data=data)
            except FileNotFoundError:
                self.log.info(
                    "File not found: it may have been deleted by another process"
                )

    def history(self):
        """
        Add new entry to history and remove old entries.

        Do not override this function
        """
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
                    self.log.error(
                        "Tried to remove {:}, but already deleted".format(filename)
                    )

        return h

    def update_backfill(self):
        """
        Update the backfill dictionary

        Do not override this funciton
        """
        self.log.info("Calculating backfill")
        if config.BACKFILL:
            self.backfill = self.calculate_backfill()
        else:
            self.backfill = {}

    def write(self, no_history=False):
        """
        Write data to disk

        Do not override this function
        """
        self.log.info("Writing data to disk")
        output_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(""))
        write_data(self.data, output_file)

        record_file = path.join(
            config.DATA_PATH, config.FILE_NAME_PATTERN.format(self.data["timestamp"])
        )
        write_data(self.data, record_file)

        if not no_history:
            # Write history file
            history_file = path.join(config.DATA_PATH, config.FILE_NAME_HISTORY)
            write_data(self.history(), history_file)

        # Write backfill file
        backfill_file = path.join(config.DATA_PATH, config.FILE_NAME_BACKFILL)
        write_data(self.backfill, backfill_file)
