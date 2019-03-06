#!/usr/bin/env python3

API_VERSION = 11

import gzip
from os import path
from os import rename
from os import chmod
from os import unlink
from os import remove
from datetime import datetime
from glob import glob
import time
import stat
import json
import bobmon_config as config
import bobmon_ganglia as ganglia
import pyslurm
import pwd
import re

# Get 644 for chmod
mode644 = (stat.S_IRUSR|stat.S_IWUSR|stat.S_IRGRP|stat.S_IROTH)


def timestamp():
    # Seconds since epoch
    d = datetime.now()
    return int(time.mktime(d.timetuple()))

def cpu_usage(data, name):
    try:
        total = {
            'user':     float(data['cpu_user']),
            'nice':     float(data['cpu_nice']),
            'system':   float(data['cpu_system']),
            'wait':     float(data['cpu_wio']),
            'idle':     float(data['cpu_idle']),
        }

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

        # Slurm reports cores with a different numbering, so we map to that
        # Could generalize for n sockets
        core_left = []
        core_right = []
        for i, x in enumerate(core):
            if (i % 2 == 0):
                core_left += [x]
            else:
                core_right += [x]
        core = core_left + core_right

        return {'total': total, 'core': core}
    except KeyError:
        print(name, 'cpu user/nice/system/wio/idle not in ganglia')


def mem(data, name):
    try:
        used = float(data['mem_total']) \
               - float(data['mem_buffers']) \
               - float(data['mem_cached'])\
               - float(data['mem_free'])

        # convert to MB
        return {
            'used':  used / 1024.0,
            'total': float(data['mem_total']) / 1024.0
        }

    except:
        now = time.time()
        if now - data['reported'] < config.NODE_DEAD_TIMEOUT:
            print(name, 'mem gmond data is incomplete')


def swap(data, name):
    try:
        return {
            'free':     float(data['swap_free']),
            'total':    float(data['swap_total'])
        }
    except KeyError:
        print(name, 'swap not in ganglia')


def disk(data, name):
    try:
        return {
            'free':     float(data['disk_free']),
            'total':    float(data['disk_total'])
        }
    except KeyError:
        print(name, 'disk not in ganglia')


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


def power(data):
    p = {}
    if 'node_power' in data.keys():
        p['node'] = int(data['node_power'].split('.')[0])
    if 'cmm_power_in' in data.keys():
        p['blade_chassis'] = int(data['cmm_power_in'].split('.')[0])

    if len(p.keys()) > 0:
        return p


def fans(data):
    f = {}
    if 'fan_rms' in data.keys():
        f['rms'] = int(data['fan_rms'].split('.')[0])

    if len(f.keys()) > 0:
        return f

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

def infiniband(data):
    n = {}
    if 'ib_bytes_in' in data.keys():
        n['bytes_in'] = float(data['ib_bytes_in'])

    if 'ib_bytes_out' in data.keys():
        n['bytes_out'] = float(data['ib_bytes_out'])

    if 'ib_pkts_in' in data.keys():
        n['pkts_in'] = float(data['ib_pkts_in'])

    if 'ib_pkts_out' in data.keys():
        n['pkts_out'] = float(data['ib_pkts_out'])


    if len(n.keys()) > 0:
        return n

def lustre(data):
    l = {}
    if 'farnarkle_fred_read_bytes' in data.keys():
        l['read'] = float(data['farnarkle_fred_read_bytes'])

    if 'farnarkle_fred_write_bytes' in data.keys():
        l['write'] = float(data['farnarkle_fred_write_bytes'])

    if len(l.keys()) > 0:
        return l

def nodes():
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

        nodes[host]['cpu']          = cpu_usage(all[host], host)
        nodes[host]['mem']          = mem(all[host], host)
        nodes[host]['swap']         = swap(all[host], host)
        nodes[host]['disk']         = disk(all[host], host)
        nodes[host]['temps']        = temps(all[host])
        nodes[host]['power']        = power(all[host])
        nodes[host]['fans']         = fans(all[host])
        nodes[host]['gpus']         = gpus(all[host])
        nodes[host]['infiniband']   = infiniband(all[host])
        nodes[host]['lustre']       = lustre(all[host])

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
                    nodes[host]['nGpus'] += int(g[-1])

    return nodes


# Dict of username mappings
usernames = {}


def hide_username(name):
    if name not in usernames.keys():
        new_name = name[:3]
        add_letters = 0
        for long_name, short_name in usernames.items():
            if short_name == new_name:
                add_letters += 1
                new_name = name[:3 + add_letters]
        usernames[name] = new_name

    return usernames[name]


