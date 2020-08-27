#!/usr/bin/env python3

# (c) Robin Humble. Wed Sep 25 18:58:22 AEST 2019
# licensed under the GPLv3

import pyslurm
import sys
import time
import datetime
import math

PARTITIONS = {
    "skylake-gpu": ["john", "bryan"],
    "skylake": ["john", "bryan"],
    "sstar": ["sstar"],
    "gstar": ["gstar"],
    "knl": ["gina"],
}
CORE_COUNT_NODES = PARTITIONS["skylake"]
partitionResGpuCores = {
    "skylake": 4,
    "skylake-gpu": 4,
    "sstar": 0,
    "gstar": 0,
    "knl": 0,
}
partitionMaxCpuCores = {
    "skylake": [32],
    "skylake-gpu": [4],
    "sstar": [32, 16],
    "gstar": [32, 12],
    "knl": [272],
}
# arbitrary thresholds for what constitutes a low mem/core or low disk/core situation
partitionLowMem = {
    "skylake": 1000,
    "skylake-gpu": 1000,
    "sstar": 1000,
    "gstar": 1000,
    "knl": 200,
}  # MB per core
partitionLowDisk = {
    "skylake": 3000,
    "skylake-gpu": 3000,
    "sstar": 3000,
    "gstar": 3000,
    "knl": 600,
}  #  ""
# max allowed walltime
TMAX = 24 * 7 * 3600

debug = 0


def nodes():
    pyslurm_nodes = pyslurm.node().get()

    nodes = {}

    for host, n in pyslurm_nodes.items():
        nodes[host] = {}

        nodes[host]["state"] = n["state"]

        nodes[host]["nCpus"] = n["cpus"]
        nodes[host]["nCpusUsed"] = n["alloc_cpus"]

        # track mem so can flag low mem
        nodes[host]["allocMem"] = n["alloc_mem"]
        nodes[host]["realMem"] = n["real_memory"]

        # track disk so can flag low disk
        nodes[host]["realDisk"] = n["tmp_disk"]  # in MB
        for j in n["gres_used"]:
            k = j.split(":")
            if k[0] == "tmp":
                nodes[host]["allocDisk"] = int(int(k[1]) / (1024 * 1024))  # in MB

        nodes[host]["nGpus"] = 0
        for gres in n["gres"]:
            # eg. slurm 17/18: gpu:p100:2
            #              19: gpu:p100:2(S:0-1)
            g = gres.split(":")
            if g[0] == "gpu":
                if ")" in g[-1]:
                    c = int(g[-2].split("(")[0])
                else:
                    c = int(g[-1])
                nodes[host]["nGpus"] += c

        nodes[host]["nGpusUsed"] = 0
        for gres in n["gres_used"]:
            g = gres.split(":")
            if (
                g[0] == "gpu"
            ):  # eg. gpu:p100:0(IDX:N/A), gpu:p100:1(IDX:0), gpu:p100:2(IDX:0-1), gpu:c2050:0  (down)
                if "IDX" in g[-2]:
                    nodes[host]["nGpusUsed"] += int(g[-2].split("(")[0])

        nodes[host]["avail"] = True
        for d in ["DOWN", "DRAIN", "UNKNOWN", "RESERVED"]:
            if d in nodes[host]["state"]:
                nodes[host]["avail"] = False

        # nodes[host]['gpuJobsOnNode'] = []
        # nodes[host]['gpuJobsCoresUsed'] = 0
        # cores for each type of job
        nodes[host]["gpuLayout"] = []
        nodes[host]["cpuLayout"] = []
        nodes[host]["gpuJobCnt"] = 0
        nodes[host]["cpuJobCnt"] = 0

        nodes[host]["features"] = n["features"]
        nodes[host]["futureJobs"] = []

        if debug:
            if (
                host in []
            ):  #  'gstar040', 'sstar151', 'john99', 'john2', 'john85', 'john71' ]:
                # print(host, n)
                print(host, nodes[host])
                # for i in n.keys():
                #    if 'feature' in i:
                #        print(host, 'feature', i, n[i])

    return nodes


def jobs():
    slurm_jobs = pyslurm.job().get()

    j = {}

    for id, s in slurm_jobs.items():

        # print(id,s)
        j[id] = {
            "nCpus": s["num_cpus"],
            "state": s["job_state"],
            "layout": s["cpus_alloc_layout"],
            "timeLimit": s["time_limit"],  # minutes
            "timeLimit": s["time_limit"],  # minutes
            # pyslurm 18
            "schedNodes": s["sched_nodes"],  # None or eg. bryan[1-4,6-8],john[1-3]
            "startTime": s["start_time"],  # 0 or seconds
        }

        j[id]["nGpus"] = 0
        # pyslurm 17
        # for gres in s['gres']:
        # pyslurm 18
        for gres in s["tres_per_node"].split(","):
            g = gres.split(":")
            # print(id, gres, g, g[-1])
            if g[0] == "gpu":  # eg. gpu:p100:2  gpu:2  gpu
                try:
                    j[id]["nGpus"] += int(g[-1])
                except:
                    j[id]["nGpus"] += 1

        if debug:
            if j[id]["startTime"] != 0 and j[id]["schedNodes"] != None:
                print(id, j[id])
            if id in [2453709, 2405807, 2453086]:
                print(id, s)
                print(id, j[id])

    return j


