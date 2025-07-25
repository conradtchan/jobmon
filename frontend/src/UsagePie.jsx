import React from "react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Label,
} from "recharts";

export default class UsagePie extends React.Component {
  componentDidMount() {
    window.addEventListener("resize", this.handleResize);
  }

  shouldComponentUpdate(nextProps) {
    const {
      runningData,
      activeIndex,
      activeSectorSize,
      badness,
    } = this.props;

    if (runningData.length !== nextProps.runningData.length) {
      return true;
    }

    if (activeIndex !== nextProps.activeIndex) {
      return true;
    }

    if (activeSectorSize !== nextProps.activeSectorSize) {
      return true;
    }

    if (badness !== nextProps.badness) {
      return true;
    }

    for (let i = 0; i < runningData.length; i += 1) {
      if (runningData[i].username !== nextProps.runningData[i].username) {
        return true;
      } if (runningData[i].cpus !== nextProps.runningData[i].cpus) {
        return true;
      } if (runningData[i].jobs !== nextProps.runningData[i].jobs) {
        return true;
      }
    }

    return false;
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    this.forceUpdate();
  };

  // Get color based on user efficiency/badness score
  static getEfficiencyColor(badness) {
    if (badness > 1000) {
      // Very poor efficiency (terrible users) - red
      return "#e53e3e";
    }
    if (badness > 100) {
      // Low efficiency - orange
      return "#ff8042";
    }
    if (badness > 10) {
      // Medium efficiency - yellow
      return "#ffbb28";
    }
    // High efficiency (low badness score) - green
    return "#00c49f";
  }

  pieMouseEnter(data, index) {
    const { onMouseEnter } = this.props;
    onMouseEnter(data, index);
  }

  pieMouseLeave() {
    const { onMouseLeave } = this.props;
    onMouseLeave();
  }

  renderActiveShape(shapeProps) {
    const {
      cx, cy, innerRadius, outerRadius, startAngle, endAngle,
      fill,
    } = shapeProps;

    const { activeSectorSize } = this.props;

    let growth = 0.0;
    if (activeSectorSize === "small") {
      growth = 0.02;
    } else {
      growth = 0.04;
    }

    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius * (1.0 - growth)}
          outerRadius={outerRadius * (1.0 + growth)}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          cursor="pointer"
        />
      </g>
    );
  }

  render() {
    const {
      runningData,
      activeIndex,
      runningCores,
      availCores,
      onPieClick,
      badness,
    } = this.props;

    const pieDiv = document.getElementById("usage-pie");
    let pieWidth;
    if (pieDiv) {
      pieWidth = pieDiv.offsetWidth;
    } else {
      pieWidth = 300;
    }

    function PieLabel({
      viewBox, value1, value2, value3,
    }) {
      const { cx, cy } = viewBox;
      return (
        <text x={cx} y={cy} className="piechart-label" textAnchor="middle" dominantBaseline="central">
          <tspan alignmentBaseline="middle" x={cx} dy="-0.2em" fontSize={pieWidth / 6}>{value1}</tspan>
          <tspan alignmentBaseline="middle" x={cx} dy="1.7em" fontSize={pieWidth / 18}>{value2}</tspan>
          <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize={pieWidth / 21}>{value3}</tspan>
        </text>
      );
    }

    const pieData = [];
    for (let i = 0; i < runningData.length; i += 1) {
      const user = runningData[i];
      pieData.push({
        username: user.username,
        cpus: user.cpus,
      });
    }

    return (
      <div id="usage-pie" style={{ height: pieWidth }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={(shapeProps) => this.renderActiveShape(shapeProps)}
              data={pieData}
              nameKey="username"
              dataKey="cpus"
              labelLine={false}
              innerRadius="60%"
              outerRadius="80%"
              fill="#8884d8"
              paddingAngle={0.5}
              startAngle={90 + (360 * (1.0 - (runningCores / availCores)))}
              endAngle={450}
              onClick={(data, index) => onPieClick(data, index)}
              onMouseEnter={(data, index) => this.pieMouseEnter(data, index)}
              onMouseLeave={(data, index) => this.pieMouseLeave(data, index)}
              isAnimationActive={false}
            >
              {
                runningData.map(
                  (entry) => {
                    let color;

                    // Check if badness data is available and warnings have been calculated
                    // badness will exist but all be 0 when warnings haven't been processed yet
                    if (badness && Object.prototype.hasOwnProperty.call(badness, entry.username)) {
                      // Check if any user has non-zero badness
                      // (indicating warnings have been calculated)
                      const hasMeaningfulBadnessData = Object.values(badness)
                        .some((value) => value > 0);

                      if (hasMeaningfulBadnessData) {
                        // Use efficiency-based color for users with calculated badness
                        color = UsagePie.getEfficiencyColor(badness[entry.username]);
                      } else {
                        // Use neutral grey when warnings haven't been calculated yet
                        color = "#8b92a3"; // Neutral grey that works in both light and dark themes
                      }
                    } else {
                      // Use neutral grey color for users without badness data
                      color = "#8b92a3"; // Neutral grey that works in both light and dark themes
                    }

                    return (
                      <Cell
                        key={entry.username}
                        fill={color}
                        cursor="pointer"
                      />
                    );
                  },
                )
              }
              <Label
                              // width="50%"
                position="center"
                content={(
                  <PieLabel
                    value1={`${((runningCores / availCores) * 100).toFixed(0)}%`}
                    value2={`(${runningCores} / ${availCores})`}
                    value3="core utilization"
                  />
)}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
