#!/usr/bin/env python3
import importlib
import logging
import sys
import time

import jobmon_config as config

logging.basicConfig(
    stream=sys.stdout,
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
# logging.getLogger("jobmon").setLevel(logging.DEBUG)

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
        b.job_average_cpu_usage()
        sys.exit()

    while True:
        b.time_start = b.timestamp()

        # Get all data
        try:
            # Main data update
            b.update_data()

            # Calculate backfill
            b.update_backfill()

            # Write data to disk
            b.write()

            time_finish = b.timestamp()
            b.time_taken = time_finish - b.time_start
            sleep_time = max(0, config.UPDATE_INTERVAL - b.time_taken)

            b.write_influx()

            log.info(
                f"Cycle completed in {b.time_taken} seconds, now sleeping for {sleep_time} seconds...\n"
            )

        except Exception as e:
            print(e)
            log.error("Trying again next cycle")
            sleep_time = config.UPDATE_INTERVAL

        time.sleep(sleep_time)