def isFixedWidth(c):
    # return 0 if floating, otherwise the field width
    a = 0
    for j in c.split(","):
        for l in j.split("-"):  # eg. 011
            if len(l) != len("%d" % int(l)):
                return len(l)
    return a


# parse eg. "1,3,4-8,10-20,25" or "011-058"
def parseCpuList(cpus):
    c = []
    for i in cpus.split(","):
        ss = i.split("-")
        if len(ss) > 1:  # found a range
            for j in range(int(ss[0]), int(ss[1]) + 1):
                c.append(j)
        else:  # found a single
            if i[0] != ".":  # found a , "..." sigh
                c.append(int(i))
    return c


def expandSlurmNodeList(nl):
    # eg. john[4-6,9,23-27],bryan7
    #     gstar[011-058]
    hl = []
    # split on commas, and then fixup
    snl = []
    a = ""
    for h in nl.split(","):  # eg. john[4-6 9 23-27] bryan7
        if h[0].isdigit():
            a += "," + h
        else:
            if a != "":
                snl.append(a)
            a = h
    snl.append(a)
    # expand the ranges
    for h in snl:  # eg. john[4-6,9,23-27] bryan7
        if "[" not in h:
            hl.append(h)
            continue
        pre = h.split("[")[0]
        c = h.split("[")[1].split("]")[0]  # eg. 4-6,9 or 011-058
        # work out if it's fixed width fields or floating
        fw = isFixedWidth(c)
        for i in parseCpuList(c):
            if not fw:
                hl.append(pre + "%d" % i)
            else:
                hl.append(pre + str(i).rjust(fw, "0"))
    return hl


def reservations():
    a = pyslurm.reservation()
    res_dict = a.get()
    resnodes = {}
    # for the purposes of backfill, we're only interested in the next res on a node, and don't care if it's whole node or 1 core.
    # this will be incorrect for currently active res's that aren't whole node.
    for r, v in res_dict.items():
        if "node_list" in v.keys() and v["node_list"] != None:
            for n in expandSlurmNodeList(v["node_list"]):
                if n in resnodes.keys():
                    tprev = resnodes[n]
                    if v["start_time"] < tprev:
                        resnodes[n] = v["start_time"]
                else:
                    resnodes[n] = v["start_time"]
    # print('resnodes.keys()', resnodes.keys())
    # print('resnodes', resnodes)
    return resnodes


def do_all():
    data = {}
    data["nodes"] = nodes()
    data["jobs"] = jobs()
    data["res"] = reservations()

    return data


class bins:
    def __init__(self):
        self.data = {}
        self.keycache = []

    def add(self, k, m=0, d=0, t=None, node=None):
        if (
            t != None and t - time.time() < 0
        ):  # time is -ve. reservation started some time in the past. can't use this bin
            return
        if k not in self.keycache:
            self.data[k] = {
                "cnt": 1,
                "mem": [m],
                "disk": [d],
                "time": [t],
                "nodes": [node],
            }
            self.keycache = self.data.keys()
        else:
            self.data[k]["cnt"] += 1
            self.data[k]["mem"].append(m)
            self.data[k]["disk"].append(d)
            self.data[k]["time"].append(t)
            self.data[k]["nodes"].append(node)

    def bins(self):
        return self.keycache

    def cnt(self, i):
        return self.data[i]["cnt"]

    def mems(self, i):
        return self.data[i]["mem"]

    def disks(self, i):
        return self.data[i]["disk"]

    def nodes(self, i):
        return self.data[i]["nodes"]

    def memsAve(self, i):
        d = self.data[i]["mem"]
        return sum(d) / len(d)

    def memsMedian(self, i):
        d = self.data[i]["mem"]
        d.sort()
        return d[int(len(d) / 2)]

    def memsMin(self, i):
        d = self.data[i]["mem"]
        d.sort()
        return d[0]

    def memsMax(self, i):
        d = self.data[i]["mem"]
        d.sort()
        return d[-1]

    def disksAve(self, i):
        d = self.data[i]["disk"]
        return sum(d) / len(d)

    def disksMedian(self, i):
        d = self.data[i]["disk"]
        d.sort()
        return d[int(len(d) / 2)]

    def disksMin(self, i):
        d = self.data[i]["disk"]
        d.sort()
        return d[0]

    def disksMax(self, i):
        d = self.data[i]["disk"]
        d.sort()
        return d[-1]

    def timesMin(self, i):
        d = self.data[i]["time"]
        d = [x for x in d if x is not None]
        if len(d) == 0:
            return None  # all None => Inf time
        d.sort()
        return d[0]

    def timesMax(self, i):
        d = self.data[i]["time"]
        dn = [x for x in d if x is None]
        if len(dn) != 0:
            return None  # some None's => Inf time
        d = [x for x in d if x is not None]
        d.sort()
        return d[-1]

    def sum(self):
        s = 0
        for i, j in self.data.items():
            s += i * j["cnt"]
        return s


def minFutureJobTime(node, jobs, hn, res):
    st = None
    # future jobs
    for id in node["futureJobs"]:
        t = jobs[id]["startTime"]
        if st == None:
            st = t
        else:
            st = min(st, t)
    # next or current res
    if hn in res.keys():
        t = res[hn]
        if st == None:
            st = t
        else:
            st = min(st, t)
    # print('j in', st - time.time(), 'is', jobs[id])
    return st


