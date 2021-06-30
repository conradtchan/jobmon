# Non-standard data in ganglia that we want to harvest and use
# NOTE: there needs to be server code in jobmon.py to insert these into the xml
#       and client side code in jobmon.js to display them.
#       so this line isn't all that is required to enable these features
EXTRA_GANGLIA_METRICS = [
    "ib_bytes_in",
    "ib_bytes_out",
    "ib_pkts_in",
    "ib_pkts_out",
    "gpu0_util",
    "gpu1_util",
    "gpu2_util",
    "gpu3_util",
    "gpu4_util",
    "gpu5_util",
    "gpu6_util",
    "cpu1_temp",
    "cpu2_temp",
    "ambient_temp",
    "chassis_temp",
    "rear_temp",
    "front_temp",  # temperatures
    "node_power",
    "cmm_power_in",
    "fan_rms",  # node and cmm input kw, cmm fans
    "farnarkle_fred_read_bytes",
    "farnarkle_fred_write_bytes",  # lustre
    "diskstat_sda_read_bytes_per_sec",
    "diskstat_sda_write_bytes_per_sec",  # jobfs disk stats
]

# Ganglia config
# Gather and merge data from all these gmonds
# These gmond's can provide the same data (gmonds in redundant config) or different data
# (eg. compute ganglia and storage ganglia)
#
# host, port
GMONDS = [["transom1", 8649]]

# Max number for multicpu metric (set to maximum number of cores on system)
MULTICPU_MAX = 272
