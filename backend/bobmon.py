#!/usr/bin/env python3

API_VERSION = 11

from os import path
from os import rename
from os import chmod
from os import unlink
import stat
import json
import time
import bobmon_config as config
import bobmon_ganglia as ganglia
import pyslurm
import pwd

# Get 644 for chmod
mode644 = (stat.S_IRUSR|stat.S_IWUSR|stat.S_IRGRP|stat.S_IROTH)


def timestamp():
    return time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.gmtime())

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

        nodes[host]['cpu']      = cpu_usage(all[host], host)
        nodes[host]['mem']      = mem(all[host], host)
        nodes[host]['swap']     = swap(all[host], host)
        nodes[host]['disk']     = disk(all[host], host)
        nodes[host]['temps']    = temps(all[host])
        nodes[host]['power']    = power(all[host])
        nodes[host]['fans']     = fans(all[host])
        nodes[host]['gpus']     = gpus(all[host])

        if host in pyslurm_nodes.keys():
            nodes[host]['inSlurm'] = True
            nodes[host]['nCpus'] = pyslurm_nodes[host]['cpus']
            nodes[host]['nGpus'] = 0
            for gres in pyslurm_nodes[host]['gres']:
                g = gres.split(':')
                if (g[0] == 'gpu'):
                    nodes[host]['nGpus'] += int(g[-1])
        else:
            nodes[host]['inSlurm'] = False

    return nodes


def jobs():
    slurm_jobs = pyslurm.job().get()

    j = {}

    for job_id in slurm_jobs:
        j[job_id] = {
            'name':      slurm_jobs[job_id]['name'],
            'username':  pwd.getpwuid(slurm_jobs[job_id]['user_id'])[0],
            'nCpus':     slurm_jobs[job_id]['num_cpus'],
            'state':     slurm_jobs[job_id]['job_state'],
            'layout':    slurm_jobs[job_id]['cpus_alloc_layout'],
            'timeLimit': slurm_jobs[job_id]['time_limit'], # minutes
        }
        # if j[job_id]['state'] == 'RUNNING':
        #     j['layout'] = slurm_jobs[job_id]['cpus_alloc_layout']

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
    with open(tmp_filename, 'w') as f:
        json.dump(data, f)
    chmod(tmp_filename, mode644)

    # Copy temporary file to live file
    try:
        rename(tmp_filename, filename)
    except (OSError, error):
        err_num, err_str = error
        print('write_data: renamed failed. OsError', error)
        if err_num == 13: # Permission denied
            print('Permission denied (probably running as a user)')
        unlink(tmp_filename)

if __name__ == '__main__':
    while True:
        data = do_all()

        output_file = path.join(config.DATA_PATH, 'bobData.json')
        write_data(data, output_file)
        print('Done!')
        time.sleep(config.UPDATE_INTERVAL)