def get_core_usage(data):
    # split gpu cores from cpu cores
    for id, job in data["jobs"].items():
        if job["state"] == "RUNNING":
            for n, l in job["layout"].items():
                # data['nodes'][n]['gpuJobsOnNode'].append(id)
                # data['nodes'][n]['gpuJobsCoresUsed'] += job['nCpus']
                k = "cpuLayout"
                r = "cpuJobCnt"
                if job["nGpus"] > 0:
                    k = "gpuLayout"
                    r = "gpuJobCnt"
                data["nodes"][n][k].extend(l)
                data["nodes"][n][r] += 1

        elif job["state"] == "PENDING":
            # store future jobs with the nodes they're going to run on
            if job["startTime"] != 0 and job["schedNodes"] != None:
                b = pyslurm.hostlist()
                b.create(job["schedNodes"])
                for n in b.get_list():
                    n = str(n, "utf-8")
                    # print(n,id)
                    data["nodes"][n]["futureJobs"].append(id)

    for hostname, node in data["nodes"].items():
        node["nCpuCores"] = len(node["cpuLayout"])
        node["nGpuCores"] = len(node["gpuLayout"])
        if debug:
            if hostname in [
                "john6",
                "john99",
                "gstar102",
                "sstar011",
                "sstar107",
                "sstar301",
                "gstar201",
                "bryan1",
                "gstar040",
                "gina3",
                "john32",
                "john34",
            ]:
                print(hostname, node)

    # bins of cores free
    bcu = {}
    u = {}
    for part, prefixes in PARTITIONS.items():
        # running/alloc, idle/avail, offline, blocked/unschedulable/inaccessible, total - for cores and nodes and gpus
        usage = {
            "cores": {"a": 0, "i": 0, "o": 0, "b": 0, "t": 0},
            "nodes": {"a": 0, "i": 0, "o": 0, "b": 0, "t": 0},
            "gpus": {"a": 0, "i": 0, "o": 0, "b": 0, "t": 0},
        }
        bc = bins()

        for hostname, node in data["nodes"].items():
            for prefix in prefixes:
                if prefix in hostname:
                    # gpu jobs get 4 cores (in skylake-gpu), but can use more
                    gpuCoresMax = max(partitionResGpuCores[part], node["nGpuCores"])
                    # cpu jobs get the rest. ie. max 32 on skylake
                    cpuCoresMax = node["nCpus"] - gpuCoresMax

                    nCpuIdleCores = cpuCoresMax - node["nCpuCores"]
                    nGpuIdleCores = gpuCoresMax - node["nGpuCores"]

                    # which type of cores we are considering
                    ty = "nCpuCores"
                    if part == "skylake-gpu":
                        ty = "nGpuCores"

                    # unavail nodes do not contribute to free counts
                    if node["avail"]:
                        # can't schedule jobs on these cores for a variety of reasons
                        unsched = 0

                        # find idle and idle per-socket layouts
                        if part == "skylake":
                            # ideally gpus would have 2 cores reserved on each socket but that's not actually
                            # the case - they get >= 4 cores overall.

                            # assume 0-17 on socket0, 18-35 on socket1
                            s0 = 0
                            s1 = 0
                            g0 = 0
                            g1 = 0
                            for i in node["cpuLayout"]:
                                if i < 18:
                                    s0 += 1
                                else:
                                    s1 += 1
                            for i in node["gpuLayout"]:
                                if i < 18:
                                    g0 += 1
                                else:
                                    g1 += 1
                            if debug:
                                if s0 + s1 != node["nCpuCores"]:
                                    print(
                                        hostname,
                                        "err: cpu: ",
                                        s0,
                                        "+",
                                        s1,
                                        "!=",
                                        node["nCpuCores"],
                                        "node",
                                        node,
                                    )
                                if g0 + g1 != node["nGpuCores"]:
                                    print(
                                        hostname,
                                        "err: gpu: ",
                                        g0,
                                        "+",
                                        g1,
                                        "!=",
                                        node["nGpuCores"],
                                        "node",
                                        node,
                                    )

                            # g0+g1  = 0 - 4 cores held idle (no gpu jobs running)
                            # g0+g1 >= 4 - 0 cores held idle
                            # but we could be a weird situation where previous gpu jobs (eg. 4 cores, 1 gpu) have skewed the cpus used
                            # on each socket, so even though if there are cores avail we don't know where they'll be.
                            cpuCoresIdle0 = 18 - (s0 + g0)
                            cpuCoresIdle1 = 18 - (s1 + g1)

                            # also need to take account of inaccessible.
                            # eg. all gpus used, but not all 4 gpu cores used. so some cores unschedulable
                            gpuRes = g0 + g1
                            if (
                                node["nGpusUsed"] == node["nGpus"]
                            ):  # both gpus being used
                                if gpuRes < 4:
                                    unsched += 4 - gpuRes

                            # just round-robin subtract
                            for i in range(0, 4 - gpuRes):
                                if i % 2:
                                    if cpuCoresIdle0 == 0:
                                        cpuCoresIdle1 -= 1
                                    else:
                                        cpuCoresIdle0 -= 1
                                else:
                                    if cpuCoresIdle1 == 0:
                                        cpuCoresIdle0 -= 1
                                    else:
                                        cpuCoresIdle1 -= 1

                            if debug:
                                if cpuCoresIdle0 < 0 or cpuCoresIdle1 < 0:
                                    print(
                                        "nope, you stuffed up idle",
                                        cpuCoresIdle0,
                                        cpuCoresIdle1,
                                        "node",
                                        node,
                                    )
                                if cpuCoresIdle0 + cpuCoresIdle1 != nCpuIdleCores:
                                    print(
                                        hostname,
                                        "err",
                                        cpuCoresIdle0,
                                        "+",
                                        cpuCoresIdle1,
                                        "+",
                                        unsched,
                                        "!=",
                                        nCpuIdleCores,
                                        "node",
                                        node,
                                    )

                            # also need to take account of inaccessible.
                            #     1-4 cores slots for cpu jobs on non-smalljobs, non-largemem nodes will never be used
                            if (
                                cpuCoresIdle0 + cpuCoresIdle1 <= 16
                            ):  # small jobs could run and would have socket affinity set
                                if not (
                                    "smalljobs" in node["features"]
                                    or "largemem" in node["features"]
                                ):
                                    if cpuCoresIdle0 != 0 and cpuCoresIdle0 <= 4:
                                        unsched += cpuCoresIdle0
                                        cpuCoresIdle0 = 0
                                        if debug:
                                            print(
                                                "not smalljobs",
                                                "cpuCoresIdle0",
                                                cpuCoresIdle0,
                                                "cpuCoresIdle1",
                                                cpuCoresIdle1,
                                                "unsched",
                                                unsched,
                                                hostname,
                                                node,
                                            )
                                    if cpuCoresIdle1 != 0 and cpuCoresIdle1 <= 4:
                                        unsched += cpuCoresIdle1
                                        cpuCoresIdle1 = 0
                                        if debug:
                                            print(
                                                "not smalljobs",
                                                "cpuCoresIdle1",
                                                cpuCoresIdle1,
                                                "cpuCoresIdle0",
                                                cpuCoresIdle0,
                                                "unsched",
                                                unsched,
                                                hostname,
                                                node,
                                            )

                            if debug:
                                if (
                                    cpuCoresIdle0 + cpuCoresIdle1 + unsched
                                    < nCpuIdleCores
                                ):
                                    print(
                                        hostname,
                                        "err2",
                                        cpuCoresIdle0,
                                        "+",
                                        cpuCoresIdle1,
                                        "+",
                                        unsched,
                                        "<",
                                        nCpuIdleCores,
                                        "node",
                                        node,
                                    )

                            if debug:
                                if part == "skylake" and unsched > 0:
                                    print("blocked core", unsched, hostname, node)

                            if debug:
                                if node["nCpus"] - node["nCpusUsed"] - unsched < 0:
                                    print("err3", unsched, hostname, node)

                            if (
                                debug
                                and node["nCpus"]
                                - node["nCpusUsed"]
                                - (cpuCoresIdle0 + cpuCoresIdle1 + unsched)
                                != 0
                            ):
                                print(
                                    "unsched",
                                    "free - (c0+c1+un)",
                                    node["nCpus"]
                                    - node["nCpusUsed"]
                                    - (cpuCoresIdle0 + cpuCoresIdle1 + unsched),
                                    "cpuCoresIdle0",
                                    cpuCoresIdle0,
                                    "cpuCoresIdle1",
                                    cpuCoresIdle1,
                                    "unsched",
                                    unsched,
                                    hostname,
                                    node,
                                )

                            # affinity kicks in here:
                            #   16,32 core jobs need whole (16 core) sockets
                            #   <16 core jobs need to be on 1 socket
                            # eg.
                            # 2,4 free cores means max 1x4 and 1x2 core jobs can run, but not a 6
                            # 2,14 free cores means max 1x14 and 1x2 core jobs can run, but not a 16
                            # 8,8 free cores means max 2x8 core jobs can run, but not a 16
                            # 10,6 free cores means 1x10 and 1x6 can run but not a 16
                            # 10,8 free cores means 1x18 job (no affinity set)
                            # 16,0 free cores means 1x16 job
                            # 17,1 free cores means 1x18 job (no affinity set)
                            # 18,0 free cores means 1x18 job (no affinity set)
                            # 16,8 free cores means 1x24 job (no affinity set)
                            # 15,15 free cores means 1x30 job (no affinity set)
                            # it's never eg. 18,0 free 'cos of gpu reserved cores
                            #
                            # so:
                            #  if >16 total free then that's the job size
                            #  else it's the per-socket numbers
                            c = cpuCoresIdle0 + cpuCoresIdle1
                            if c > 0:
                                m = (node["realMem"] - node["allocMem"]) / c
                                d = (node["realDisk"] - node["allocDisk"]) / c

                                # cores/nodes can be unavail because of being out of ram or disk too
                                if d <= 100 or m <= 100:  # 100 MB per core
                                    unsched += cpuCoresIdle0 + cpuCoresIdle1
                                    cpuCoresIdle0 = 0
                                    cpuCoresIdle1 = 0
                                    if debug:
                                        print("mem/disk blocked:", hostname, m, d)
                                else:
                                    mint = minFutureJobTime(
                                        node, data["jobs"], hostname, data["res"]
                                    )
                                    if c > 16:
                                        bc.add(c, m, d, mint, hostname)
                                    else:
                                        if cpuCoresIdle0 > 0:
                                            bc.add(cpuCoresIdle0, m, d, mint, hostname)
                                        if cpuCoresIdle1 > 0:
                                            bc.add(cpuCoresIdle1, m, d, mint, hostname)
                        else:  # not skylake
                            if part != "skylake-gpu":
                                # sstar, gstar, knl avail
                                if nCpuIdleCores > 0:
                                    m = (
                                        node["realMem"] - node["allocMem"]
                                    ) / nCpuIdleCores
                                    d = (
                                        node["realDisk"] - node["allocDisk"]
                                    ) / nCpuIdleCores

                                    # cores/nodes can be unavail because of being out of ram or disk too
                                    if d <= 100 or m <= 100:  # 100 MB per core
                                        unsched += nCpuIdleCores
                                        nCpuIdleCores = 0
                                        if debug:
                                            print("mem/disk blocked:", hostname, m, d)
                                    else:
                                        mint = minFutureJobTime(
                                            node, data["jobs"], hostname, data["res"]
                                        )
                                        bc.add(nCpuIdleCores, m, d, mint, hostname)

                        # cores
                        if part == "skylake-gpu":
                            c = nGpuIdleCores - unsched
                            if c > 0:
                                m = (node["realMem"] - node["allocMem"]) / c
                                d = (node["realDisk"] - node["allocDisk"]) / c

                                # cores/nodes can be unavail because of being out of ram or disk too
                                if d <= 100 or m <= 100:  # 100 MB per core
                                    unsched = nGpuIdleCores

                            usage["cores"]["i"] += nGpuIdleCores - unsched
                            usage["cores"]["t"] += gpuCoresMax
                            usage["cores"]["b"] += unsched
                        elif part == "skylake":
                            usage["cores"]["i"] += cpuCoresIdle0 + cpuCoresIdle1
                            usage["cores"]["t"] += cpuCoresMax
                            usage["cores"]["b"] += unsched
                        else:
                            usage["cores"]["i"] += nCpuIdleCores
                            usage["cores"]["t"] += cpuCoresMax
                            usage["cores"]["b"] += unsched
                        usage["cores"]["a"] += node[ty]

                        # nodes
                        if node[ty] == 0:
                            usage["nodes"]["i"] += 1
                        else:
                            usage["nodes"]["a"] += 1
                        usage["nodes"]["t"] += 1

                        # gpus
                        if part != "skylake":
                            # if there are any cores free then gpu jobs can run
                            if node["nCpus"] - node["nCpusUsed"] > 0:
                                usage["gpus"]["i"] += node["nGpus"] - node["nGpusUsed"]
                            else:
                                if debug:
                                    if (
                                        part == "skylake-gpu"
                                        and node["nGpus"] - node["nGpusUsed"] > 0
                                    ):
                                        print(
                                            "blocked gpu",
                                            node["nGpus"] - node["nGpusUsed"],
                                            node,
                                        )
                                usage["gpus"]["b"] += (
                                    node["nGpus"] - node["nGpusUsed"]
                                )  # blocked/unavail
                            # if part == 'skylake-gpu' and node['nGpus'] - node['nGpusUsed'] != 0:
                            #     print(hostname, node['nGpus'], node['nGpusUsed'], node['nGpus'] - node['nGpusUsed'])
                            usage["gpus"]["a"] += node["nGpusUsed"]
                            usage["gpus"]["t"] += node["nGpus"]

                    else:
                        # non-avail nodes - drained, draining, down, reserved (& unused)

                        # cores
                        if part == "skylake-gpu":
                            usage["cores"]["o"] += nGpuIdleCores
                        else:
                            usage["cores"]["o"] += nCpuIdleCores
                        usage["cores"]["a"] += node[ty]
                        usage["cores"]["t"] += node[ty]

                        # nodes
                        if node["nCpusUsed"] > 0:
                            usage["nodes"]["a"] += 1
                        usage["nodes"]["o"] += 1
                        usage["nodes"]["t"] += 1

                        # gpus
                        if part != "skylake":
                            usage["gpus"]["o"] += node["nGpus"] - node["nGpusUsed"]
                            usage["gpus"]["a"] += node["nGpusUsed"]
                            usage["gpus"]["t"] += node["nGpusUsed"]

                    if debug:
                        if (
                            node["nCpus"] == 0
                            and node["state"] != "IDLE"
                            and node["avail"]
                        ):
                            print(
                                "state not idle or unavail, yet 0 cores used",
                                hostname,
                                node,
                            )
                        if (
                            node["nGpusUsed"] > 0
                            and node["nGpuCores"] == 0
                            or node["nGpusUsed"] == 0
                            and node["nGpuCores"] > 0
                        ):
                            print("gpu count mismatch", hostname, node)
                        # pretty often be transiently wrong
                        if node["nCpusUsed"] != (node["nGpuCores"] + node["nCpuCores"]):
                            print("cpu count mismatch", hostname, node)

        # if debug:
        #    print(part, usage)

        # for a, b in usage.items():
        #    s = 0
        #    for i, j in b.items():
        #        if i == 't' or i == 'o':
        #            continue
        #        s += j
        #    if s != b['t'] - b['o']:
        #        print('usage total wrong', 'sum', s, part, a, b)

        u[part] = usage
        bcu[part] = bc

        if debug:
            print(bc.data, "sum", bc.sum())
        # print(bc.data, 'sum', bc.sum())

    return u, bcu


