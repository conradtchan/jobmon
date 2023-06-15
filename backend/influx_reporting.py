import influx_config
from influxdb_client import InfluxDBClient

# Set up InfluxDB client
influx_client = InfluxDBClient(
    url=influx_config.URL,
    token=influx_config.TOKEN,
    org=influx_config.ORG,
)


def report_cadence(time, timestamp):
    """
    Report the time of a cycle to InfluxDB.
    """
    write_api = influx_client.write_api()
    write_api.write(
        bucket=influx_config.BUCKET_JOBMON,
        org=influx_config.ORG,
        record=[
            {
                "measurement": "jobmon_cadence",
                "fields": {"value": time},
                "time": timestamp,
            }
        ],
        write_precision="s",
    )
    write_api.close()
