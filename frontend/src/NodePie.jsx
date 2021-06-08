import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Label,
} from "recharts";
import PropTypes from "prop-types";

export default class NodePie extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { expanded: false };
  }

  render() {
    const {
      cpuUsage,
      mem,
      gpu,
      nodeWarn,
      nodeName,
      onRowClick,
      isGpuJob,
    } = this.props;

    const { expanded } = this.state;

    const style = getComputedStyle(document.documentElement);

    const cpuColors = [
      style.getPropertyValue("--piecolor-blank"),
      style.getPropertyValue("--piecolor-system"),
      style.getPropertyValue("--piecolor-wait"),
      style.getPropertyValue("--piecolor-user"),
    ];

    const memColors = [
      style.getPropertyValue("--piecolor-blank"),
      style.getPropertyValue("--piecolor-mem"),
    ];

    const gpuColors = [
      style.getPropertyValue("--piecolor-blank"),
      style.getPropertyValue("--piecolor-gpu"),
    ];

    const data = {
      cpu: [
        { name: "user", data: cpuUsage.user },
        { name: "wait", data: cpuUsage.wait },
        { name: "system", data: cpuUsage.system },
        { name: "idle", data: cpuUsage.idle },
      ],
      mem: [
        { name: "mem", data: mem },
        { name: "free", data: 100 - mem },
      ],
      gpu: [
        { name: "gpu", data: gpu },
        { name: "free", data: 100 - gpu },
      ],
    };

    // Make label red if warning
    let doWarn = false;
    if (Object.keys(nodeWarn).length > 0) {
      const nodes = Object.keys(nodeWarn.node);
      for (let i = 0; i < nodes.length; i += 1) {
        const w = nodes[i];
        if (nodeWarn.node[w]) {
          doWarn = true;
          break;
        }
      }
      const jobs = Object.keys(nodeWarn.jobs);
      for (let i = 0; i < jobs.length; i += 1) {
        const jobId = jobs[i];
        const jobWarn = Object.keys(nodeWarn.jobs[jobId]);
        for (let j = 0; j < jobWarn.length; j += 1) {
          const w = jobWarn[j];
          if (nodeWarn.jobs[jobId][w]) {
            doWarn = true;
            break;
          }
        }
      }
    }
    let nameColor = "";
    if (doWarn) {
      nameColor = style.getPropertyValue("--bad-job-color");
    } else {
      nameColor = style.getPropertyValue("--text-color");
    }

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

    const nodeLetters = nodeName.replace(/\d+/g, "");
    const nodeNumber = parseInt(nodeName.match(/\d+$/)[0], 10);

    let dRing = 0;
    if (expanded) dRing = 10;

    return (
      <button type="button" className="overview-pie" onClick={() => onRowClick(nodeName)}>
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
              isAnimationActive={false}
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
                      key={entry.name}
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
              isAnimationActive={false}
            >
              {
                data.mem.reverse().map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={memColors[index]}
                    />
                  ),
                )
              }
            </Pie>
            {isGpuJob && (
            <Pie
              data={data.gpu}
              nameKey="name"
              dataKey="data"
              innerRadius={`${60 + dRing}%`}
              outerRadius={`${75 + dRing}%`}
              startAngle={90}
              endAngle={450}
              isAnimationActive={false}
            >
              {
                data.gpu.reverse().map(
                  (entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={gpuColors[index]}
                    />
                  ),
                )
              }
            </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
      </button>
    );
  }
}

NodePie.propTypes = {
  cpuUsage: PropTypes.objectOf(PropTypes.number).isRequired,
  mem: PropTypes.number.isRequired,
  gpu: PropTypes.number.isRequired,
  nodeWarn: PropTypes.objectOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.number, PropTypes.number, PropTypes.object])),
  ).isRequired,
  nodeName: PropTypes.string.isRequired,
  onRowClick: PropTypes.func.isRequired,
  isGpuJob: PropTypes.bool.isRequired,
};