def printVerbose(a, gpus="yup"):
    print("             ", end="")
    if gpus == "first":
        for i in ["gpus", "cores", "nodes"]:
            if i == "cores":
                print("   (  ", end="")
            print(
                i,
                "a/i/o/b/t %d/%d/%d/%d/%d  "
                % (a[i]["a"], a[i]["i"], a[i]["o"], a[i]["b"], a[i]["t"]),
                end="",
            )
            if i == "nodes":
                print(")", end="")
    else:
        for i in ["cores", "nodes", "gpus"]:
            if i == "gpus" and gpus != "yup":
                continue
            print(
                i,
                "a/i/o/b/t %d/%d/%d/%d/%d  "
                % (a[i]["a"], a[i]["i"], a[i]["o"], a[i]["b"], a[i]["t"]),
                end="",
            )
    print("")


def secondsToStr(t):
    t = int(t - time.time())
    h = int(t / (3600))
    m = int((t - h * 3600) / 60)
    s = t - h * 3600 - m * 60
    return "%d:%.2d:%.2d" % (h, m, s)


def uniq(list):
    l = []
    prev = None
    for i in list:
        if i != prev:
            l.append(i)
        prev = i
    return l


# compress a list of integers into the minimal cexec-like list
def compressList(l):
    l = sorted(l)
    l = uniq(l)
    c = []
    start = -1
    end = -1
    for i in range(len(l)):
        if start == -1:
            start = l[i]
        if i == len(l) - 1 or l[i] + 1 != l[i + 1]:
            c.append((start, end))
            start = -1
            end = -1
        else:
            end = l[i + 1]

    s = ""
    last = len(c) - 1
    for i, (start, end) in enumerate(c):
        if end == -1:
            s += "%d" % start
        else:
            s += "%d-%d" % (start, end)
        if i != last:
            s += ","

    return s


