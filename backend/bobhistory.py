#!/usr/bin/python3

import cgi
import cgitb; cgitb.enable()
import gzip
from os import path

DATA_PATH = '/var/spool/bobMon2/'
FILE_NAME = 'history.json.gz'

# Return JSON object
print('Content-Type: application/json')
print('')

filepath = path.join(DATA_PATH, FILE_NAME)
with gzip.open(filepath, 'r') as f:
    print(f.read().decode('utf-8'))
