import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import JobText from './JobText';
import PropChart from './PropChart';

export default class NodeDetails extends React.Component {
  getCorePies() {
    // Cores belonging to selected job
    let jobCores = [];
    if (!(this.props.selectedJobId === null)) {
      const jobLayout = this.props.jobs[this.props.selectedJobId].layout;
      if (jobLayout.hasOwnProperty(this.props.name)) {
        jobCores = jobLayout[this.props.name];
      }
    }
    const corePies = [];
    for (let i = 0; i < this.props.node.cpu.coreC.length; i++) {
      const core = this.props.node.cpu.coreC[i];
      let coreSelected = false;
      if (!(jobCores === null)) {
        coreSelected = jobCores.includes(i);
      }

      corePies.push(
        <CorePie
          key={i}
          type="cpu"
          data={[
            { name: 'user', data: core[this.props.cpuKeys.user] + core[this.props.cpuKeys.nice] },
            { name: 'wait', data: core[this.props.cpuKeys.wait] },
            { name: 'system', data: core[this.props.cpuKeys.system] },
            { name: 'idle', data: core[this.props.cpuKeys.idle] },
          ]}
          selected={coreSelected}
        />,
      );
    }
    return corePies;
  }

  getWarnings() {
    const warningText = [];

    if (this.props.warnings.hasOwnProperty(this.props.name)) {
      if (this.props.warnings[this.props.name].node.swapUse) {
        warningText.push('Node is using disk swap');
      }

      if (this.props.warnings[this.props.name].jobs.hasOwnProperty(this.props.selectedJobId)) {
        const jobWarns = this.props.warnings[this.props.name].jobs[this.props.selectedJobId];
        if (jobWarns.cpuUtil) {
          warningText.push('Job underutilizes requested CPUs');
        }
        if (jobWarns.cpuWait) {
          warningText.push('Job spends significant time waiting');
        }
        if (jobWarns.memUtil) {
          warningText.push('Job underutilizes requested memory');
        }
      }
    }

    const warningList = [];
    if (warningText.length > 0) {
      for (const w of warningText) {
        warningList.push(
          <div key={w} className="bad-job">
            Warning:
            {' '}
            {w}
          </div>,
        );
      }
    }
    return warningList;
  }

  getOtherJobList() {
    const otherJobList = [];

    for (const jobId in this.props.jobs) {
      if (this.props.jobs[jobId].layout.hasOwnProperty(this.props.name)) {
        if (!(this.props.jobs[jobId].username === this.props.username)) {
          let warnJob = false;
          if (Object.keys(this.props.warnings).length > 0) {
            warnJob = this.props.warnings[this.props.name].jobs.hasOwnProperty(jobId);
          }
          otherJobList.push(
            <div key={jobId} className="cohab-job" onClick={() => this.props.onJobClick(jobId)}>
              <JobText
                key={jobId}
                id={jobId}
                job={this.props.jobs[jobId]}
                warn={warnJob}
              />
            </div>,
          );
        }
      }
    }
    return otherJobList;
  }

  getHistoryChart() {
    const historyChart = [];

    const sortedHistory = this.props.historyData;
    sortedHistory.sort((a, b) => ((a.timestamp < b.timestamp) ? -1 : (a.timestamp > b.timestamp) ? 1 : 0));

    for (const data of sortedHistory) {
      const nodeData = data.nodes[this.props.name];

      let jobMem = 0.0;
      let jobMemMax = 0.0;
      let jobMemRequested = 0.0;
      let jobUser = 0.0;
      let jobSystem = 0.0;
      let jobWait = 0.0;
      // Only if the job has started running
      if (data.jobs.hasOwnProperty(this.props.selectedJobId)) {
        const job = data.jobs[this.props.selectedJobId];

        const usage = this.props.getNodeUsage(this.props.selectedJobId, data.jobs[this.props.selectedJobId], nodeData, this.props.name);

        // Memory usage
        if (job.mem.hasOwnProperty(this.props.name)) {
          jobMem = usage.mem.used;
          jobMemMax = usage.mem.max;
          jobMemRequested = job.memReq;
        }

        // CPU usage
        jobUser = usage.cpu.user;
        jobSystem = usage.cpu.system;
        jobWait = usage.cpu.wait;
      }

      const d = new Date(data.timestamp * 1000);
      const x = {
        time: data.timestamp,
        timeString: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
        user: nodeData.cpu.totalC[this.props.cpuKeys.user] + nodeData.cpu.totalC[this.props.cpuKeys.nice],
        system: nodeData.cpu.totalC[this.props.cpuKeys.system],
        wait: nodeData.cpu.totalC[this.props.cpuKeys.wait],
        mem: nodeData.mem.used * 1024 ** 2, // mb
        job_user: jobUser,
        job_system: jobSystem,
        job_wait: jobWait,
        job_mem: jobMem * 1024 ** 2, // mb
        job_mem_max: jobMemMax * 1024 ** 2, // mb
        job_mem_requested: jobMemRequested * 1024 ** 2, // mb
        swap: (nodeData.swap.total - nodeData.swap.free) * 1024 ** 2, // mb
        infiniband_in: nodeData.infiniband.bytes_in,
        infiniband_out: nodeData.infiniband.bytes_out,
        infiniband_pkts_in: nodeData.infiniband.pkts_in,
        infiniband_pkts_out: nodeData.infiniband.pkts_out,
        lustre_read: nodeData.lustre.read,
        lustre_write: nodeData.lustre.write,
        jobfs_read: nodeData.jobfs.read,
        jobfs_write: nodeData.jobfs.write,
      };
      for (let i = 0; i < nodeData.nGpus; i++) {
        const gpuName = `gpu${i.toString()}`;
        x[gpuName] = nodeData.gpus[gpuName];
      }
      historyChart.push(x);
    }
    return historyChart;
  }

