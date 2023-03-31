Originally forked from https://github.com/plaguedbypenguins/bobMonitor, but now rewritten from the ground up, with an emphasis on providing information to users.

A Python script runs periodically on the management node to collect statistics and write them to a JSON file, which is served to the browser by a minimal backend. Most of the processing is performed in the browser, which will allow user customisation further down the track.

# Setup
Jobmon is designed for use on the OzSTAR supercomputer (http://supercomputing.swin.edu.au), but it can be adapted for any computing cluster. Please get in touch if you would like to run this on your cluster. There will most likely be a lot of tweaking required to adapt it to your needs and I'm happy to point you in the right direction.

Every system is different, so some configuration is required to get jobmon to gather stats from your setup. `backend/backend_base.py` contains a base class, which should be used as a template to write a class to interfae with your system. `backend/backend_ozstar.py` defines a derived class that is specific to OzSTAR, which provides an example of how to set things up. OzSTAR uses the Slurm scheduler, plus ganglia and influx to gather stats from the nodes.

The following methods are overriden to make calls to the various interfaces (pyslurm, ganglia, influxdb):
- `cpu_usage`
- `mem`
- `swap`
- `gpus`
- `infiniband`
- `lustre`
- `jobfs`
- `node_up`
- `is_counted`
- `n_cpus`
- `n_gpus`
- `hostnames`
- `job_ids`
- `job_name`
- `job_username`
- `job_ncpus`
- `job_ngpus`
- `job_state`
- `job_layout`
- `job_gpu_layout`
- `job_time_limit`
- `job_run_time`
- `job_mem`
- `job_mem_max`
- `job_mem_request`
- `core_usage`
- `pre_update`
- `calculate_backfill`

You will need to make your own subclass. For example, create `backend/backend_jarvis.py`, then override these methods. This file should look like this:

```
from backend_base import BackendBase

class Backend(BackendBase):
  def cpu_usage(self):
    ...

```

`backend/jobmon_config.py` defines the configuration options for the back end. For example, if you've created `backend/backend_jarvis.py`, then you will need to set `BACKEND = "jarvis"`.

## Backend configuration
- `DATA_PATH`: Location to write JSON files
- `FILE_NAME_PATTERN`: File name pattern of snapshots (must include `{:}` for the timestamp)
- `FILE_NAME_HISTORY`: File name of the history data file
- `FILE_NAME_BACKFILL`: File name of the backfill data file
- `UPDATE_INTERVAL`: Time between updating snapshots (seconds)
- `NODE_DEAD_TIMEOUT`: How long a node should be non-responsive before marking as down
- `HISTORY_LENGTH`: How much history to return in a list (seconds)
- `HISTORY_DELETE_AGE`: The purge age for old history records (seconds)
- `CORE_COUNT_NODES`: Which nodes contribute to the total count
- `COLUMN_ORDER_CPUS`: CPUs that have column-ordered cores (row-ordered by default)
- `BF_NODES`: Queues to display backfill for

## Frontend configuration
`frontend/src/config.js` contains the configuration options for the front end. You'll also want to use your own logo image: `frontend/src/logo.png`.

- `homepage`: URL to the webpage of your computing cluster
- `address`: Address of the API (script serving the JSON files)
- `apiVersion`: Version number of the API
- `pageTitle`: Title displayed at the top of the job monitor
- `fetchFrequency`: How often to fetch data (should be the same as the backend update frequency)
- `fetchHistoryFrequency`: How often to update the history array (used for displaying past statistics)
- `fetchBackfillFrequency`: How often to update the backfill data
- `maintenanceAge`: Trigger a maintenance message if snapshots are older than this amount of time
- `cpuKeys`: Map of CPU usage types to an array index
- `historyDataCountInitial`: Number of data points to load initially to generate charts
- `historyResolutionMultiplier`: Factor to increase resolution by in successive refinements of chart data

The thresholds for warnings can be tweaked:
- `warnSwap`: Percentage of swap use
- `warnWait`: Percentage of CPU wait time
- `warnUtil`: Percentage of CPU utilisation (less than)
- `warnMem`: Percentage of requested memory used
- `baseMem`: Megabytes of memory per core not to count towards warning
- `baseMemSingle`: Same as `baseMem`, but for the first core of the job
- `graceTime`: Minutes to give jobs to get set up without warning
- `warningWindow`: Seconds to scan for warnings
- `warningFraction`: Only trigger a warning if greater than this fraction in the `warningWindow` have problems
- `terribleThreshold`: Warning score threshold to mark jobs as "terrible"

The `"homepage"` property in `package.json` should be set to the URL of the job monitor page (which is most likely not the same as the computing cluster homepage).

# Installation

## Backend

Python 3 (3.4 or higher) is required on the machine running the back end.

Make the data directory where JSON output is written to (set in the backend config)
```
mkdir /var/spool/jobmon
```

Install the cgi-bin Python scripts
```
cp cgi-bin/* /var/www/cgi-bin/
```

Install the backend
```
cp backend/* /usr/lib/jobmon
```

## Frontend

Yarn (https://yarnpkg.com) is required to build the front end on the development machine. Note: Yarn only needs to be installed on the development machine to build the frontend - it does not need to be installed on the web server. Once the .js files have been built, simply copy them to the web server.

Navigate to the frontend directory
```
cd frontend
```

Install dependencies
```
yarn install
```

Build the optimised production frontend
```
yarn build
```

Install the frontend by copying the contents of the build directory to the web server
```
cp -r build/* /var/www/html/jobmon
```

# Running

Run `backend/jobmon.sh`, which manages the backend script `jobmon.py`. Set the `JOBMON_DIR` and `LOCKFILE` in `jobmon.sh`. Alternatively, run `python jobmon.py` directly. The backend generates gzip'd JSON files at `/var/spool/jobmon`. These JSON files are read by the web app.
