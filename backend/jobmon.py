#!/usr/bin/env python3
import sys
import time

import jobmon_config as config
from backend_ozstar import BackendOzSTAR

if __name__ == "__main__":

    # Test cycle
    test = False

    # Skip history loading
    nohist = False

    if len(sys.argv) == 2:
        arg = sys.argv[1]
        nohist = arg == "nohist"
        test = arg == "test"
        if test:
            nohist = True

    print("Starting jobmon backend")
    b = BackendOzSTAR(no_history=nohist)

    if test:
        print("Testing backend, not writing any data")

        b.update_data()
        b.update_backfill()

        print("Done!")
        sys.exit()

    while True:
        time_start = b.timestamp()

        # Get all data
        print("Gathering data")
        try:
            # Main data update
            b.update_data()

            # Get core usage for new data
            print("Updating history")
            b.update_core_usage()

            # Calculate backfill
            b.update_backfill()

            # Write data to disk
            print("Writing data")
            b.write()

            time_finish = b.timestamp()
            time_taken = time_finish - time_start
            print("Done! Took {:} seconds".format(time_taken))
            sleep_time = max(0, config.UPDATE_INTERVAL - time_taken)

        except Exception as e:
            print("Error:", e)
            print("Trying again next cycle")
            sleep_time = config.UPDATE_INTERVAL

        print("Sleeping for {:} seconds".format(sleep_time))
        time.sleep(config.UPDATE_INTERVAL)
