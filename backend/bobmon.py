#!/usr/bin/env python3

API_VERSION = 12

import gzip
import sys
from os import path
from os import remove
from file_utils import write_data
from datetime import datetime
from glob import glob
import time
import json
import bobmon_config as config
import influx_config
import bobmon_ganglia as ganglia
from bobmon_gpu_mapping import GPUmapping
import pyslurm
from influxdb import InfluxDBClient
import pwd
import re
import showbf
import math

KB = 1024

class Backend:
    def __init__(self, no_history):
        # Data
        self.data = {}

        # Backfill data
        self.backfill = {}

        # Dict of username mappings
        self.usernames = {}

        # Initialise GPU mapping determination
        self.ga = GPUmapping()

        # Load usage from disk
        self.usage_cache = {'history': {}}
        if not no_history:
            self.usage_from_disk()

    @classmethod
    def timestamp(cls):
        # Seconds since epoch
        d = datetime.now()
        return int(time.mktime(d.timetuple()))

    @staticmethod
    def cpu_usage(data, name):
        try:
            total = {
                'user':     float(data['cpu_user']),
                'nice':     float(data['cpu_nice']),
                'system':   float(data['cpu_system']),
                'wait':     float(data['cpu_wio']),
                'idle':     float(data['cpu_idle']),
            }

            totalC = [math.floor(total[x]) for x in config.CPU_KEYS]

            core = []
            for i in range(config.MULTICPU_MAX):
                try:
                    vals = {
                        'user':     float(data['multicpu_user{:}'.format(i)]),
                        'nice':     float(data['multicpu_nice{:}'.format(i)]),
                        'system':   float(data['multicpu_system{:}'.format(i)]),
                        'wait':     float(data['multicpu_wio{:}'.format(i)]),
                        'idle':     float(data['multicpu_idle{:}'.format(i)]),
                    }
                    core += [vals]
                except:
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
                    if (i % 2 == 0):
                        core_left += [x]
                    else:
                        core_right += [x]
                core = core_left + core_right

            coreC = [ [math.floor(c[x]) for x in config.CPU_KEYS] for c in core]

            # totalC: compact total, coreC: compact core
            # return {'total': total, 'core': core, 'totalC': totalC, 'coreC': coreC}
            return {'totalC': totalC, 'coreC': coreC}
        except KeyError:
            print(name, 'cpu user/nice/system/wio/idle not in ganglia')

    @staticmethod
    def mem(data, name):
        try:
            used = float(data['mem_total']) \
                - float(data['mem_buffers']) \
                - float(data['mem_cached'])\
                - float(data['mem_free'])

            # convert to MB
            return {
                'used':  math.ceil(used / KB),
                'total': math.ceil(float(data['mem_total']) / KB)
            }

        except:
            now = time.time()
            if now - data['reported'] < config.NODE_DEAD_TIMEOUT:
                print(name, 'mem gmond data is incomplete')

    @staticmethod
    def swap(data, name):
        try:
            # convert to MB
            return {
                'free':     math.ceil(float(data['swap_free']) / KB),
                'total':    math.ceil(float(data['swap_total']) / KB)
            }
        except KeyError:
            print(name, 'swap not in ganglia')

    @staticmethod
    def disk(data, name):
        try:
            return {
                'free':     math.ceil(float(data['disk_free'])),
                'total':    math.ceil(float(data['disk_total']))
            }
        except KeyError:
            print(name, 'disk not in ganglia')

    @staticmethod
    def temps(data):
        t = {}
        if 'cpu1_temp' in data.keys():
            t['cpu1'] = int(data['cpu1_temp'].split('.')[0])
            if 'cpu2_temp' in data.keys():
                t['cpu2'] = int(data['cpu2_temp'].split('.')[0])
            else:
                t['cpu2'] = t['cpu1']

        if 'front_temp' in data.keys():
            t['front'] = int(data['front_temp'].split('.')[0])
            if 'rear_temp' in data.keys():
                t['rear'] = int(data['rear_temp'].split('.')[0])
            else:
                t['rear'] = t['front']

        if 'chassis_temp' in data.keys():
            t['chassis'] = int(data['chassis_temp'].split('.')[0])

        if len(t.keys()) > 0:
            return t

    @staticmethod
    def power(data):
        p = {}
        if 'node_power' in data.keys():
            p['node'] = int(data['node_power'].split('.')[0])
        if 'cmm_power_in' in data.keys():
            p['blade_chassis'] = int(data['cmm_power_in'].split('.')[0])

        if len(p.keys()) > 0:
            return p

    @staticmethod
    def fans(data):
        f = {}
        if 'fan_rms' in data.keys():
            f['rms'] = int(data['fan_rms'].split('.')[0])

        if len(f.keys()) > 0:
            return f

    @staticmethod
    def gpus(data):
        g = {}
        gpu_count = 0
        for i in range(7):
            metric_name = 'gpu{:d}_util'.format(i)
            if metric_name in data.keys():
                gpu_count += 1
                api_name = 'gpu{:d}'.format(i)
                g[api_name] = float(data[metric_name])

        return g

    @staticmethod
    def infiniband(data):
        n = {}
        if 'ib_bytes_in' in data.keys():
            n['bytes_in'] = math.ceil(float(data['ib_bytes_in']))

        if 'ib_bytes_out' in data.keys():
            n['bytes_out'] = math.ceil(float(data['ib_bytes_out']))

        if 'ib_pkts_in' in data.keys():
            n['pkts_in'] = math.ceil(float(data['ib_pkts_in']))

        if 'ib_pkts_out' in data.keys():
            n['pkts_out'] = math.ceil(float(data['ib_pkts_out']))


        if len(n.keys()) > 0:
            return n

    @staticmethod
    def lustre(data):
        l = {}
        if 'farnarkle_fred_read_bytes' in data.keys():
            l['read'] = math.ceil(float(data['farnarkle_fred_read_bytes']))

        if 'farnarkle_fred_write_bytes' in data.keys():
            l['write'] = math.ceil(float(data['farnarkle_fred_write_bytes']))

        if len(l.keys()) > 0:
            return l

    @staticmethod
    def jobfs(data):
        j = {}
        if 'diskstat_sda_read_bytes_per_sec' in data.keys():
            j['read'] = math.ceil(float(data['diskstat_sda_read_bytes_per_sec']))

        if 'diskstat_sda_write_bytes_per_sec' in data.keys():
            j['write'] = math.ceil(float(data['diskstat_sda_write_bytes_per_sec']))

        if len(j.keys()) > 0:
            return j

    @classmethod
    def nodes(cls):
        all = ganglia.Stats(do_cpus=True).all

        now = time.time()  # seconds since 1970

        pyslurm_nodes = pyslurm.node().get()

        nodes = {}
        for host in all.keys():
            nodes[host] = {}

            # If node is up
            if now - all[host]['reported'] < config.NODE_DEAD_TIMEOUT:
                nodes[host]['up'] = True
            else:
                nodes[host]['up'] = False

            nodes[host]['cpu']          = cls.cpu_usage(all[host], host)
            nodes[host]['mem']          = cls.mem(all[host], host)
            nodes[host]['swap']         = cls.swap(all[host], host)
            nodes[host]['disk']         = cls.disk(all[host], host)
            # nodes[host]['temps']        = cls.temps(all[host])
            # nodes[host]['power']        = cls.power(all[host])
            # nodes[host]['fans']         = cls.fans(all[host])
            nodes[host]['gpus']         = cls.gpus(all[host])
            nodes[host]['infiniband']   = cls.infiniband(all[host])
            nodes[host]['lustre']       = cls.lustre(all[host])
            nodes[host]['jobfs']        = cls.jobfs(all[host])

            nodes[host]['isCounted'] = False
            if host in pyslurm_nodes.keys():
                for prefix in config.CORE_COUNT_NODES:
                    if prefix in host:
                        nodes[host]['isCounted'] = True
                        break
                nodes[host]['nCpus'] = pyslurm_nodes[host]['cpus']
                nodes[host]['nGpus'] = 0
                for gres in pyslurm_nodes[host]['gres']:
                    g = gres.split(':')
                    if (g[0] == 'gpu'):
                        nodes[host]['nGpus'] += int(g[2][0])

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
                        new_name = name[:3 + add_letters]

            self.usernames[name] = new_name

        return self.usernames[name]

    @classmethod
    def expand_array(cls, r):
        # ignore % 'run-at once'
        if '%' in r:
            r = r.split('%')[0]
        # remember step
        step = 1
        if ':' in r:
            i = r.split(':')
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
        for i in r.split(','):
            ss = i.split('-')
            if len(ss) > 1: # found a range
                # If range is truncated, just append first number
                if ss[1] == '...':
                    c.append(int(ss[0]))
                else:
                    for j in range(int(ss[0]), int(ss[1])+1):
                        c.append(j)
            else: # found a single
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
                        extra_layout += [x + i*ht_node[1] for x in layout[node]]
                    layout[node] += extra_layout

        return layout

    def job_info(self, slurm_job):
        num_gpus = 0
        if slurm_job['tres_alloc_str'] is not None:
            if 'gpu=' in slurm_job['tres_alloc_str']:
                num_gpus = int(slurm_job['tres_alloc_str'].split('gpu=')[1][0])

        return { 'name':      slurm_job['name'],
                'username':  self.hide_username(pwd.getpwuid(slurm_job['user_id'])[0]),
                'nCpus':     slurm_job['num_cpus'],
                'state':     slurm_job['job_state'],
                'layout':    self.cpu_layout(slurm_job['cpus_alloc_layout']),
                'timeLimit': slurm_job['time_limit'], # minutes
                'runTime':   int(slurm_job['run_time']/60), # minutes
                'nGpus':     num_gpus,
                'mem':       {}, # populate later
                'memMax':    {}, # populate later
                'hasMem':    False,
                'memReq':    self.requested_memory(slurm_job) # mb
                }

    @staticmethod
    def add_job_mem_info(j, id_map):
        print('Getting memory stats')
        # InfluxDB client for memory stats
        influx_client = InfluxDBClient(
            host=influx_config.HOST,
            port=influx_config.PORT,
            username=influx_config.USERNAME,
            password=influx_config.PASSWORD
        )
        # Choose database
        influx_client.switch_database('ozstar_slurm')

        # Query all jobs for current memory usage
        query = "SELECT host, MAX(value) FROM RSS WHERE time > now() - {:}s  GROUP BY job, host".format(config.UPDATE_INTERVAL * 2)
        result = influx_client.query(query)

        # Count jobs
        active_slurm_jobs = []
        for array_id in j:
            if j[array_id]['state'] =='RUNNING':
                active_slurm_jobs += [array_id]

        count_stat = 0
        for array_id in active_slurm_jobs:
            key = ('RSS', {'job': str(id_map[array_id])})
            nodes = list(result[key])

            if len(nodes) > 0:
                count_stat += 1
                j[array_id]['hasMem'] = True

                # Current memory usage
                for x in nodes:
                    node_name = x['host']
                    mem = x['max']
                    j[array_id]['mem'][node_name] = math.ceil(mem / KB) # kb to mb

                # Max memory usage
                query = "SELECT MAX(value) FROM RSS WHERE job='{:}'".format(id_map[array_id])
                sub_result = influx_client.query(query)
                j[array_id]['memMax'] = math.ceil(list(sub_result)[0][0]['max'] / KB) # kb to mb

                if len(nodes) != len(j[array_id]['layout']):
                    print('{:} has {:} mem nodes but {:} cpu nodes'.format(array_id, len(nodes),len(j[array_id]['layout'])))

            else:
                print('{:} ({:}) has no memory stats'.format(array_id, id_map[array_id]))

        print('Memory stats: {:} / {:}'.format(len(active_slurm_jobs),count_stat))

    @staticmethod
    def requested_memory(slurm_job):
        if slurm_job['min_memory_cpu'] is not None:
            if slurm_job['ntasks_per_node'] > 0 and slurm_job['cpus_per_task'] > 0:
                return slurm_job['min_memory_cpu'] * slurm_job['ntasks_per_node'] * slurm_job['cpus_per_task']
            else:
                return 0
        else:
            return slurm_job['min_memory_node']

    def add_job_gpu_mapping(self, j):
        # Update GPU mapping and determine
        self.ga.update_jobs(j)
        self.ga.determine()

        # Give all jobs a gpuLayout entry
        for jid in j:
            j[jid]['gpuLayout'] = {}

        # Populate GPU layout for GPU jobs
        for jid in self.ga.mapping:
            for host in self.ga.mapping[jid]:
                j[jid]['gpuLayout'][host] = self.ga.mapping[jid][host]

    def jobs(self):
        # Get job info from slurm
        slurm_jobs = pyslurm.job().get()

        j = {}

        # Map between array syntax and job numbers
        id_map = {}

        for job_id in slurm_jobs:
            s = slurm_jobs[job_id]

            if s['array_task_str'] != None:  # queued array job(s)
                # expand into separate sub jobs
                for t in self.expand_array(s['array_task_str']):
                    jid = str(job_id) + '_' + str(t)
                    j[jid] = self.job_info(s)

            else:
                if s['array_task_id'] != None and s['array_job_id'] != None:  # running array task
                    # change the jobid to be array syntax
                    jid = str(s['array_job_id']) + '_' + str(s['array_task_id'])
                else:
                    jid = str(job_id)

                j[jid] = self.job_info(s)

                id_map[jid]     = job_id
                #      array_id   integer

        # Add memory information
        self.add_job_mem_info(j, id_map)

        # Add GPU mapping
        self.add_job_gpu_mapping(j)

        return j

    def update_data(self):
        data = {}
        data['api'] = API_VERSION
        data['timestamp'] = self.timestamp()
        data['nodes'] = self.nodes()
        data['jobs'] = self.jobs()
        self.data = data

    def update_core_usage(self, data=None):
        # For loading in usage from disk
        if data is not None:
            self.data = data

        usage = {'avail': 0, 'running': 0}
        for hostname, node in self.data['nodes'].items():
            if node['isCounted']:
                usage['avail'] += node['nCpus']

        bonus_nodes = []
        n_bonus = 0

        for id, job in self.data['jobs'].items():
            if job['state'] == 'RUNNING':
                usage['running'] += job['nCpus']

                # if job is running on a bonus node then add the bonus node to avail
                for hostname in job['layout']:
                    node = self.data['nodes'][hostname]
                    if not node['isCounted']:
                        if hostname not in bonus_nodes:
                            bonus_nodes += [hostname]
                            usage['avail'] += node['nCpus']
                            n_bonus += node['nCpus']

        self.usage_cache['history'][self.data['timestamp']] = usage

    def usage_from_disk(self):
        filenames = config.FILE_NAME_PATTERN.format('*')
        filepaths = path.join(config.DATA_PATH, filenames)
        data_files = glob(filepaths)
        times = []
        for x in data_files:
            filename = path.basename(x)
            match = re.search(config.FILE_NAME_PATTERN.format('(\d+)'), filename)
            if match is not None:
                times += [match.group(1)]

        for t in times:
            filename = config.FILE_NAME_PATTERN.format(t)
            filepath = path.join(config.DATA_PATH, filename)
            with gzip.open(filepath, 'r') as f:
                json_text = f.read().decode('utf-8')
                data = json.loads(json_text)
                self.update_core_usage(data=data)

    def history(self):
        now = self.timestamp()

        h = {'history': {}}
        for t in sorted(list(self.usage_cache['history'].keys())):
            if now - t < config.HISTORY_LENGTH:
                h['history'][t] = self.usage_cache['history'][t]
            elif now - t > config.HISTORY_DELETE_AGE:
                filename = config.FILE_NAME_PATTERN.format(t)
                filepath = path.join(config.DATA_PATH, filename)
                try:
                    removed_data = self.usage_cache['history'].pop(t)
                    remove(filepath)
                except:
                    print('Tried to remove {:}, but already deleted'.format(filename))

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
                bf[node_type][i] = {'count': b.cnt(i), 'tMax': tmax, 'tMin': tmin}

        self.backfill = bf

    def write(self):
        output_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(''))
        write_data(self.data, output_file)

        record_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(self.data['timestamp']))
        write_data(self.data, record_file)

        # Write history file
        history_file = path.join(config.DATA_PATH, config.FILE_NAME_HISTORY)
        write_data(self.history(), history_file)

        # Write backfill file
        backfill_file = path.join(config.DATA_PATH, config.FILE_NAME_BACKFILL)
        write_data(self.backfill, backfill_file)

if __name__ == '__main__':

    test = False
    nohist = False
    if len(sys.argv) == 2:
        arg = sys.argv[1]
        nohist = arg == 'nohist'
        test = arg == 'test'
        if test:
            nohist = True

    print('Starting bobMon2 backend')
    b = Backend(no_history=nohist)

    if test:
        print('Testing backend, not writing any data')

        b.update_data()
        b.update_backfill()

        print('Done!')
        sys.exit()

    while True:
        time_start = b.timestamp()

        # Get all data
        print('Gathering data')
        try:
            # Main data update
            b.update_data()

            # Get core usage for new data
            print('Updating history')
            b.update_core_usage()

            # Calculate backfill
            b.update_backfill()

            # Write data to disk
            print('Writing data')
            b.write()

            time_finish = b.timestamp()
            time_taken = time_finish - time_start
            print('Done! Took {:} seconds'.format(time_taken))
            sleep_time = max(0, config.UPDATE_INTERVAL - time_taken)

        except Exception as e:
            print('Error:', e)
            print('Trying again next cycle')
            sleep_time = config.UPDATE_INTERVAL

        print('Sleeping for {:} seconds'.format(sleep_time))
        time.sleep(config.UPDATE_INTERVAL)
