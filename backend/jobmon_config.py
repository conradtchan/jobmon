# Backend subclass
BACKEND = "ozstar"

# Location to output JSON
DATA_PATH = "/var/spool/jobmon/"
FILE_NAME_PATTERN = "data{:}.json.gz"
FILE_NAME_HISTORY = "history.json.gz"
FILE_NAME_BACKFILL = "backfill.json.gz"

# Time between updating API
UPDATE_INTERVAL = 15

# Time-out for a dead node
NODE_DEAD_TIMEOUT = 60

# How much history to return in a list (in seconds)
HISTORY_LENGTH = 86400

# When to delete old history (seconds old)
HISTORY_DELETE_AGE = 86400

# Nodes to report
NODES = [
    "john",
    "bryan",
    "sstar",
    "gstar",
    "clarke",
    "trevor",
    "dave",
    "gina",
    "data-mover",
]

# Nodes which contribute to the total count
CORE_COUNT_NODES = ["john", "bryan", "dave", "gina", "trevor"]

# Nodes which have column-ordered CPUs
COLUMN_ORDER_CPUS = ["john", "bryan"]

# Nodes to print backfill
BF_NODES = ["milan", "trevor", "skylake"]

# Enable backfill
BACKFILL = True

# Some nodes have ethernet interfaces instead of IB
ETH_NODES = {"clarke": "eth1", "trevor": "eth1", "data-mover": "ens256"}

# Jobfs device name
JOBFS_DEV = {
    "default": "sda2",
    "bryan": "nvme0n1p1",
    "trevor": "vdb2",
    "clarke": "vda1",
    "dave": "nvme0n1",
    "gina": "nvme0n1",
}