def jobs():
    slurm_jobs = pyslurm.job().get()

    j = {}

    for job_id in slurm_jobs:
        j[job_id] = {
            'name':      slurm_jobs[job_id]['name'],
            'username':  hide_username(pwd.getpwuid(slurm_jobs[job_id]['user_id'])[0]),
            'nCpus':     slurm_jobs[job_id]['num_cpus'],
            'state':     slurm_jobs[job_id]['job_state'],
            'layout':    slurm_jobs[job_id]['cpus_alloc_layout'],
            'timeLimit': slurm_jobs[job_id]['time_limit'], # minutes
        }

    return j


def do_all():
    data = {}
    data['api'] = API_VERSION
    data['timestamp'] = timestamp()
    data['nodes'] = nodes()
    data['jobs'] = jobs()
    data['gangliaURL'] = config.GMONDS[0][2]

    return data


def write_data(data, filename):
    # Write to a temporary file, because it takes time
    tmp_filename = filename + '.new'
    json_str = json.dumps(data)
    json_bytes = json_str.encode('utf-8')
    with gzip.open(tmp_filename, 'wb') as f:
        f.write(json_bytes)
    chmod(tmp_filename, mode644)

    # Rename temporary file to live file
    try:
        rename(tmp_filename, filename)
    except (OSError, error):
        err_num, err_str = error
        print('write_data: renamed failed. OsError', error)
        if err_num == 13: # Permission denied
            print('Permission denied (probably running as a user)')

        # Unlink temp file
        unlink(tmp_filename)


def get_core_usage(data):
    usage = {'avail': 0, 'running': 0}
    for hostname, node in data['nodes'].items():
        # This is for compatability with old snapshots - can delete 'isSlurm' after 2 days
        try:
            if node['isCounted']:
                usage['avail'] += node['nCpus']
        except:
            if node['inSlurm']:
                usage['avail'] += node['nCpus']

    for id, job in data['jobs'].items():
        if job['state'] == 'RUNNING':
            usage['running'] += job['nCpus']

            # if job is running on a bonus node then add the bonus node to avail
            for hostname in job['layout']:
                node = data['nodes'][hostname]
                if not node['isCounted']:
                    usage['avail'] += node['nCpus']

    return usage


def usage_from_disk():
    filenames = config.FILE_NAME_PATTERN.format('*')
    filepaths = path.join(config.DATA_PATH, filenames)
    data_files = glob(filepaths)
    times = []
    for x in data_files:
        filename = path.basename(x)
        match = re.search(config.FILE_NAME_PATTERN.format('(\d+)'), filename)
        if match is not None:
            times += [match.group(1)]

    cache = {'history': {}}
    for t in times:
        filename = config.FILE_NAME_PATTERN.format(t)
        filepath = path.join(config.DATA_PATH, filename)
        with gzip.open(filepath, 'r') as f:
            json_text = f.read().decode('utf-8')
            data = json.loads(json_text)
            cache['history'][int(t)] = get_core_usage(data)

    return cache


def history(usage_cache):
    now = timestamp()

    h = {'history': {}}
    for t in sorted(list(usage_cache['history'].keys())):
        if now - t < config.HISTORY_LENGTH:
            h['history'][t] = usage_cache['history'][t]
        elif now - t > config.HISTORY_DELETE_AGE:
            filename = config.FILE_NAME_PATTERN.format(t)
            filepath = path.join(config.DATA_PATH, filename)
            try:
                removed_data = usage_cache['history'].pop(t)
                remove(filepath)
            except:
                print('Tried to remove {:}, but already deleted'.format(filename))

    return h


if __name__ == '__main__':
    print('Starting bobMon2 backend')

    # Initially, get the usage from disk
    print('Reading previous snapshots from disk')
    usage_cache = usage_from_disk()

    while True:
        time_start = timestamp()

        # Get all data
        print('Gathering data')
        try:
            data = do_all()

            # Write to file and history file
            print('Writing data')
            output_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(''))
            record_file = path.join(config.DATA_PATH, config.FILE_NAME_PATTERN.format(data['timestamp']))
            write_data(data, output_file)
            write_data(data, record_file)

            # Get core usage for new data
            print('Updating history')
            usage_cache['history'][data['timestamp']] = get_core_usage(data)

            # Write history file
            history_file = path.join(config.DATA_PATH, 'history.json.gz')
            write_data(history(usage_cache), history_file)

            time_finish = timestamp()
            time_taken = time_finish - time_start
            print('Done! Took {:} seconds'.format(time_taken))
            sleep_time = max(0, config.UPDATE_INTERVAL - time_taken)

        except:
            sleep_time = config.UPDATE_INTERVAL

        print('Sleeping for {:} seconds'.format(sleep_time))
        time.sleep(config.UPDATE_INTERVAL)
