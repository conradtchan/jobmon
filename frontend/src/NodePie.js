import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from 'recharts';

export default class NodePie extends React.Component {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    const style = getComputedStyle(document.documentElement);

    const cpuColors = [
      style.getPropertyValue('--piecolor-blank'),
      style.getPropertyValue('--piecolor-system'),
      style.getPropertyValue('--piecolor-wait'),
      style.getPropertyValue('--piecolor-user'),
    ];

    const memColors = [
      style.getPropertyValue('--piecolor-blank'),
      style.getPropertyValue('--piecolor-mem'),
    ];

    const gpuColors = [
      style.getPropertyValue('--piecolor-blank'),
      style.getPropertyValue('--piecolor-gpu'),
    ];

    const data = {
      cpu: [
        { name: 'user', data: this.props.cpuUsage.user },
        { name: 'wait', data: this.props.cpuUsage.wait },
        { name: 'system', data: this.props.cpuUsage.system },
        { name: 'idle', data: this.props.cpuUsage.idle },
      ],
      mem: [
        { name: 'mem', data: this.props.mem },
        { name: 'free', data: 100 - this.props.mem },
      ],
      gpu: [
        { name: 'gpu', data: this.props.gpu },
        { name: 'free', data: 100 - this.props.gpu },
      ],
    };

    // Make label red if warning
    let doWarn = false;
    if (this.props.nodeWarn) {
      for (const w in this.props.nodeWarn.node) {
        if (this.props.nodeWarn.node[w]) {
          doWarn = true;
          break;
        }
      }
      for (const jobId in this.props.nodeWarn.jobs) {
        for (const w in this.props.nodeWarn.jobs[jobId]) {
          if (this.props.nodeWarn.jobs[jobId][w]) {
            doWarn = true;
            break;
          }
        }
      }
    }
    let nameColor = '';
    if (doWarn) nameColor = style.getPropertyValue('--bad-job-color');

    function PieLabel({ viewBox, value1, value2 }) {
      const { cx, cy } = viewBox;
      return (
        <text
          x={cx}
          y={cy}
          fill={nameColor}
          textAnchor="middle"
          dominantBaseline="central"
        >
          <tspan alignmentBaseline="middle" x={cx} dy="-0.4em" fontSize="12">{value1}</tspan>
          <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize="12">{value2}</tspan>
        </text>
      );
    }

    const nodeLetters = this.props.nodeName.replace(/\d+/g, '');
    const nodeNumber = parseInt(this.props.nodeName.match(/\d+$/)[0], 10);

    let dRing = 0;
    if (this.state.expanded) dRing = 10;

    return (
      <div className="overview-pie" onClick={() => this.props.onRowClick(this.props.nodeName)}>
        <ResponsiveContainer>
          <PieChart
            onMouseEnter={() => this.setState({ expanded: true })}
            onMouseLeave={() => this.setState({ expanded: false })}
            cursor="pointer"
          >
            <Pie
              data={data.cpu}
              nameKey="name"
              dataKey="data"
              innerRadius={`${90 + dRing}%`}
              outerRadius={`${110 + dRing}%`}
              startAngle={90}
              endAngle={450}
            >
              <Label
                position="center"
                content={(
                  <PieLabel
                    value1={nodeLetters}
                    value2={nodeNumber}
                  />
)}
              />
              {
                                data.cpu.reverse().map(
                                  (entry, index) => (
                                    <Cell
                                      key={index}
                                      fill={cpuColors[index]}
                                    />
                                  ),
                                )
                            }
            </Pie>
            <Pie
              data={data.mem}
              nameKey="name"
              dataKey="data"
              innerRadius={`${75 + dRing}%`}
              outerRadius={`${90 + dRing}%`}
              startAngle={90}
              endAngle={450}
            >
              {
                                data.mem.reverse().map(
                                  (entry, index) => (
                                    <Cell
                                      key={index}
                                      fill={memColors[index]}
                                    />
                                  ),
                                )
                            }
            </Pie>
            {this.props.isGpuJob && (
            <Pie
              data={data.gpu}
              nameKey="name"
              dataKey="data"
              innerRadius={`${60 + dRing}%`}
              outerRadius={`${75 + dRing}%`}
              startAngle={90}
              endAngle={450}
            >
              {
                                data.gpu.reverse().map(
                                  (entry, index) => (
                                    <Cell
                                      key={index}
                                      fill={gpuColors[index]}
                                    />
                                  ),
                                )
                            }
            </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
