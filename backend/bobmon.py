#!/usr/bin/env python3

API_VERSION = 11

from os import path
from os import rename
from os import chmod
from os import unlink
import stat
import json
import time
import bobmon_config as config

# Get 644 for chmod
mode644 = (stat.S_IRUSR|stat.S_IWUSR|stat.S_IRGRP|stat.S_IROTH)

def do_api_version(data):
    data['api'] = API_VERSION

def do_all():
    data = {}
    do_api_version(data)
    return data

def write_data(data, filename):
    # Write to a temporary file, because it takes time
    tmp_filename = filename + '.new'
    with open(tmp_filename, 'w') as f:
        json.dump(data, f)
    chmod(tmp_filename, mode644)

    # Copy temporary file to live file
    try:
        rename(tmp_filename, filename)
    except (OSError, error):
        err_num, err_str = error
        print('write_data: renamed failed. OsError', error)
        if err_num == 13: # Permission denied
            print('Permission denied (probably running as a user)')
        unlink(tmp_filename)

if __name__ == '__main__':

    while True:
        data = do_all()

        output_file = path.join(config.DATA_PATH, 'bobData')
        write_data(data, output_file)
        time.sleep(config.UPDATE_INTERVAL)