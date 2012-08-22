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
clusterName = 'vayu'  # what you called the cluster in ganglia
gangliaNodeSuffix  = ''   # eg. '.mckenzie' if ganglia names for nodes
                          # are 'eh1.mckenzie' instead of just 'eh1'

# non-standard data in ganglia that we want to harvest and use
# NOTE: there needs to be server code in bobMon.py to insert these into the xml
#       and client side code in bobMon.js to display them.
#       so this line isn't all that is required to enable these features
extraGangliaMetrics = [ 'ib_bytes_in', 'ib_bytes_out',  # infiniband bytes/s
			'ib_pkts_in', 'ib_pkts_out',    # infiniband packets/s
			'cpu1_temp', 'cpu2_temp', 'ambient_temp', 'chassis_temp', 'rear_temp', 'front_temp', # temperatures
			'node_power', 'cmm_power_in', 'fan_rms',   # node and cmm input kw, cmm fans
			'vu_short_read_bytes', 'vu_short_write_bytes',  # bytes to the main lustre fs
			'vu_apps_mds_ops', 'vu_home_mds_ops', 'vu_images_mds_ops', 'vu_short_mds_ops', # iops to a range of lustre fs's
			]

# cluster config:
numNodes = 1492
nodeNumStart = 1     # eg. 1 means x1 is first node, not x0
# probably need a node name format in here one day - eg. x0001 vs. x1
baseNodeName = 'v'   # 'x' here means nodes are ... x77, x78, ...

headNodes = [ 'vayu1', 'vayu2', 'vayu3', 'vayu4', 'vu-pbs', 'vu-man2', 'vu-man3', 'vu-man4', 'gopher1', 'gopher2', 'gopher3', 'gopher4', 'knet00', 'knet01' ]
ioNodes = [ 'marmot1', 'marmot2', 'marmot3', 'marmot4', 'hamster1', 'hamster2', 'hamster3', 'hamster4', 'hamster5', 'hamster6', 'hamster7', 'hamster8', 'hamster9', 'hamster10', 'hamster11', 'hamster12', 'hamster13', 'hamster14', 'hamster15', 'hamster16', 'hamster17', 'hamster18', 'hamster19', 'hamster20', 'hamster21', 'hamster22', 'hamster23', 'hamster24', 'hamster25', 'hamster26' ]

# should really read this from PBS...
coresPerNode = 8

# time to sleep between stats gathering from ganglia, pbs etc.
sleepTime = 10   # time in seconds

# jobs stats are ignored for several iterations when a job starts and also when
# it comes back from being suspended because ganglia has a ~30s+ lag in it
# and we don't want to record leftover node stats from the previous job
ignoreStatsLoops = 6   # in units of sleepTime. eg. sleepTime * ignoreStatsLoops ~= 60s

# this hasn't been tested for a long time - might be broken:
showRackLoads = 0

# temperature display min/max for cpu
cpuMinTemp = 20.0
cpuMaxTemp = 100.0

# temperature display min/max for node
mb0MinTemp = 30.0   # rear blade
mb0MaxTemp = 70.0
mb1MinTemp = 20.0   # front blade
mb1MaxTemp = 40.0

ambientWarn = 45.0  # 35 is typical limit, but ambient sensors are often way off

# for the temperature display:
rackTempOrder = 'up'   #   up == low number node at the bottom of display
                       # down == low number node at the top of display

# temperature font size
tempFontSize = -2

# format here is [ 'name', 'type' ] where allowable types are 'head' and 'node'
# or [ '' ] if the element is to be left blank
# the name 'head' and 'i/o' are special tags that the server knows about
# and need to be kept? additional 'head' names are allowed
specialRows = [
              [ ['login','head'],
		['vayu1','node'],
		['vayu2','node'],
		['vayu3','node'],
		['vayu4','node'],
		['infra- structure','head'],
		['vu-pbs','node'],
		['vu-man2','node'],
		['vu-man3','node'],
		['vu-man4','node'],
		[''],
		['data mover', 'head' ],
		['gopher1','node'],
		['gopher2','node'],
		['gopher3','node'],
		['gopher4','node'],
		['routers', 'head' ],
		['knet00','node'],
		['knet01','node'] ],

              [ ['mds','head'],
                ['marmot1','node'],
                ['marmot2','node'],
                ['marmot3','node'],
                ['marmot4','node'] ],

              [ ['oss', 'head' ],
                ['hamster1','node'],
                ['hamster2','node'],
                ['hamster3','node'],
                ['hamster4','node'],
                ['hamster5','node'],
                ['hamster6','node'],
                ['hamster7','node'],
                ['hamster8','node'],
                ['hamster9','node'],
                ['hamster10','node'],
                ['hamster11','node'],
                ['hamster12','node'],
                ['hamster13','node'] ],

              [ ['oss', 'head' ],
                ['hamster14','node'],
                ['hamster15','node'],
                ['hamster16','node'],
                ['hamster17','node'],
                ['hamster18','node'],
                ['hamster19','node'],
                ['hamster20','node'],
                ['hamster21','node'],
                ['hamster22','node'],
                ['hamster23','node'],
                ['hamster24','node'],
                ['hamster25','node'],
                ['hamster26','node'] ]
 ]

# how nodes are layed out in the racks - used for the rack temperature display
# the 'fe' column is where all non-backend nodes will be placed
# NOTE: number of nodes here needs to add up 'numNodes'
#   format is number of nodes in rack or 'fe', then type
#     where type is 'pizza' or  ['blade',bladesPerShelf,nodesPerBlade]
racks = [ [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [96,['blade',12,2]], [52,['blade',12,2]], ['fe','pizza'] ]

# name the blade shelves eg. cmm1, cmm2, ...
# number of shelves should add up to the number described in racks[]
shelfName = 'cmm'
shelfStart = 1
numShelves = 63

shelfFanMinSpeed = 3000
shelfFanMaxSpeed = 6000
shelfMinPower = 2000
shelfMaxPower = 9000

# used in the per-job kW calculations.
# set a multiplier on the Watts reported by each node to reflect the real
# (wall) power being used rather than the power measured at each node. eg.
#   1.0  - the power for nodes is unmodified from that in ganglia
#   1.15 - modify the power reported by nodes in blades to account for
#          losses in the shelf/rack power supplies
nodeWattsMultiplier = 1.13

# use python to generate a list of shelves that we pay attention to
# (local variable start with _)
shelves = []
for _s in range(shelfStart,numShelves+shelfStart):
    shelves.append( shelfName + '%d' % _s )

#########################################
# derived data... leave these alone...
nonBackendNodes = []
nonBackendNodes.extend( headNodes )
nonBackendNodes.extend( ioNodes )
#########################################
