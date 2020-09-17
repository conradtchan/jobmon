import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import PropTypes from 'prop-types';

export default class CorePie extends React.Component {
  render() {
    const { selected } = this.props;
    const style = getComputedStyle(document.documentElement);
    const pieColors = [];
    pieColors.push(style.getPropertyValue('--piecolor-blank'));
    pieColors.push(style.getPropertyValue('--piecolor-system'));
    pieColors.push(style.getPropertyValue('--piecolor-wait'));
    pieColors.push(style.getPropertyValue('--piecolor-user'));

    let ring = 0;
    if (selected) ring = 100;

    return (
      <div className="core-pie">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={this.props.data}
              nameKey="name"
              dataKey="data"
              innerRadius="0%"
              outerRadius="100%"
              startAngle={90}
              endAngle={450}
            >
              {
                this.props.data.reverse().map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={pieColors[index]}
                    />
                  ),
                )
              }
            </Pie>
            {/* Selector ring */}
            <Pie
              data={[{ name: 'ring', ring }]}
              nameKey="name"
              dataKey="ring"
              innerRadius="110%"
              outerRadius="130%"
              startAngle={90}
              endAngle={450}
              fill="#222222"
              paddingAngle={0}
              stroke="none"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

CorePie.propTypes = {
  selected: PropTypes.bool,
};
