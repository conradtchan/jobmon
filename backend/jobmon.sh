#!/bin/bash

(
flock -n 9 || exit 1

cd /home/cchan/backend

export PYTHONPATH=$PYTHONPATH:/apps/pyslurm/20.02.6/lib64/python3.6/site-packages
export RRDCACHED_ADDRESS=unix:/mnt/rrd/var_lib/ganglia/rrds/rrdcached.sock

/usr/bin/python3 jobmon.py

) 9>/home/cchan/backend/.lockfile
