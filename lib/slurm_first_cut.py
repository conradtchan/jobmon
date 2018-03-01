#!/usr/bin/env python

import pyslurm
import pwd

if __name__ == "__main__":

    try:

        Nodes = pyslurm.node()
        node_dict = Nodes.get()

        if len(node_dict) > 0:

            #print node_dict.keys(), Nodes.ids()
            #Nodes.print_node_info_msg()
            p = []
            pa = []
            for f in Nodes.ids():
                #print f,
                #for j in [ 'cpus', 'reason', 'state', 'gres' ]:
                #    print node_dict[f][j],
                #print
                cpus = node_dict[f]['cpus']
                gpus = 0
                for g in node_dict[f]['gres']:
                    # not quite sure how to parse this. gres=gpu:2,gpu:kepler:1,mic,bandwidth:lustre:4g or is an array?
                    for gg in g.split(','):
                        for ggg in gg.split(':'):
                            if ggg[0] == 'gpu':
                                if ggg[-1].isdigit():
                                    gpus += int(ggg[-1])

                s = node_dict[f]['state']
                r = node_dict[f]['reason']
                if s not in [ 'ALLOCATED', 'IDLE', 'MIXED' ] or r != None:
                    p.append( (f, [s, r], cpus, gpus) )
                state = []
                state.append(s)
                if r != None:
                    state.append(r)
                pa.append( (f, state, cpus, gpus) )
            print p
            print pa

        else:
    
            print "No Nodes found !"

    except ValueError as e:
        print "Error - {0}".format(e.args[0])

    try:
        a = pyslurm.job()
        jobs = a.get()

        if len(jobs) > 0:

            time_fields = ['time_limit']

            date_fields = ['start_time', 'submit_time', 'end_time', 'eligible_time', 'resize_time']

#            for key, value in sorted(jobs.iteritems()):
#
#                print "JobID {0} :".format(key)
#                for part_key in sorted(value.iterkeys()):
#
#                    if part_key in time_fields:
#                        print "\t{0:<20} : Infinite".format(part_key)
#                        continue
#
#                    if part_key in date_fields:
#
#                        if value[part_key] == 0:
#                            print("\t{0:<20} : N/A".format(part_key))
#                        else:
#                            ddate = pyslurm.epoch2date(value[part_key])
#                            print "\t{0:<20} : {1}".format(part_key, ddate)
#                    else:
#                        print "\t{0:<20} : {1}".format(part_key, value[part_key])
#                
#                print "-" * 80
#
#            print
#            print "Number of Jobs - {0}".format(len(jobs))
#            print

            pending = a.find('job_state', 'PENDING')
            running = a.find('job_state', 'RUNNING')
            held = a.find('job_state', 'HELD')

            # really it should be 'running' and everything else... ?

            for j in jobs.keys():
                print j

                ram = None
                if jobs[j]['mem_per_cpu']:
                    ram = jobs[j]['num_cpus']*jobs[j]['min_memory_cpu']
                elif jobs[j]['mem_per_node']:
                    ram = jobs[j]['num_nodes']*jobs[j]['min_memory_node']
                jobs[j]['_ram'] = ram

                jobs[j]['_username'] = pwd.getpwuid(jobs[j]['user_id'])[0]

                for k in [ 'num_cpus', 'num_nodes', 'cpus_allocated', 'end_time', 'job_state', 'mem_per_cpu',
                           'mem_per_node', 'min_memory_cpu', 'min_memory_node', 'name', 'partition', 'run_time',
                           'run_time_str', 'start_time', 'time_limit_str', 'user_id', '_ram', '_username' ]:

                    val = jobs[j][k]
                    if k in time_fields:
                        print "\t{0:<20} : Infinite".format(k)
                        continue

                    if k in date_fields:

                        if val == 0:
                            print("\t{0:<20} : N/A".format(k))
                        else:
                            ddate = pyslurm.epoch2date(val)
                            print "\t{0:<20} : {1}".format(k, ddate), val
                    else:
                        print "\t{0:<20} : {1}".format(k, val)

            print "Number of pending jobs - {0}".format(len(pending))
            print "Number of running jobs - {0}".format(len(running))
            print
        
            print "JobIDs in Running state - {0}".format(running)
            print "JobIDs in Pending state - {0}".format(pending)
            print
        else:
    
            print "No jobs found !"
    except ValueError as e:
        print "Job query failed - {0}".format(e.args[0])

