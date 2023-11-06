#!/bin/bash

# Location of backend script
JOBMON_DIR=/home/cchan/backend

# Lockfile to prevent multiple instances running
LOCKFILE=/tmp/.jobmon.lockfile

# Dependencies
export PYTHONPATH=/apps/influxdb-client/1.34.0-py3/lib64/python3.6/site-packages:/apps/pyslurm/23.2.x-20230910-py3/lib64/python3.6/site-packages:$PYTHONPATH

(
flock -n 9 || exit 1

cd $JOBMON_DIR
/usr/bin/python3 jobmon.py > jobmon.log

) 9>$LOCKFILE