def mysplit(s):
    head = s.rstrip("0123456789")
    tail = s[len(head) :]
    return head, tail


def compact(l):
    c = {}
    for i in l:
        pre, n = mysplit(i)
        if pre not in c.keys():
            c[pre] = []
        c[pre].append(int(n))
    # sort
    cc = {}
    for i in c.keys():
        c[i].sort()
    return c


def toCexec(c):
    mp = {"bryan": "b", "gina": "g", "john": "j", "sstar": "ss", "gstar": "gs"}
    cc = ""
    for i in c.keys():
        if i in mp.keys():
            cc += mp[i] + ":"
        cc += compressList(c[i])
        cc += " "
    return cc


def printFreeBins(b, n, lmp, ldp, printNodes=0, prefix=" "):
    cores = sorted(b.bins(), reverse=True)
    # print(cores)
    for i in cores:
        t = "cores"
        for j in n:  # list of whole nodes have this many cores
            if i == j:
                t = "nodes"
                break

        if printNodes == 2:
            print("  cores %d" % i)
            print("    (mem,disk,time)")
            d = b.data[i]
            for k in range(len(d["nodes"])):
                t = d["time"][k]
                if t == None or (t - time.time()) > TMAX:
                    t = "Inf"
                else:
                    t = secondsToStr(t)
                print(
                    " " * 10 + d["nodes"][k],
                    "(%d,%d,%s)" % (int(d["mem"][k]), int(d["disk"][k]), t),
                )
            continue

        lowMem = ""
        if b.memsMedian(i) < lmp or b.memsAve(i) < lmp or b.memsMin(i) < 1:
            lowMem = "(low memory jobs only)"
            if b.memsMax(i) < 10:
                lowMem = "(zero memory jobs only)"
            elif b.memsMin(i) < 1:
                lowMem = "(low/zero memory jobs only)"
        lowDisk = ""
        if b.disksMedian(i) < ldp or b.disksAve(i) < ldp or b.disksMin(i) < 100:
            lowDisk = "(low tmp disk jobs only)"
            if b.disksMax(i) < 200:
                lowDisk = "(zero tmp disk jobs only)"
            elif b.disksMin(i) < 100:
                lowDisk = "(low/zero tmp disk jobs only)"
        tmin = b.timesMin(i)
        tmax = b.timesMax(i)
        if tmin == None:
            ts = ""  # Inf time
        else:
            sm = secondsToStr(tmin)
            if tmax == None or (tmax - time.time()) > TMAX:
                sM = "    Inf"
            else:
                sM = secondsToStr(tmax)
            if sm == sM:
                ts = "for %s             " % sM
            else:
                ts = "for %s to %s " % (sm, sM)

        if printNodes == 1:
            detail = ""
            if lowMem != "":
                detail += " mem %d/%d/%d" % (
                    int(b.memsMin(i)),
                    int(b.memsAve(i)),
                    int(b.memsMedian(i)),
                )
            if lowDisk != "":
                detail += " disk %d/%d/%d" % (
                    int(b.disksMin(i)),
                    int(b.disksAve(i)),
                    int(b.disksMedian(i)),
                )
            if detail != "":
                detail = " --- free MB per core (min/ave/median):" + detail

        if t == "nodes":  # whole nodes
            if b.cnt(i) == 1:
                t = "node "
            # print('%3d %s free' % (b.cnt(i), t), '(%d cores total)' % (i*b.cnt(i)), 'for unknown time', b.mems(i),'ave',b.memsAve(i),'median',b.memsMedian(i),lowMem)
            print(
                prefix + "%3d %s (%d core) free" % (b.cnt(i), t, i),
                "(%d cores total)" % (i * b.cnt(i)),
                ts + lowMem + lowDisk,
            )
            if printNodes == 1:
                print(prefix + "     ", toCexec(compact(b.nodes(i))) + detail)
        else:
            s = "slots"
            if b.cnt(i) == 1:
                s = "slot "
            # print('%3d %s for %d-core jobs free' % (b.cnt(i), s, i), '(%d cores total)' % (i*b.cnt(i)), 'for unknown time', b.mems(i),'ave',b.memsAve(i),'median',b.memsMedian(i),lowMem)
            print(
                prefix + "%3d %s for %d-core jobs free" % (b.cnt(i), s, i),
                "(%d cores total)" % (i * b.cnt(i)),
                ts + lowMem + lowDisk,
            )
            if printNodes == 1:
                print(prefix + "     ", toCexec(compact(b.nodes(i))) + detail)


