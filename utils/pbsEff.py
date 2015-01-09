#!/usr/bin/env python

# (c) Robin Humble 2014

# take a job id and show efficiency

import sys
from pbsMauiGanglia import pbsJobs

if len(sys.argv) < 2:
    print 'usage:', sys.argv[0], 'jobId [JobId JobId ...]'
    sys.exit(1)

p = pbsJobs()
jobs = p.getJobList()

# merge PBS jobs into a dict indexed by job id
jobsMap = {}
for j in jobs:
    username, nodeList, gpuList, line, tagId, timeToGo, jobId, jobName, pbsInfo = j
    jobsMap[jobId.split('.')[0]] = j

# take a string like a.b.c.d and return [ a, a.b, a.b.c, a.b.c.d ]
def shorterVersions( a ):
    b = a.split('.')
    c = []
    for i in range(len(b)):
        cc = ''
        for j in range(i+1):
            cc += b[j] + '.'
        cc = cc[:-1]  # take off the final .
        c.append(cc)
    return c

for j in sys.argv[1:]:
    found = 0
    for jj in shorterVersions(j):
        #print 'jj', jj, 'jobsMap.keys()', jobsMap.keys()
        if jj in jobsMap.keys():
            found = 1
            break
    if not found:
        print 'information for job', j, 'was not found'
        sys.exit(1)
    pbsInfo = jobsMap[jj][8]
    if 'eff' in pbsInfo.keys():
        eff = '%.1f%%' % pbsInfo['eff']
    else:
        eff = '-'
    print 'job', j, 'cores', pbsInfo['numCpus'], 'eff=100*cput/wallt', eff
