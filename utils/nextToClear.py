#!/usr/bin/env python

from pbsMauiGanglia import pbsNodes
from bobMonitor import pbsJobsBob
from sysLoad import doPbsInfo

def findJobs( jobs, drainingNodes ):
    j = []
    for username, nodeList, line, tagId, timeToGo, jobId, jobName, pbsInfo in jobs:  # append to joblist field
        for n in drainingNodes:
            if n in nodeList:
                if 'state' in pbsInfo.keys():  # job state
                    j.append( ( timeToGo, n, pbsInfo['state'], jobId ) )
    return j

def findDraining( pbsnodes ):
    infoHw = doPbsInfo( pbsnodes )
    d = []
    for n, info, hw in infoHw:
        if 'fill' in info or 'draining' in info:
            d.append(n)
    return d

def byNode( drainJobs ):
    nodes = {}
    for timeToGo, n, state, jobId in drainJobs:
        if n not in nodes.keys():
            nodes[n] = []
        nodes[n].append( ( timeToGo, n, state, jobId ) )
    return nodes

def nodeTimes( drainJobs ):
    n = byNode( drainJobs )
    #print 'n', n
    tn = []
    for i in n:
        rTime = 0
        sTime = 0
        for j in n[i]:
            #print j
            t, nn, s, id = j
            if s == 'R': # all running jobs are running at the same time
                if t > rTime:
                    rTime = t
            elif s == 'S': # bad assumption, but assume all suspended jobs will resume at the same time
                if t > sTime:
                    sTime = t
        t = rTime + sTime
        tn.append( ( t, i ) )
    return tn

def hms( t ):
   h = int(t/3600)
   m = int((t - h*3600)/60)
   s = t - h*3600 - m*60
   return '%2d:%02d:%02d' % ( h, m, s )

def printTimes( drainingNodes, tn ):
   nodes = []
   for t, n in tn:
      nodes.append(n)

   haveNow = 0
   for n in drainingNodes:
      if n not in nodes:
         if not haveNow:
            print 'now',
            haveNow = 1
         print n,
   if haveNow:
      print

   for t, n in tn:
      print hms(t), n

def main():
    # pbs jobs:
    p = pbsJobsBob()
    jobs = p.getJobList()
    queued = p.getQueuedList()

    n = pbsNodes()
    pbsnodes = n.getNodesList()
    #print 'pbsnodes', doPbsNodes( pbsnodes )
    # running jobs:
    #print 'jobs', doJobs( jobs )

    # look through pbsnodes and find nodes marked 'fill' or 'draining'
    drainingNodes = findDraining( pbsnodes )
    #print 'drainingNodes', drainingNodes

    # find jobs on those nodes
    drainJobs = findJobs( jobs, drainingNodes )
    drainJobs.sort()
    #print 'drainJobs', drainJobs

    # figure out which nodes clear when (approximately)
    tn = nodeTimes( drainJobs )
    tn.sort()

    # print out in order
    printTimes( drainingNodes, tn )

if __name__ == "__main__":
    main()
