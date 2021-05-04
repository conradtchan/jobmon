#!/bin/bash

(
flock -n 9 || exit 1

# Location of backend script
JOBMON_DIR=/home/cchan/backend

# Lockfile to prevent multiple instances running
LOCKFILE=/tmp/.jobmon.lockfile

# Dependencies
export PYTHONPATH=$PYTHONPATH:/apps/pyslurm/20.02.6/lib64/python3.6/site-packages
export RRDCACHED_ADDRESS=unix:/mnt/rrd/var_lib/ganglia/rrds/rrdcached.sock

cd $JOBMON_DIR
/usr/bin/python3 jobmon.py

) 9>$LOCKFILE
