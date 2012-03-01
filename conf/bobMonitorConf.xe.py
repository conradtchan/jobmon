#!/usr/bin/env python
# this bobMonitor config file must contain only legal python code!!

# to link to your site's regular web pages
siteName = 'NCI NF'
siteURL = 'http://nf.nci.org.au/'
aboutURL = 'http://code.google.com/p/bob-monitor/'

# paths in web space
gifDir ='/bobMonitorGifs/'
pieURL = '/bobMon/pies/'
bobDataCmdURL = '/cgi-bin/catBobData';

# paths in file space
pbsPath = '/opt/pbs/bin'
mauiPath = '/opt/maui/bin'
piePath = '/var/www/html/bobMon/pies/'
dataPath = '/var/spool/bobMon/'
trimImage = '/usr/sbin/trimImage'

# pbsnodes command to show a summary for all nodes: -a anupbs, and -l for torque
pbsNodesCommand = '-a'

# ganglia config
clusterName = 'xe'    # what you called the cluster in ganglia
gangliaNodeSuffix  = ''   # eg. '.mckenzie' if ganglia names for nodes
                          # are 'eh1.mckenzie' instead of just 'eh1'

# cluster config:
numNodes = 156
nodeNumStart = 1     # eg. 1 means x1 is first node, not x0
# probably need a node name format in here one day - eg. x0001 vs. x1
baseNodeName = 'x'   # nodes are ... x77, x78, ...

headNodes = [ 'xe', 'xepbs', 'xe-apps' ]
ioNodes = [ 'xemds1', 'xemds2', 'sox1', 'sox2', 'sox3', 'sox4', 'sox5', 'sox6', 'sox7', 'sox8' ]

# should really read this from PBS...
coresPerNode = 8

# time to sleep between stats gathering from ganglia, pbs etc.
sleepTime = 10   # time in seconds

# jobs stats are ignored for several iterations when a job starts and also when
# it comes back from being suspended because ganglia has a ~30s+ lag in it
# and we don't want to record leftover node stats from the previous job
ignoreStatsLoops =  6   # in units of sleepTime. eg. 6 cycles @ 10s ~= 60s

# this hasn't been tested for a long time - might be broken:
showRackLoads = 0

# temperature display min/max for cpu
cpuMinTemp = 15.0
cpuMaxTemp = 75.0

# we only have one mb temp, so make these ranges the same
mb0MinTemp = 20.0   # rear blade
mb0MaxTemp = 45.0
mb1MinTemp = 20.0   # front blade
mb1MaxTemp = 45.0

ambientWarn = 40.0   # 35 is a typical limit

# for the temperature display:
rackTempOrder = 'up'   #   up == low number node at the bottom of display
                       # down == low number node at the top of display

# temperature font size
tempFontSize = -2

# format here is [ 'name', 'type' ] where allowable types are 'head' and 'node'
# or [ '' ] if the element is to be left blank
# the name 'head' and 'i/o' are special tags that the server knows about
# and need to be kept? additional 'head' names are allowed
specialRows = [ [ ['head','head'],
		['xe','node'],
		['xepbs','node'],
		['xe-apps','node'],
		[''],
		['mds','head'],
		['xemds1','node'],
		['xemds2','node'] ],
              [ ['oss','head'],
                ['sox1','node'],
                ['sox2','node'],
                ['sox3','node'],
                ['sox4','node'],
                ['sox5','node'],
                ['sox6','node'],
                ['sox7','node'],
                ['sox8','node'] ] ]

# how nodes are layed out in the racks - used for the rack temperature display
# the 'fe' column is where all non-backend nodes will be placed
# NOTE: number of nodes here needs to add up 'numNodes'
racks = [ [64,'pizza'], ['fe','pizza'], [64,'pizza'], [28,'pizza'] ];


# pizza box cluster - no shelves
#shelfName = 'none'
#shelfStart = 1
#numShelves = 1

#shelfFanMinSpeed = 3000
#shelfFanMaxSpeed = 6000
#shelfMinPower = 2000
#shelfMaxPower = 9000

# no watts from this cluster
#nodeWattsMultiplier = 1.13

# no 'shelves' in this pizza box cluster
shelves = []

#########################################
# derived data... leave these alone...
nonBackendNodes = []
nonBackendNodes.extend( headNodes )
nonBackendNodes.extend( ioNodes )
#########################################
