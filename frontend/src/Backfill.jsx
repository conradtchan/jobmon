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
          <div className="label" key={partition}>
            {partition}
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
          </div>,
        );
      }
    }

    return (
      <div className="main-item center-right">
        <div className="heading">
          Available Resources (Backfill)
        </div>
        <div className="instruction">
          Jobs with time requests shorter than the longest slot (mouseover)
          may be able to start instantly, subject to memory constraints.
          Jobs that request time beyond what is available in backfill will
          be scheduled to start in the future.
          <br />
          <br />
        </div>
        {backfillCharts}

      </div>
    );
  }
}
