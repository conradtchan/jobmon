import React from 'react';
import PropTypes from 'prop-types';

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

  shouldComponentUpdate(nextProps) {
    const {
      runningData,
      activeIndex,
      activeSectorSize,
    } = this.props;

    for (let i = 0; i < runningData.length; i += 1) {
      if (activeIndex !== nextProps.activeIndex) {
        return true
      } if (activeSectorSize !== nextProps.activeSectorSize) {
        return true
      } if (runningData[i].username !== nextProps.runningData[i].username) {
        return true;
      } if (runningData[i].cpus !== nextProps.runningData[i].cpus) {
        return true;
      } if (runningData[i].jobs !== nextProps.runningData[i].jobs) {
        return true;
      }
    }

    return false;
  }

  handleResize = () => {
    this.forceUpdate();
  };

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
    if (activeSectorSize === 'small') {
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
    const style = getComputedStyle(document.documentElement);
    const pieColors = [
      style.getPropertyValue('--piecycle-1'),
      style.getPropertyValue('--piecycle-2'),
      style.getPropertyValue('--piecycle-3'),
      style.getPropertyValue('--piecycle-4'),
    ];

    const {
      runningData,
      activeIndex,
      runningCores,
      availCores,
      onPieClick,
    } = this.props;

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
              paddingAngle={2}
              startAngle={90 + (360 * (1.0 - (runningCores / availCores)))}
              endAngle={450}
              onClick={(data, index) => onPieClick(data, index)}
              onMouseEnter={(data, index) => this.pieMouseEnter(data, index)}
              onMouseLeave={(data, index) => this.pieMouseLeave(data, index)}
              isAnimationActive={false}
            >
              {
                runningData.map(
                  (entry, index) => (
                    <Cell
                      key={entry.username}
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

UsagePie.propTypes = {
  onMouseEnter: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  activeSectorSize: PropTypes.string.isRequired,
  runningData: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ).isRequired,
  runningCores: PropTypes.number.isRequired,
  availCores: PropTypes.number.isRequired,
  activeIndex: PropTypes.number,
  onPieClick: PropTypes.func.isRequired,
};

UsagePie.defaultProps = {
  activeIndex: null,
};
