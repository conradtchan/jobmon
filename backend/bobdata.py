#!/usr/bin/python3

import cgi
import cgitb; cgitb.enable()
import gzip
from os import path
from glob import glob
import re

DATA_PATH = '/var/spool/bobMon2/'
FILE_NAME_PATTERN = 'bobData{:}.json.gz'

# GET arguments
arguments = cgi.FieldStorage()


def get_closest_file():
    if 'time' in arguments.keys():
        try:
            time_request = int(arguments['time'].value)
        except:
            return FILE_NAME_PATTERN.format('')

        # Get all the timestamps from filenames
        filenames = FILE_NAME_PATTERN.format('*')
        filepaths = path.join(DATA_PATH, filenames)
        data_files = glob(filepaths)
        times = []
        for x in data_files:
            filename = path.basename(x)
            match = re.search(FILE_NAME_PATTERN.format('(\d+)'), filename)
            if match is not None:
                times += [match.group(1)]

        if len(times) == 0:
            return FILE_NAME_PATTERN.format('')

        # Find closest time
        min_diff = 1.e15
        for i, t in enumerate(times):
            diff = abs(int(t) - time_request)
            if diff < min_diff:
                min_diff = diff
                closest_index = i

        time = times[closest_index]

        return FILE_NAME_PATTERN.format(time)
    else:
        return FILE_NAME_PATTERN.format('')


# Return JSON object
print('Content-Type: application/json')
print('')

filename = get_closest_file()
filepath = path.join(DATA_PATH, filename)
with gzip.open(filepath, 'r') as f:
    print(f.read().decode('utf-8'))
