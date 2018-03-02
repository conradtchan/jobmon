# Location to output JSON
DATA_PATH = '/home/cchan/'

# Time between updating API
UPDATE_INTERVAL = 10

# Non-standard data in ganglia that we want to harvest and use
# NOTE: there needs to be server code in bobMon.py to insert these into the xml
#       and client side code in bobMon.js to display them.
#       so this line isn't all that is required to enable these features
EXTRA_GANGLIA_METRICS = [
    'bytes_in', 'bytes_out', 'pkts_in', 'pkts_out',
    'gpu0_util', 'gpu1_util', 'gpu2_util', 'gpu3_util', 'gpu4_util', 'gpu5_util', 'gpu6_util',
    'cpu1_temp', 'cpu2_temp', 'ambient_temp', 'chassis_temp', 'rear_temp', 'front_temp',  # temperatures
    'node_power', 'cmm_power_in', 'fan_rms'   # node and cmm input kw, cmm fans
]

# Ganglia config
# Gather and merge data from all these gmonds
# These gmond's can provide the same data (gmonds in redundant config) or different data
# (eg. compute ganglia and storage ganglia)
#
# host, port, url
# url can be relative to this website or absolute. %h is expanded to the hostname
GMONDS = [ ['transom1', 8649, '/ganglia/?c=farnarkle&h=%h'] ]

# Time-out for a dead node
NODE_DEAD_TIMEOUT = 60