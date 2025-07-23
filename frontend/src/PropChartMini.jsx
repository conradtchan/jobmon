import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  XAxis,
  YAxis,
} from "recharts";
import PropChart from "./PropChart";

export default class PropChartMini extends PropChart {
  render() {
    const d = this.scaledData();
    const areas = this.getAreas(d.scale);

    let chartClass = "prop-chart-mini-2";
    if (this.props.hasGpu) {
      chartClass = "prop-chart-mini-3";
    }

    return (
      <div className={chartClass}>
        <ResponsiveContainer>
          <AreaChart
            data={d.scaledData}
          >
            {areas}
            <XAxis
              hide
              label="time"
              dataKey="timeString"
            />
            <YAxis
              hide
              domain={[0, d.dataMax]}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
