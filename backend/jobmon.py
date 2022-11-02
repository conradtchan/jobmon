#!/usr/bin/env python3
import importlib
import logging
import sys
import time

import jobmon_config as config

logging.basicConfig(stream=sys.stdout, level=logging.INFO)

backend = importlib.import_module("backend_{:}".format(config.BACKEND))

if __name__ == "__main__":
    log = logging.getLogger("jobmon")

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

    log.info("Starting jobmon backend: {:}".format(config.BACKEND))
    b = backend.Backend(no_history=nohist)

    if test:
        log.info("Testing backend, not writing any data")
        b.update_data()
        b.update_backfill()
        sys.exit()

    while True:
        time_start = b.timestamp()

        # Get all data
        try:
            # Main data update
            b.update_data()

            # Get core usage for new data
            b.update_core_usage()

            # Calculate backfill
            b.update_backfill()

            # Write data to disk
            b.write()

            time_finish = b.timestamp()
            time_taken = time_finish - time_start
            log.info("Done! Took {:} seconds".format(time_taken))
            sleep_time = max(0, config.UPDATE_INTERVAL - time_taken)

        except Exception as e:
            log.error("Error:", e)
            log.error("Trying again next cycle")
            sleep_time = config.UPDATE_INTERVAL

        log.info("Sleeping for {:} seconds".format(sleep_time))
        time.sleep(sleep_time)
