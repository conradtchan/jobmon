# Location to output JSON
DATA_PATH = '/var/spool/bobMon2/'
FILE_NAME_PATTERN = 'bobData{:}.json.gz'

# Time between updating API
UPDATE_INTERVAL = 10

# Non-standard data in ganglia that we want to harvest and use
# NOTE: there needs to be server code in bobMon.py to insert these into the xml
#       and client side code in bobMon.js to display them.
#       so this line isn't all that is required to enable these features
EXTRA_GANGLIA_METRICS = [
    'ib_bytes_in', 'ib_bytes_out', 'ib_pkts_in', 'ib_pkts_out',
    'gpu0_util', 'gpu1_util', 'gpu2_util', 'gpu3_util', 'gpu4_util', 'gpu5_util', 'gpu6_util',
    'cpu1_temp', 'cpu2_temp', 'ambient_temp', 'chassis_temp', 'rear_temp', 'front_temp',  # temperatures
    'node_power', 'cmm_power_in', 'fan_rms',   # node and cmm input kw, cmm fans
    'farnarkle_fred_read_bytes', 'farnarkle_fred_write_bytes',  # lustre
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

# Max number for multicpu metric (set to maximum number of cores on system)
MULTICPU_MAX = 72

# How much history to return in a list (in seconds)
HISTORY_LENGTH = 86400

# When to delete old history (seconds old)
HISTORY_DELETE_AGE = 86400 * 1.1

# Nodes which contribute to the total count
CORE_COUNT_NODES = ['john', 'bryan']
