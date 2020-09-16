import React from 'react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Label,
} from 'recharts';

export default class UsagePie extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

    handleResize = () => {
      this.forceUpdate();
    };

    renderActiveShape(props) {
      const {
        cx, cy, innerRadius, outerRadius, startAngle, endAngle,
        fill,
      } = props;

      let growth = 0.0;
      if (this.props.activeSectorSize === 'small') {
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

    pieMouseEnter(data, index) {
      this.props.onMouseEnter(data, index);
    }

    pieMouseLeave(data, index) {
      this.props.onMouseLeave();
    }

    render() {
      const style = getComputedStyle(document.documentElement);
      const pieColors = [
        style.getPropertyValue('--piecycle-1'),
        style.getPropertyValue('--piecycle-2'),
        style.getPropertyValue('--piecycle-3'),
        style.getPropertyValue('--piecycle-4'),
      ];

      const pieDiv = document.getElementById('usage-pie');
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
          <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
            <tspan alignmentBaseline="middle" x={cx} dy="-0.2em" fontSize={pieWidth / 6}>{value1}</tspan>
            <tspan alignmentBaseline="middle" x={cx} dy="1.7em" fontSize={pieWidth / 18}>{value2}</tspan>
            <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize={pieWidth / 21}>{value3}</tspan>
          </text>
        );
      }

      const pieData = [];
      for (const user of this.props.runningData) {
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
                activeIndex={this.props.activeIndex}
                activeShape={(props) => this.renderActiveShape(props)}
                data={pieData}
                nameKey="username"
                dataKey="cpus"
                labelLine={false}
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={2}
                startAngle={90 + (360 * (1.0 - (this.props.runningCores / this.props.availCores)))}
                endAngle={450}
                onClick={(data, index) => this.props.onPieClick(data, index)}
                onMouseEnter={(data, index) => this.pieMouseEnter(data, index)}
                onMouseLeave={(data, index) => this.pieMouseLeave(data, index)}
              >
                {
                                this.props.runningData.map(
                                  (entry, index) => (
                                    <Cell
                                      key={index}
                                      fill={pieColors[index % pieColors.length]}
                                      cursor="pointer"
                                    />
                                  ),
                                )
                            }
                <Label
                                // width="50%"
                  position="center"
                  content={(
                    <PieLabel
                      value1={`${(this.props.runningCores / this.props.availCores * 100).toFixed(0)}%`}
                      value2={`(${this.props.runningCores} / ${this.props.availCores})`}
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
