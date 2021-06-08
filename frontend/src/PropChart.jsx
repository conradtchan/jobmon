import React from "react";
import PropTypes from "prop-types";
import {
  ResponsiveContainer,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
} from "recharts";
import constants from "./constants";

export default class PropChart extends React.PureComponent {
  getAreas(scale) {
    const {
      dataKeys,
      lineStyle,
      stacked,
      unit,
      colors,
    } = this.props;

    const items = [];

    // Make areas
    for (let i = 0; i < dataKeys.length; i += 1) {
      if (lineStyle[i] === "dashed") {
        items.push(
          <Area
            key={dataKeys[i]}
            type="monotone"
            nameKey="time"
            dataKey={dataKeys[i]}
            stroke={colors[i]}
            fillOpacity={0}
            strokeDasharray="5 5"
            stackId={stacked ? "2" : i}
            isAnimationActive={false}
            unit={scale + unit}
          />,
        );
      } else if (lineStyle[i] === "line") {
        items.push(
          <Area
            key={dataKeys[i]}
            type="monotone"
            nameKey="time"
            dataKey={dataKeys[i]}
            stroke={colors[i]}
            fillOpacity={0}
            stackId={stacked ? "2" : i}
            isAnimationActive={false}
            unit={scale + unit}
          />,
        );
      } else {
        items.push(
          <Area
            key={dataKeys[i]}
            type="monotone"
            nameKey="time"
            dataKey={dataKeys[i]}
            stroke={colors[i]}
            fill={colors[i]}
            stackId={stacked ? "1" : i}
            isAnimationActive={false}
            unit={scale + unit}
          />,
        );
      }
    }

    return items;
  }

  scaledData() {
    const {
      data,
      dataKeys,
      unit,
    } = this.props;
    // Determine unit scaling
    let maxVal = 0;
    let { dataMax } = this.props;

    if (dataMax === parseInt(dataMax, 10)) {
      maxVal = parseInt(dataMax, 10);
    } else {
      for (let i = 0; i < data.length; i += 1) {
        for (let j = 0; j < dataKeys.length; j += 1) {
          const key = dataKeys[j];
          if (data[i][key] > maxVal) {
            maxVal = data[i][key];
          }
        }
      }
    }
    let factor;
    let scale;
    const thresh = 1;
    if (maxVal > thresh * constants.gb) {
      factor = constants.gb;
      scale = "G";
    } else if (maxVal > thresh * constants.mb) {
      factor = constants.mb;
      scale = "M";
    } else if (maxVal > thresh * constants.kb) {
      factor = constants.kb;
      scale = "K";
    } else {
      factor = 1;
      scale = "";
    }

    // Scale max
    if ((dataMax === parseInt(dataMax, 10)) && !(unit === "%")) {
      dataMax = Math.floor(dataMax / factor);
    }

    // Set number of digits
    let digits = 0;
    if (maxVal / factor < 10) {
      digits = 1;
    }

    // Scale all data
    const scaledData = [];
    for (let i = 0; i < data.length; i += 1) {
      scaledData.push({});
      for (let j = 0; j < dataKeys.length; j += 1) {
        const key = dataKeys[j];
        scaledData[i][key] = (data[i][key] / factor).toFixed(digits);
      }
      // Time for X Axis
      scaledData[i].time = data[i].time;
      scaledData[i].timeString = data[i].timeString;
    }

    return { scaledData, dataMax, scale };
  }

  render() {
    const {
      name,
      unit,
    } = this.props;

    const style = getComputedStyle(document.documentElement);
    const tickColor = style.getPropertyValue("--text-color");
    const textColor = style.getPropertyValue("--text-color-alt");

    const d = this.scaledData();
    const areas = this.getAreas(d.scale);

    return (
      <div className="prop-chart-group">
        <div>
          {name}
        </div>
        <div className="prop-chart">
          <ResponsiveContainer>
            <AreaChart
              data={d.scaledData}
            >
              <XAxis
                hide
                label="time"
                dataKey="timeString"
              />
              <YAxis
                width={80}
                orientation="right"
                padding={{ top: 5, bottom: 5 }}
                type="number"
                domain={[0, d.dataMax]}
                unit={d.scale + unit}
                interval={0}
                tick={{ fill: tickColor }}
              />
              {areas}
              <Tooltip labelStyle={{ color: textColor }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

PropChart.propTypes = {
  dataKeys: PropTypes.arrayOf(PropTypes.string).isRequired,
  lineStyle: PropTypes.arrayOf(PropTypes.string).isRequired,
  stacked: PropTypes.bool.isRequired,
  unit: PropTypes.string.isRequired,
  colors: PropTypes.arrayOf(PropTypes.string).isRequired,
  data: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ).isRequired,
  dataMax: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  name: PropTypes.string.isRequired,
};

PropChart.defaultProps = {
  dataMax: null,
};