def usage(n):
    if n == "qinfo":
        print("Usage: qinfo [-h] [-s|-v]")
        print("    Current node/core/gpu availability in each queue (partition).")
        print(" -v    Show more information.")
        print(" -s    Displayed in a format similar to 'sinfo -s'")
        print(" -h    this help")
    elif n == "showbf":
        print("Usage: " + n)
        print("   Show backfill information for each queue/partition.")
        print()
        print("   Jobs submitted with resource requests less than these backfill")
        print("   values should run immediately.")
        print("   eg.")
        print("      1 node  (32 core) free (32 cores total) for 1:10:16")
        print(
            "   Means you can sbatch a 1 node, 32 core, 1 hour job and it should run now"
        )
        print("   (allow ~5 mins for scheduling).")
        print()
        print("   This script includes some knowledge of resources constrainted due to")
        print(
            "   queue partitioning, socket affinity, ram, etc. so is mostly accurate."
        )
    else:
        print("no help available")
    sys.exit(0)


if __name__ == "__main__":
    # how are we being run
    n = sys.argv[0].split("/")[-1]

    if len(sys.argv) > 1:
        if sys.argv[1] in ["-h", "--help", "-help"]:
            usage(n)
        elif n == "showbf" and (sys.argv[1] != "-v" and sys.argv[1] != "-vv"):
            usage(n)
        elif n == "qinfo" and (sys.argv[1] != "-s" and sys.argv[1] != "-v"):
            usage(n)

    # Get all data
    data = do_all()
    # print(data)
    # print('jobs', data['jobs'].keys(), 'len', len(data['jobs'].keys()))
    # print('nodes', data['nodes'].keys(), 'len', len(data['nodes'].keys()))
    u, bcu = get_core_usage(data)
    # print(u)

    if n == "spart.py":
        for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
            # percent avail/tot
            perc = {}
            for i in ["nodes", "cores", "gpus"]:
                perc[i] = 0
                if u[k][i]["t"] > 0:
                    perc[i] = 100 * u[k][i]["a"] / u[k][i]["t"]

            if k in ["skylake", "knl"]:
                print(
                    "%12s" % k,
                    "idle cores",
                    u[k]["cores"]["i"],
                    "used",
                    str(int(perc["cores"])) + "%,",
                    "idle nodes",
                    u[k]["nodes"]["i"],
                    "used",
                    str(int(perc["nodes"])) + "%,",
                )
                printVerbose(u[k], gpus="nope")
            elif k == "skylake-gpu":
                print(
                    "%12s" % k,
                    "idle gpus",
                    u[k]["gpus"]["i"],
                    "used",
                    str(int(perc["gpus"])) + "%",
                    "(idle cores %d%% idle nodes %d%%)"
                    % (int(perc["cores"]), int(perc["nodes"])),
                )
                printVerbose(u[k], gpus="first")
            else:
                print(
                    "%12s" % k,
                    "idle cores",
                    u[k]["cores"]["i"],
                    "used",
                    str(int(perc["cores"])) + "%,",
                    "idle nodes",
                    u[k]["nodes"]["i"],
                    "used",
                    str(int(perc["nodes"])) + "%,",
                    "idle gpus",
                    u[k]["gpus"]["i"],
                    "used",
                    str(int(perc["gpus"])) + "%",
                )
                printVerbose(u[k])

            printFreeBins(
                bcu[k],
                partitionMaxCpuCores[k],
                partitionLowMem[k],
                partitionLowDisk[k],
                False,
                " " * 16,
            )

    elif n == "qinfo":
        if len(sys.argv) > 1 and sys.argv[1] == "-s":
            # output a bit like sinfo -s
            s = {}
            for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
                for i in ["cores", "nodes", "gpus"]:
                    d = u[k][i]
                    if k in ["skylake", "knl"]:
                        s[(k, i)] = "%d/%d/%d/%d/%d" % (
                            d["a"],
                            d["i"],
                            d["o"],
                            d["b"],
                            d["t"],
                        )
                    elif k == "skylake-gpu":
                        s[(k, i)] = "%d/%d/%d/%d/%d" % (
                            d["a"],
                            d["i"],
                            d["o"],
                            d["b"],
                            d["t"],
                        )
                    else:
                        s[(k, i)] = "%d/%d/%d/%d/%d" % (
                            d["a"],
                            d["i"],
                            d["o"],
                            d["b"],
                            d["t"],
                        )

            # find max field lengths
            l = {}
            for i in ["cores", "nodes", "gpus"]:
                l[i] = 0
                for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
                    l[i] = max(l[i], len(s[(k, i)]))
            # print(l)
            spc = 2
            print(
                "QUEUE     "
                + " " * (spc + max(0, l["nodes"] - 16))
                + "NODES(A/I/O/B/T)"
                + " " * (spc + max(0, l["cores"] - 16))
                + "CORES(A/I/O/B/T)"
                + " " * (spc + max(0, l["gpus"] - 15))
                + "GPUS(A/I/O/B/T)"
            )
            for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
                print(k + " " * (13 - len(k)), end="")
                for i in ["nodes", "cores", "gpus"]:
                    fudge = 0
                    if i == "gpus" and k != "skylake-gpu":
                        fudge = 1
                    if k in ["skylake", "knl"] and i == "gpus":
                        print(" " * (spc + fudge + int(l[i] / 2)) + "-", end="")
                    elif k == "skylake-gpu" and i == "cores":
                        print(
                            " " * (spc + fudge + l[i] - len(s[(k, i)]))
                            + s[(k, i)]
                            + "+",
                            end="",
                        )
                    else:
                        print(
                            " " * (spc + fudge + l[i] - len(s[(k, i)])) + s[(k, i)],
                            end="",
                        )
                print()
            print()
            print("  A/I/O/B/T = Allocated/Idle/Offline/Blocked/Total")
            print("     Blocked resources are those that are idle but unavailable")
            print("     due to resource requests from other jobs.")
            # print('     eg. node ram exhausted, no cpu cores available for a gpu job.')
            sys.exit(0)

        elif len(sys.argv) > 1 and sys.argv[1] == "-v":
            # eg.
            # QUEUE                  NODES                     CORES                      GPUS
            #                  A   I   O   B   T         A    I    O    B    T        A   I   O   B   T
            # -----------------------------------------------------------------------------------------
            # skylake        114   3   0   0 117      3188  533    0  249 3744             -
            # skylake-gpu    116   1   0   0 117       227  241    0    0  468+     227   5   0   0 232
            # sstar           63  11  15   0  89       996  204  240    0 1200        0  19   6 106 125
            # gstar            3  47   4   0  54        44  572   88   24  640        0  94   9   0  94
            # knl              0   3   1   0   4         0  816  272    0  816             -

            cols = ["nodes", "cores", "gpus"]
            colGap = 4

            # find column widths for each section
            cw = {}
            for i in cols:
                cw[i] = 1
                for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
                    d = u[k][i]
                    for j, v in d.items():
                        # print(j,v)
                        if v > 0:
                            cw[i] = max(cw[i], 2 + int(math.log10(v)))
            cw["queue"] = 0
            for k in [
                "partition",
                "queue/",
                "skylake",
                "skylake-gpu",
                "sstar",
                "gstar",
                "knl",
            ]:
                cw["queue"] = max(cw["queue"], len(k))
            # print(cw)
            print("QUEUE/" + (cw["queue"] - len("QUEUE/") + colGap) * " ", end="")
            for i in cols:
                x = 5 * cw[i] - len(i) + colGap
                y = x // 2
                x = x - y
                if i == cols[-1]:
                    x = 0
                print(y * " " + i.upper() + x * " ", end="")
            print()
            print("PARTITION" + (cw["queue"] - len("PARTITION") + colGap) * " ", end="")
            for i in cols:
                for j in ["A", "I", "O", "B", "T"]:
                    print((cw[i] - 1) * " " + j, end="")
                if i != cols[-1]:
                    print(" " * colGap, end="")
            print()
            print((cw["queue"] + colGap) * "-", end="")
            for i in cols:
                if i != cols[-1]:
                    print((5 * cw[i] + colGap) * "-", end="")
                else:
                    print((5 * cw[i]) * "-", end="")
            print()
            for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
                print(k + (cw["queue"] - len(k) + colGap) * " ", end="")
                for i in cols:
                    for j in ["a", "i", "o", "b", "t"]:
                        print(
                            "{num:{field_size}d}".format(
                                num=u[k][i][j], field_size=(cw[i])
                            ),
                            end="",
                        )
                    if i != cols[-1]:
                        print(" " * colGap, end="")
                print()
            print()
            print("  A/I/O/B/T = Allocated/Idle/Offline/Blocked/Total")
            print("     Blocked resources are those that are idle but unavailable")
            print("     due to resource requests from other jobs.")
            sys.exit(0)

        elif len(sys.argv) > 1:
            usage(n)

        # short version
        print("               Idle/Available")
        print("Partition    Nodes  Cores   Gpus")
        for k in ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]:
            print(k + " " * (11 - len(k)), end="")
            for i in ["nodes", "cores", "gpus"]:
                d = u[k][i]
                if k in ["skylake", "knl"] and i == "gpus":
                    print("      -", end="")
                else:
                    print("%7d" % d["i"], end="")
            print()

    elif n == "showbf":
        printNodes = 0
        if len(sys.argv) > 1 and sys.argv[1] == "-v":
            printNodes = 1
        elif len(sys.argv) > 1 and sys.argv[1] == "-vv":
            printNodes = 2

        for k in ["skylake", "sstar", "gstar", "knl"]:
            print(k)
            printFreeBins(
                bcu[k],
                partitionMaxCpuCores[k],
                partitionLowMem[k],
                partitionLowDisk[k],
                printNodes,
            )

    sys.exit(0)
