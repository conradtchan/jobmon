#!/usr/bin/env python
# this bobMonitor config file must contain only legal python code!!

# to link to your site's regular web pages
siteName = 'SUT'
siteURL = 'http://g2.hpc.swin.edu.au'

# name of the cookie for this bobMonitor instance. will be prefixed by 'bobMon-'
cookieSuffix = "g2"

# paths in web space
gifDir ='/bobMon/gifs/'
pieURL = '/bobMon/pies/'
bobDataCmdURL = '/cgi-bin/catBobData'

# paths in file space
pbsPath = '/opt/torque/bin'
mauiPath = '/opt/moab/bin'
piePath = '/var/www/html/bobMon/pies/'
dataPath = '/var/spool/bobMon/'
trimImage = '/usr/sbin/trimImage'

# known values: torque, anupbs
batchType = 'torque'

# ganglia config
# gather and merge data from all these gmonds
# these gmond's can provide the same data (gmonds in redundant config) or different data (eg. compute ganglia and storage ganglia)
#
# host, port, url
# url can be relative to this website or absolute. %h is expanded to the hostname
gmonds = [ ['hpc-mgmt', '8649', '/ganglia/?c=Lustre&h=%h'],
           ['192.168.55.13', '8649', '/ganglia/?c=g2&h=%h'] ]

# non-standard data in ganglia that we want to harvest and use
# NOTE: there needs to be server code in bobMon.py to insert these into the xml
#       and client side code in bobMon.js to display them.
#       so this line isn't all that is required to enable these features
extraGangliaMetrics = [ 'iconnect.kbin', 'iconnect.kbout', 'iconnect.pktin', 'iconnect.pktout',
                        'gpu0_util', 'gpu1_util', 'gpu2_util', 'gpu3_util', 'gpu4_util', 'gpu5_util', 'gpu6_util',
                        'cpu1_temp', 'cpu2_temp', 'ambient_temp', 'chassis_temp', 'rear_temp', 'front_temp', # temperatures
			'node_power', 'cmm_power_in', 'fan_rms'   # node and cmm input kw, cmm fans
			]

# map and scale ganglia metrics to byte/s in/out and packets/s in/out
metricMap = [ 'network', [ 'bytes_in',    [ 'iconnect.kbin',  1024 ],
                           'bytes_out',   [ 'iconnect.kbout', 1024 ],
                           'packets_in',  [ 'iconnect.pktin',  1 ],
                           'packets_out', [ 'iconnect.pktout', 1 ] ] ]

# cluster config. all nodes need to be listed. the naming format is
# eg.
#  y[1-1492]              -> y1 y2 ... y1492
#  x[003-007,100-200]-ib  -> x003-ib x004-ib ... x007-ib x100-ib x101-ib ... x200-ib
computeNodes = [ 'sstar[011-030,101-164,201-204]',
                 'gstar[011-058,101-105]',
                 'tao[01-03]' ]
headNodes = [ 'g2', 'sstar[001-003]', 'gstar[001-002]', 'pbs',
              'ldap[1-2]', 'hpc-mgmt', 'tapeserv01' ]
ioNodes = [ 'metadata[01-02]', 'object[01-12]' ]

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
specialRows = [ [ ['login','head'],
		  ['g2','node'],
                  ['interactive','head'],
                  ['sstar[001-003]','node'],
                  ['gstar[001-002]','node'],
                  ['tapeserv01','node'] ],
		[ ['infra- structure','head'],
                  ['hpc-mgmt','node'],
		  ['pbs','node'],
		  ['ldap[1-2]','node'] ],
                [ ['mds','head'],
                  ['metadata[01-02]','node'] ],
                [ ['oss', 'head' ],
                  ['object[01-12]','node'] ] ]

# how nodes are layed out in the racks - used for the rack temperature display
# the 'fe' column is where all non-backend nodes will be placed
# NOTE: number of nodes here needs to add up 'numNodes'
#   format is number of nodes in rack or 'fe', then type
#     where type is 'pizza' or  ['blade',bladesPerShelf,nodesPerBlade]
racks = [ [12,'pizza'],[12,'pizza'],[12,'pizza'],[12,'pizza'],
          [12,'pizza'],[12,'pizza'],[12,'pizza'],[12,'pizza'],
          [12,'pizza'],[12,'pizza'],[12,'pizza'],[12,'pizza'],
          ['fe','pizza'] ]

# name the blade shelves eg. cmm1, cmm2, ...
# number of shelves should add up to the number described in racks[]
shelves = []

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
