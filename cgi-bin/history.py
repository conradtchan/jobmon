#!/usr/bin/python3
import cgitb
from os import path
from sys import stdout

cgitb.enable()

DATA_PATH = "/var/spool/jobmon/"
FILE_NAME = "history.json.gz"

# Return compressed JSON object
stdout.write("Content-Encoding: gzip\n")
stdout.write("Content-Type: application/json\n\n")

stdout.flush()
filepath = path.join(DATA_PATH, FILE_NAME)
with open(filepath, "rb") as f:
    stdout.buffer.write(f.read())
