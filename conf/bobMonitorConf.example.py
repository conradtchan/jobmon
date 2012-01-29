#!/usr/bin/env python
# this bobMonitor config file must contain only legal python code!!

clusterName = 'xe'
gangliaNodeSuffix  = ''   # eg. '.mckenzie' if ganglia names for nodes
                          # are 'eh1.mckenzie' instead of just 'eh1'

# to link to your site's regular web pages
siteName = 'NCI NF'
siteURL = 'http://nf.nci.org.au/'

pbsPath = '/opt/pbs/bin'
mauiPath = '/opt/maui/bin'

headNodes = [ 'xe', 'xepbs' ]
ioNodes = [ 'xemds', 'oss1', 'oss2', 'oss3', 'xemds1', 'xemds2',
            'fox1', 'fox2', 'fox3', 'fox4', 'fox5', 'fox6', 'fox7', 'fox8',
            'sox1', 'sox2', 'sox3', 'sox4', 'sox5', 'sox6', 'sox7', 'sox8' ]

numNodes = 156
nodeNumStart = 1     # eg. 1 means x1 is first node, not x0
# future: probably need a node name format in here one day - eg. x0001 vs. x1
baseNodeName = 'x'   # nodes are x1 ... x156

coresPerNode = 8

# sleep time between harvest of stats from ganglia and PBS etc.
sleepTime = 5   # time in seconds

# jobs stats are ignored for several iterations when a job starts and also when
# it comes back from being suspended because ganglia has a ~30s+ lag in it
# and we don't want to record leftover stats from the previous job
ignoreStatsLoops = 12   # in units of sleepTime. eg. 12 cycles ~= 60s

# paths in web space
gifDir ='/bobMonitorGifs/'
pieURL = '/bobMon/pies/'
bobDataCmdURL = '/cgi-bin/catBobData';

# paths in file space
piePath = '/var/www/html/bobMon/pies/'
dataPath = '/var/spool/bobMon/'
trimImage = '/usr/sbin/trimImage'

# future: need configurable ganglia metrics. eg.
#    cpu1_temp cpu2_temp ambient_temp vs. gtemp_cpu2
#  metric names eg. ib_bytes_in vs. bytes_in

# pbsnodes command to show a summary for all nodes: -a OpenPBS/anupbs, and -l for torque
pbsNodesCommand = '-a'

# temperature display min/max for cpu
cpuMinTemp = 15.0
cpuMaxTemp = 75.0

# temperature display min/max for node
mbMinTemp = 20.0
mbMaxTemp = 45.0

ambientWarn = 40.0   # 35 is the dell limit

# how nodes are layed out in the rack temperature display.
# the 'fe' column is where all non-backend nodes will be placed
# NOTE: number of compute nodes here needs to add up 'numNodes'
racks = [ 64, 'fe', 64, 28 ];
rackTempOrder = 'up'   #   up == low number node at the bottom
                       # down == low number node at the top
# temperature font size
tempFontSize = -2

# 3 special rows of nodes are displayed under the compute nodes.
# typically these are where the front-end and i/o nodes are layed out.
# can be blank. eg. specialRow1 = []
# format here is [ 'name', 'type' ] where allowable types are 'head' and 'node'
specialRow1 = [ ['head','head'],
		['xe','node'],
		['xepbs','node'],
		['Lustre i/o','head'],
		['xemds','node'],
		['oss1','node'],
		['oss2','node'],
		['oss3','node'] ]

specialRow2 = [ ['sas short i/o','head'],
                ['xemds1','node'],
                ['sox1','node'],
                ['sox2','node'],
                ['sox3','node'],
                ['sox4','node'],
                ['sox5','node'],
                ['sox6','node'],
                ['sox7','node'],
                ['sox8','node'] ]

specialRow3 = [ ['fc jobfs i/o','head'],
                ['xemds2','node'],
                ['fox1','node'],
                ['fox2','node'],
                ['fox3','node'],
                ['fox4','node'],
                ['fox5','node'],
                ['fox6','node'],
                ['fox7','node'],
                ['fox8','node'] ]

#########################################
# derived data... leave these alone...
nonBackendNodes = []
nonBackendNodes.extend( headNodes )
nonBackendNodes.extend( ioNodes )
#########################################
