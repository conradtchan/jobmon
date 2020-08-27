from os import chmod, rename, unlink
import gzip
import json
import stat


def mode644():
    return stat.S_IRUSR | stat.S_IWUSR | stat.S_IRGRP | stat.S_IROTH


def write_data(data, filename):
    # Write to a temporary file, because it takes time
    tmp_filename = filename + ".new"
    json_str = json.dumps(data)
    json_bytes = json_str.encode("utf-8")
    with gzip.open(tmp_filename, "wb") as f:
        f.write(json_bytes)
    chmod(tmp_filename, mode644())

    # Rename temporary file to live file
    try:
        rename(tmp_filename, filename)
    except (OSError, error):
        err_num, err_str = error
        print("write_data: renamed failed. OsError", error)
        if err_num == 13:  # Permission denied
            print("Permission denied (probably running as a user)")

        # Unlink temp file
        unlink(tmp_filename)
