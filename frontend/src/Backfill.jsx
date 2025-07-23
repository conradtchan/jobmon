import React from "react";

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
} from "recharts";
import config from "./config";

function timeString(num) {
  const hours = Math.floor(num / 3600);
  const minutes = Math.floor((num % 3600) / 60);
  return `${hours}:${(`0${minutes}`).slice(-2)}`;
}

export default class Backfill extends React.PureComponent {
  render() {
    const style = getComputedStyle(document.documentElement);
    const tickColor = style.getPropertyValue("--text-color");
    const textColor = style.getPropertyValue("--text-color-alt");

    const { backfillData } = this.props;

    const backfillCharts = [];
    const sortedPartitions = Object.keys(backfillData).sort();
    for (let i = 0; i < sortedPartitions.length; i += 1) {
      const partition = sortedPartitions[i];
      // If not empty
      if (Object.keys(backfillData[partition]).length > 0) {
        const data = [];
        const count = {};
        const coreCounts = Object.keys(backfillData[partition]);
        for (let j = 0; j < coreCounts.length; j += 1) {
          const cores = coreCounts[j];
          let { tMin, tMax } = backfillData[partition][cores];

          if (tMax == null) {
            tMax = config.tMaxRes;
          }
          if (tMin == null) {
            tMin = tMax;
          }

          // If the backfill slot is longer than the max reservation time,
          // don't display a value greater than the max because users cannot
          // request that much anyway
          if (tMin > config.tMaxRes) {
            tMin = config.tMaxRes;
          }

          if (tMax > config.tMaxRes) {
            tMax = config.tMaxRes;
          }

          data.push({
            cores,
            shortest: tMin,
            longest: tMax,
          });
          count[cores] = backfillData[partition][cores].count;
        }

        let unit = "-core";
        if (Object.keys(backfillData[partition]).length > 6) {
          unit = "";
        }

        backfillCharts.push(
          <div className="backfill-partition" key={partition}>
            <div className="backfill-partition-name">{partition}</div>
            <div className="backfill-partition-chart">
              <ResponsiveContainer width="100%" height={100}>
                <BarChart
                  data={data}
                  layout="horizontal"
                  barSize={20}
                  barGap={0}
                >
                  <XAxis
                    dataKey="cores"
                    unit={unit}
                    interval={0}
                    tick={{ fill: tickColor }}
                  />
                  <YAxis
                    type="number"
                    domain={[0, (dataMax) => Math.min(dataMax, config.tMaxRes)]}
                    allowDataOverflow
                    tickFormatter={(value) => timeString(value)}
                    tick={{ fill: tickColor }}
                  />
                  <Tooltip
                    labelFormatter={(cores) => `${cores} cores (${count[cores]} slot${count[cores] > 1 ? "s" : ""} available)`}
                    formatter={(value) => timeString(value)}
                    labelStyle={{ color: textColor }}
                  />
                  <Bar dataKey="shortest" fill="#8884d8" />
                  <Bar dataKey="longest" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>,
        );
      }
    }

    return (
      <div className="main-item center-right">
        <div className="backfill-header">
          AVAILABLE RESOURCES
        </div>

        <div className="backfill-summary">
          <div className="backfill-summary-title">
            Backfill Opportunities
          </div>
          <div className="backfill-summary-description">
            Jobs with shorter time requests may start instantly, subject to memory constraints.
          </div>
        </div>

        <div className="backfill-partitions">
          <div className="backfill-charts">
            {backfillCharts}
          </div>
        </div>

        <div className="backfill-legend">
          <div className="backfill-legend-title">How to read this chart:</div>
          <div className="backfill-legend-explanation">
            Each chart shows available compute slots for a partition.
            {" "}
            The horizontal axis shows the number
            {" "}
            of CPU cores, and the vertical axis shows the maximum time duration available.
          </div>
          <div className="backfill-legend-items">
            <div className="backfill-legend-item">
              <div className="backfill-legend-color backfill-legend-shortest" />
              <span>Shortest available slot duration</span>
            </div>
            <div className="backfill-legend-item">
              <div className="backfill-legend-color backfill-legend-longest" />
              <span>Longest available slot duration</span>
            </div>
          </div>
          <div className="backfill-legend-usage">
            <strong>Quick scheduling:</strong>
            {" "}
            If your job needs X cores for Y time, find the X-core column and check if Y
            {" "}
            is shorter than the green bar.
            {" "}
            If so, your job may start immediately instead of waiting in the queue.
          </div>
          <div className="backfill-legend-note">
            Hover over bars for detailed slot counts and exact timing information
          </div>
        </div>

      </div>
    );
  }
}
