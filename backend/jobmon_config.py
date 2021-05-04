# Backend subclass
BACKEND = "ozstar"

# Location to output JSON
DATA_PATH = "/var/spool/jobmon/"
FILE_NAME_PATTERN = "data{:}.json.gz"
FILE_NAME_HISTORY = "history.json.gz"
FILE_NAME_BACKFILL = "backfill.json.gz"

# Time between updating API
UPDATE_INTERVAL = 30

# Time-out for a dead node
NODE_DEAD_TIMEOUT = 60

# How much history to return in a list (in seconds)
HISTORY_LENGTH = 43200

# When to delete old history (seconds old)
HISTORY_DELETE_AGE = 86400

# Nodes which contribute to the total count
CORE_COUNT_NODES = ["john", "bryan"]

# Nodes which have column-ordered CPUs
COLUMN_ORDER_CPUS = ["john", "bryan"]

# Nodes with HT
HT_NODES = [["gina", 68, 4]]

# Nodes to print backfill
BF_NODES = ["skylake", "skylake-gpu", "sstar", "gstar", "knl"]

# CPU keys
CPU_KEYS = ["user", "nice", "system", "wait", "idle"]

# Enable backfill
BACKFILL = True
