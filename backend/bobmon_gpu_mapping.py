'''
    Slurm does not report GPU mapping,
    but it is possible to deduce it from 'gres_used'
    and other jobs
'''

from os import path
import pyslurm
import json
import gzip
from file_utils import write_data
import bobmon_config as config

class GPUmapping:
    def __init__(self):
        # Known mapping for each job
        self.mapping = {}

        # Mapping for each node (which GPUs are occupied)
        self.node_mapping = {}

        # Yet to be determined
        self.unknown = {}

        # Which GPUs are being used
        self.gres = {}

        # Read backup
        try:
            self.read_backup()
        except FileNotFoundError:
            print('GPU mapping backup file not found')

    def write_backup(self):
        mapping_path = path.join(config.DATA_PATH, 'gpu_mapping.json')
        data = {'mapping': self.mapping, 'node_mapping': self.node_mapping, 'unknown': self.unknown}
        write_data(data, mapping_path)

    def read_backup(self):
        mapping_path = path.join(config.DATA_PATH, 'gpu_mapping.json')
        with gzip.open(mapping_path, 'r') as f:
            json_text = f.read().decode('utf-8')
            data = json.loads(json_text)
            self.mapping = data['mapping']
            self.node_mapping = data['node_mapping']
            self.unknown = data['unknown']

    def update_jobs(self, jobs):
        '''Add new jobs to unknown, and clear finished jobs'''
        # For each new job
        for jid in jobs:
            # If this is a GPU job
            job = jobs[jid]
            if job['state'] == 'RUNNING':
                if job['nGpus'] > 0 and len(job['layout'].keys()) == 1: # For now, ignore multi-node GPU jobs
                    # If it is not already in the unknown list or known list
                    if jid not in self.unknown and jid not in self.mapping:
                        self.unknown[jid] = {}
                        # Record the node and number of cores
                        for host in job['layout']:
                            self.unknown[jid][host] = job['nGpus']

        # Clear jobs that are finished from unknown and mapping
        for jid in list(self.unknown.keys()):
            # Sadly this job was never determined
            if jid not in jobs:
                self.del_unknown(jid, 'all')
        for jid in list(self.mapping.keys()):
            if jid not in jobs:
                self.del_mapping(jid)

    def update_node_info(self):
        '''Get which GPUs are being used'''
        pyslurm_node = pyslurm.node().get()
        gpu_mapping = {}
        for host in pyslurm_node:
            gres_string = pyslurm_node[host]['gres_used']
            gpu_string = gres_string[0]

            # If this node has a GPU
            if gpu_string.split(':')[1] != '0':
                gpus_used = int(gpu_string.split(':')[2][0])

                assert gpus_used <= 2 # This algorithm only works with 2 GPUs

                gpu_mapping[host] = []

                if gpus_used > 0:
                    gpu_mapping[host] = [int(x) for x in gpu_string.split(':')[3].strip(')').split('-')]

        self.gres = gpu_mapping

        # Get all node names
        for host in pyslurm_node:
            if host not in self.node_mapping:
                self.node_mapping[host] = [] # which GPUs are being used

    def add_map(self, jid, host, mapping):
        '''Add entry to mapping, create new one if it does not exist yet'''
        try:
            self.mapping[jid][host] = mapping
        except KeyError:
            self.mapping[jid] = {}
            self.mapping[jid][host] = mapping

        self.node_mapping[host] = list(set(self.node_mapping[host] + mapping))

    def del_unknown(self, jid, host):
        '''Delete entry from unknown'''
        if host == 'all':
            del self.unknown[jid]
            return

        # Delete specifically
        del self.unknown[jid][host]
        # If no more hosts, remove job ID as well
        if len(self.unknown[jid].keys()) == 0:
            del self.unknown[jid]

    def del_mapping(self, jid):
        '''Delete entry from known mappings'''
        mapping = self.mapping.pop(jid) # This will already delete the entry
        for host in mapping:
            for i in mapping[host]:
                if i in self.node_mapping[host]:
                    # Remove from node_mapping as well
                    self.node_mapping[host].remove(i)

    def determine(self):
        '''Step: Attempt to determine as many jobs as possible'''

        self.update_node_info()

        self.determine_double()
        self.determine_solo()
        self.determine_remainder()

        self.write_backup()

        print('Determined GPU mappings: ', len(self.mapping), '/', len(self.mapping) + len(self.unknown))

    def determine_double(self):
        '''If jobs occupy both GPUS, then this is easy'''
        for jid in list(self.unknown):
            for host in list(self.unknown[jid]):
                if self.unknown[jid][host] == 2:
                    self.add_map(jid, host, [0, 1])
                    self.del_unknown(jid, host)

    def determine_solo(self):
        '''Determine mapping when only one GPU is being used'''
        for jid in list(self.unknown):
            for host in list(self.unknown[jid]):
                if self.unknown[jid][host] == 1:
                    if len(self.gres[host]) == 1:
                        self.add_map(jid, host, self.gres[host])
                        self.del_unknown(jid, host)

    def determine_remainder(self):
        '''Determine remainder mappings when the other is known'''
        for jid in list(self.unknown):
            for host in list(self.unknown[jid]):
                if self.unknown[jid][host] == 1:
                    if len(self.gres[host]) == 2:
                        # Both GPUs are being used, but this job only uses 1
                        # Check which GPU is free
                        if len(self.node_mapping[host]) == 1: # If one is known
                            for i in [0, 1]:
                                if i not in self.node_mapping[host]:
                                    self.add_map(jid, host, [i])
                                    self.del_unknown(jid, host)
                                    break

