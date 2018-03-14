#!/usr/bin/python3

import cgitb
cgitb.enable()

import gzip
from os import path

print('Content-Type: application/json')
print('')

FILE_PATH = '/var/spool/bobMon2/'
FILE_NAME = 'bobData.json.gz'

filename = path.join(FILE_PATH, FILE_NAME)

with gzip.open(filename, 'r') as f:
    print(f.read().decode('utf-8'))