  hasMemStats() {
    let hasMem = false;
    for (const data of this.props.historyData) {
      if (data.jobs.hasOwnProperty(this.props.selectedJobId)) {
        if (data.jobs[this.props.selectedJobId].hasMem) {
          hasMem = true;
        }
      }
    }

    return hasMem;
  }

  getGpuNames() {
    const gpuNames = [];
    for (let i = 0; i < this.props.node.nGpus; i++) {
      const gpuName = `gpu${i.toString()}`;
      gpuNames.push(gpuName);
    }
    return gpuNames;
  }

  getPropCharts(historyChart, gpuNames) {
    const style = getComputedStyle(document.documentElement);

    return (
      <div className="prop-charts">
        <PropChart
          name="CPU total"
          data={historyChart}
          dataKeys={['user', 'system', 'wait']}
          colors={[
            style.getPropertyValue('--piecolor-user'),
            style.getPropertyValue('--piecolor-system'),
            style.getPropertyValue('--piecolor-wait'),
          ]}
          lineStyle={[
            'fill',
            'fill',
            'fill',
          ]}
          unit="%"
          dataMax={100}
          stacked
        />
        <PropChart
          name="Memory"
          data={historyChart}
          dataKeys={['mem']}
          colors={[
            style.getPropertyValue('--piecolor-mem'),
          ]}
          lineStyle={[
            'fill',
          ]}
          unit="B"
          dataMax={this.props.node.mem.total * 1024 ** 2}
          stacked={false}
        />
        <PropChart
          name="Swap"
          data={historyChart}
          dataKeys={['swap']}
          colors={[
            style.getPropertyValue('--piecolor-wait'),
          ]}
          lineStyle={[
            'fill',
          ]}
          unit="B"
          dataMax={this.props.node.swap.total * 1024 ** 2}
          stacked={false}
        />
        <PropChart
          name="GPU"
          data={historyChart}
          dataKeys={gpuNames}
          colors={[
            style.getPropertyValue('--piecolor-gpu'),
          ]}
          lineStyle={[
            'fill',
          ]}
          unit="%"
          dataMax={100}
          stacked={false}
        />
        <PropChart
          name="InfiniBand traffic"
          data={historyChart}
          dataKeys={['infiniband_in', 'infiniband_out']}
          colors={[
            style.getPropertyValue('--piecycle-1'),
            style.getPropertyValue('--piecycle-2'),
          ]}
          lineStyle={[
            'fill',
            'fill',
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="InfiniBand packet rate"
          data={historyChart}
          dataKeys={['infiniband_pkts_in', 'infiniband_pkts_out']}
          colors={[
            style.getPropertyValue('--piecycle-3'),
            style.getPropertyValue('--piecycle-4'),
          ]}
          lineStyle={[
            'fill',
            'fill',
          ]}
          unit="/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="Lustre access"
          data={historyChart}
          dataKeys={['lustre_read', 'lustre_write']}
          colors={[
            style.getPropertyValue('--piecycle-1'),
            style.getPropertyValue('--piecycle-2'),
          ]}
          lineStyle={[
            'fill',
            'fill',
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="JOBFS access"
          data={historyChart}
          dataKeys={['jobfs_read', 'jobfs_write']}
          colors={[
            style.getPropertyValue('--piecycle-1'),
            style.getPropertyValue('--piecycle-2'),
          ]}
          lineStyle={[
            'fill',
            'fill',
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
      </div>
    );
  }

  getJobPropCharts(historyChart, hasMemStats) {
    const style = getComputedStyle(document.documentElement);

    const charts = [];

    charts.push(
      <PropChart
        key="cpu"
        name="CPU"
        data={historyChart}
        dataKeys={['job_user', 'job_system', 'job_wait']}
        colors={[
          style.getPropertyValue('--piecolor-user'),
          style.getPropertyValue('--piecolor-system'),
          style.getPropertyValue('--piecolor-wait'),
        ]}
        lineStyle={[
          'fill',
          'fill',
        ]}
        unit="%"
        dataMax={100}
        stacked
      />,
    );

    if (hasMemStats) {
      charts.push(
        <PropChart
          key="mem"
          name="Memory"
          data={historyChart}
          dataKeys={['job_mem', 'job_mem_max', 'job_mem_requested']}
          colors={[
            style.getPropertyValue('--piecolor-mem'),
            style.getPropertyValue('--piecolor-mem'),
            style.getPropertyValue('--piecolor-mem'),
          ]}
          lineStyle={[
            'fill',
            'line',
            'dashed',
          ]}
          unit="B"
          stacked={false}
        />,
      );
    }

    return (
      <div className="prop-charts">
        {charts}
      </div>
    );
  }

  render() {
    if (this.props.username === null) {
      return null;
    } if (this.props.node === null) {
      return (
        <div className="main-item right">
          <div className="instruction">
            Select a running job to view nodes
          </div>
          <br />
          {this.props.selectedJobId === null ? null
            : (
              <div className="instruction">
                Select a node to view detailed system usage
              </div>
            )}
        </div>
      );
    }
    const corePies = this.getCorePies();

    const historyChart = this.getHistoryChart();
    const gpuNames = this.getGpuNames();

    const warningList = this.getWarnings();
    const otherJobList = this.getOtherJobList();

    return (
      <div className="main-item right">
        <div id="nodename-title">
          {this.props.selectedJobId}
          {' '}
          {(this.props.selectedJobId !== null) && 'on'}
          {' '}
          {this.props.name}
        </div>
        <div id="nodename-subtitle">
          {(this.props.selectedJobId !== null) && this.props.jobs[this.props.selectedJobId].name}
        </div>
        {warningList}

        <div className="time-selector">
          <input type="radio" id="5h" name="timeWindow" value="5h" onChange={() => this.props.changeTimeWindow(18000)} checked={this.props.timeWindow === 18000} />
          <label> 5 hours   </label>
          <input type="radio" id="1h" name="timeWindow" value="1h" onChange={() => this.props.changeTimeWindow(3600)} checked={this.props.timeWindow === 3600} />
          <label> 1 hour   </label>
          <input type="radio" id="10m" name="timeWindow" value="10m" onChange={() => this.props.changeTimeWindow(600)} checked={this.props.timeWindow === 600} />
          <label> 10 minutes   </label>
        </div>
        <br />
        <div className="heading">
          Job resource usage
        </div>

        {this.getJobPropCharts(historyChart, this.hasMemStats())}

        <div className="heading">
          Node resource usage
        </div>
        <div>
          CPU cores
        </div>
        <div className="core-grid">
          {corePies}
        </div>

        {this.getPropCharts(historyChart, gpuNames)}

        {(otherJobList.length > 0)

                    && (
                    <div>
                      <div className="job-names heading">
                        Cohabitant jobs
                      </div>
                      <div>
                        {otherJobList}
                      </div>
                    </div>
                    )}
      </div>
    );
  }
}

class CorePie extends React.Component {
  render() {
    const style = getComputedStyle(document.documentElement);
    const pieColors = [];
    pieColors.push(style.getPropertyValue('--piecolor-blank'));
    pieColors.push(style.getPropertyValue('--piecolor-system'));
    pieColors.push(style.getPropertyValue('--piecolor-wait'));
    pieColors.push(style.getPropertyValue('--piecolor-user'));

    let ring = 0;
    if (this.props.selected) ring = 100;

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
                            // isAnimationActive={false}
              stroke="none"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
