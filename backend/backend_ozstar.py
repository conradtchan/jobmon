import math
import time

import jobmon_config as config
from backend_base import BackendBase
from constants import KB

API_VERSION = 13


class BackendOzSTAR(BackendBase):
    @staticmethod
    def cpu_usage(data, name):
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
            for i in range(config.MULTICPU_MAX):
                try:
                    vals = {
                        "user": float(data["multicpu_user{:}".format(i)]),
                        "nice": float(data["multicpu_nice{:}".format(i)]),
                        "system": float(data["multicpu_system{:}".format(i)]),
                        "wait": float(data["multicpu_wio{:}".format(i)]),
                        "idle": float(data["multicpu_idle{:}".format(i)]),
                    }
                    core += [vals]
                except KeyError:
                    continue

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
            print(name, "cpu user/nice/system/wio/idle not in ganglia")

    @staticmethod
    def mem(data, name):
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
                print(name, "mem gmond data is incomplete")

    @staticmethod
    def swap(data, name):
        try:
            # convert to MB
            return {
                "free": math.ceil(float(data["swap_free"]) / KB),
                "total": math.ceil(float(data["swap_total"]) / KB),
            }
        except KeyError:
            print(name, "swap not in ganglia")

    @staticmethod
    def disk(data, name):
        try:
            return {
                "free": math.ceil(float(data["disk_free"])),
                "total": math.ceil(float(data["disk_total"])),
            }
        except KeyError:
            print(name, "disk not in ganglia")

    @staticmethod
    def temps(data):
        t = {}
        if "cpu1_temp" in data.keys():
            t["cpu1"] = int(data["cpu1_temp"].split(".")[0])
            if "cpu2_temp" in data.keys():
                t["cpu2"] = int(data["cpu2_temp"].split(".")[0])
            else:
                t["cpu2"] = t["cpu1"]

        if "front_temp" in data.keys():
            t["front"] = int(data["front_temp"].split(".")[0])
            if "rear_temp" in data.keys():
                t["rear"] = int(data["rear_temp"].split(".")[0])
            else:
                t["rear"] = t["front"]

        if "chassis_temp" in data.keys():
            t["chassis"] = int(data["chassis_temp"].split(".")[0])

        if len(t.keys()) > 0:
            return t

    @staticmethod
    def power(data):
        p = {}
        if "node_power" in data.keys():
            p["node"] = int(data["node_power"].split(".")[0])
        if "cmm_power_in" in data.keys():
            p["blade_chassis"] = int(data["cmm_power_in"].split(".")[0])

        if len(p.keys()) > 0:
            return p

    @staticmethod
    def fans(data):
        f = {}
        if "fan_rms" in data.keys():
            f["rms"] = int(data["fan_rms"].split(".")[0])

        if len(f.keys()) > 0:
            return f

    @staticmethod
    def gpus(data):
        g = {}
        gpu_count = 0
        for i in range(7):
            metric_name = "gpu{:d}_util".format(i)
            if metric_name in data.keys():
                gpu_count += 1
                api_name = "gpu{:d}".format(i)
                g[api_name] = float(data[metric_name])

        return g

    @staticmethod
    def infiniband(data):
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

    @staticmethod
    def lustre(data):
        lustre_data = {}
        if "farnarkle_fred_read_bytes" in data.keys():
            lustre_data["read"] = math.ceil(float(data["farnarkle_fred_read_bytes"]))

        if "farnarkle_fred_write_bytes" in data.keys():
            lustre_data["write"] = math.ceil(float(data["farnarkle_fred_write_bytes"]))

        if len(lustre_data.keys()) > 0:
            return lustre_data

    @staticmethod
    def jobfs(data):
        j = {}
        if "diskstat_sda_read_bytes_per_sec" in data.keys():
            j["read"] = math.ceil(float(data["diskstat_sda_read_bytes_per_sec"]))

        if "diskstat_sda_write_bytes_per_sec" in data.keys():
            j["write"] = math.ceil(float(data["diskstat_sda_write_bytes_per_sec"]))

        if len(j.keys()) > 0:
            return j
