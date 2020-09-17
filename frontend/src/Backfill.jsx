import React from 'react';

import {
  ResponsiveContainer,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
} from 'recharts';
import PropTypes from 'prop-types';

export default class Backfill extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tMaxRes: 7 * 24 * 3600, // Max reservable time
    };
  }

  timeString(num) {
    const { tMaxRes } = this.state;
    if (num === tMaxRes / 60) {
      return 'Unlimited';
    }
    const hours = Math.floor(num / 60);
    const minutes = num % 60;
    return `${hours}:${(`0${minutes}`).slice(-2)}`;
  }

  render() {
    const { tMaxRes } = this.state;
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
            tMax = tMaxRes;
          }
          if (tMin == null) {
            tMin = tMax;
          }

          data.push({
            cores,
            shortest: tMin,
            longest: tMax,
          });
          count[cores] = backfillData[partition][cores].count;
        }

        let unit = '-core';
        if (Object.keys(backfillData[partition]).length > 6) {
          unit = '';
        }

        backfillCharts.push(
          <div key={partition}>
            {partition}
            <ResponsiveContainer width="100%" height={100}>
              <BarChart
                data={data}
                layout="horizontal"
                barSize={20}
                barGap={0}
              >
                <XAxis dataKey="cores" unit={unit} interval={0} />
                <YAxis hide type="number" domain={[0, (8 * tMaxRes) / (24 * 7)]} allowDataOverflow />
                <Tooltip
                  labelFormatter={(cores) => `${cores} cores (${count[cores]} slot${count[cores] > 1 ? 's' : ''})`}
                  formatter={(value) => this.timeString(value / 60)}
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
          Available Resources
        </div>
        <div className="instruction">
          Jobs times shorter than the longest slot (mouseover) may be able to start instantly,
          subject to memory constraints.
          <br />
          <br />
        </div>
        {backfillCharts}

      </div>
    );
  }
}

Backfill.propTypes = {
  backfillData: PropTypes.objectOf(PropTypes.object),
};

Backfill.defaultProps = {
  backfillData: null,
};
