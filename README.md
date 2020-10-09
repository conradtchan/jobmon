Originally forked from https://github.com/plaguedbypenguins/bobMonitor, but now rewritten from the ground up, with an emphasis on providing information to users.

# Setup
Jobmon is designed for use on the OzSTAR supercomputer (http://supercomputing.swin.edu.au), but it can be adapted for any computing cluster.

Every system is different, so some configuration is required to get jobmon to gather stats from your setup. `backend/backend_base.py` contains a base class, which should be used as a template to write a class to interfae with your system. `backend/backend_ozstar.py` defines a derived class that is specific to OzSTAR, which provides an example of how to set things up. OzSTAR uses the Slurm scheduler, plus ganglia and influx to gather stats from the nodes. 

The following methods are overriden to make calls to the various interfaces (pyslurm, ganglia, influxdb):
- `cpu_usage`
- `mem`
- `swap`
- `disk`
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
- `job_has_mem_stats`
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

`backend/jobmon_config.py` defines the configuration options for the back end. If you've created `backend/backend_jarvis.py`, then you will need to set `BACKEND = "jarvis"`. You will also need to adjust the options to suit your needs.

`frontend/src/config.js` contains the configuration options for the front end. You'll also want to use your own logo image: `frontend/src/logo.png`.

# Installation

## Backend

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

Yarn (https://classic.yarnpkg.com/en/docs/getting-started) is required to build the front end on the development machine.

Build the optimised production frontend
```
cd frontend
yarn build
```

Install the frontend
```
cp build/* /var/www/html/jobmon
```

# Running

Run `/usr/lib/jobmon/jobmon.py`, which generates gzip'd JSON files at `/var/spool/jobmon`. These JSON files are read by the web app. You may install `jobmon.py` as a service.
