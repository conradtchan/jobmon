#!/usr/bin/env python

# (c) Robin Humble 2005
# licensed under the GPL

# maui showq annotated with job names from PBS and showbf output too

import sys
import string
import os, pwd
# local:
from pbsMauiGanglia import pbsJobs, maui


doPrint = [ 'Running', 'Queued', 'Blocked' ]

def usage():
    print sys.argv[0], '[ [-r] [-q|-i] [-b] [-s] | [-a] ] [-f] [-h|--help]'
    print '  print maui queue orders for PBS/torque jobs'
    print '    -r         show running jobs in finishing order'
    print '    -q|-i      show queued jobs in starting order'
    print '    -b         show blocked jobs'
    print '    -f         show (fairly lame) backfill information'
    print '    -a         alternate output format with jobs in queue submission order'
    print '    -s         shorter version of -r, -q/-i, -b mode without state'
    print '    -u [user]  show only the users own jobs'
    print '  default is -r -q -b -u'
    sys.exit(0)

userMode = 1
showBF = 0
doSorted = 0
doState = 0

doPrintNew = []
for a in sys.argv[1:]:
    if a in [ '-r' ]:
        doPrintNew.append( 'Running' )
    elif a in [ '-q', '-i' ]:
         doPrintNew.append( 'Queued' )
    elif a in [ '-b' ]:
         doPrintNew.append( 'Blocked' )
    elif a in [ '-f' ]:
         showBF = 1
    elif a in [ '-a' ]:
         doSorted = 1
         doState = 1
    elif a in [ '-s' ]:
         doState = 1
    elif a in [ '-u' ]:
         userMode = 0
    else:
        usage()

if len(doPrintNew):
    doPrint = doPrintNew

if userMode:
    id = os.geteuid()
    userName = pwd.getpwuid(id)[0]
    # print id, userName

m = maui()
if not m.mauiOk():
    print 'sorry - need maui for this tool. bye bye'
    sys.exit(0)

running = m.getRunningList()
queued  = m.getQueuedList()
blocked = m.getBlockedList()

mapping = { 'Running':running, 'Queued':queued, 'Blocked':blocked }

p = pbsJobs()
jobs = p.getJobList()
q = p.getQueuedList()


# merge PBS job names into a dict indexed by job id
name = {}
for j in jobs:
    username, nodeList, gpuList, line, tagId, timeToGo, jobId, jobName, memVm = j
    jobId = int(string.split( jobId, '.' )[0])
    name[jobId] = jobName
for j in q:
    nodes, cpus, gpus, state, username, jobId, jobName, walltime, comment = j
    jobId = int(string.split( jobId, '.' )[0])
    name[jobId] = jobName

if userMode:
    for L in ( running, queued, blocked ):
        l = []
        for i in L:
            if i['name'] == userName:
                l.append( i )
        L[:] = l

if doSorted: # sort back into queuing order
    # merge into a dict indexed by job id
    all = {}
    for i in running:
        all[i['jobId']] = i
    for i in queued:
        all[i['jobId']] = i
    for i in blocked:
        if i['state'] == 'Idle':
            i['state'] = 'Blocked'
        all[i['jobId']] = i

    keys = all.keys()
    keys.sort()
    print
    print '  jobId   name                   user        state   cpus    walltime/timeToGo  started running/was queued'
    print ' -------------------------------------------------------------------------------------------'
    for k in keys:
        i = all[k]
        id = i['jobId']
        if id in name.keys():
            n = name[id]
        else:
            n = '-'
        print "%7d  %-22s" % ( id, n ), "%(name)-10s %(state)9s %(cpus)3d %(time)12s" % i , "  %s %s %2s %s" % ( i['date'][0], i['date'][1], i['date'][2], i['date'][3] )

else:
    for d in doPrint:
        L = mapping[d]

        # print L
        if len(L):
            print
            print ' %s Jobs:' % d
            print
            if doState:
                print '  jobId   name                   user        state   cpus   ',
            else:
                print '  jobId   name                   user      cpus   ',
            if d in [ 'Queued', 'Blocked' ]:
                print 'walltime   time job queued'
            elif d in [ 'Running' ]:
                print 'timeToGo   started running'
            else:
                print '???'
            if doState:
                print ' -------------------------------------------------------------------------------------------'
            else:
                print ' ---------------------------------------------------------------------------------'

        for i in L:
            id = i['jobId']
            if id in name.keys():
                n = name[id]
            else:
                n = '-'
            if doState:
                print "%7d  %-22s" % ( id, n ), "%(name)-10s %(state)9s %(cpus)3d %(time)12s" % i , "  %s %s %2s %s" % ( i['date'][0], i['date'][1], i['date'][2], i['date'][3] )
            else:
                print "%7d  %-22s" % ( id, n ), "%(name)-10s %(cpus)3d %(time)12s" % i , "  %s %s %2s %s" % ( i['date'][0], i['date'][1], i['date'][2], i['date'][3] )


if showBF:
    bf = m.getBackFillList()
    for b in bf:
        print
        print 'Backfill:'
        print
        print 'submit a',
        for b in bf:
            c = b['cpus']
            t = b['time']
            if c == 1:
                print '1 cpu job for',
            else:
                print 'job with <= %d cpus and' % c,
            if t == None:
                print 'any',
            else:
                print '<', t,
            if b != bf[len(bf)-1]:
                print 'walltime, or a',
            else:
                print 'walltime for it to run now'

sys.exit(0)
