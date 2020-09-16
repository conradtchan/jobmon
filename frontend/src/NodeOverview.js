import React from 'react';
import JobText from './JobText';
import PropChartMini from './PropChartMini';
import NodePie from './NodePie';

export default class NodeOverview extends React.Component {
  getNodePies() {
    const nodePies = [];

    // Only these node names have jobs on them
    const nodeNames = Object.keys(this.props.nodeHasJob);
    const nameSorted = [];

    // Sort node names in a sensible way
    let maxNumLen = 0;
    for (const name of nodeNames) {
      const numbers = name.match(/\d/g);
      let index = 0;
      if (!(numbers === null)) {
        if (numbers.length > maxNumLen) maxNumLen = numbers.length;
        index += parseInt(numbers.join(''), 10);
      }
      nameSorted.push({
        name,
        sortIndex: name.replace(/\d/g, '') + index.toString().padStart(maxNumLen, '0'),
      });
    }
    nameSorted.sort((a, b) => ((a.sortIndex < b.sortIndex) ? -1 : (a.sortIndex > b.sortIndex) ? 1 : 0));

    for (const ns of nameSorted) {
      const nodeName = ns.name;

      if (this.props.nodeHasJob[nodeName].hasOwnProperty(this.props.jobId)) {
        const job = this.props.jobs[this.props.jobId];

        // CPU percent is only out of the requested cores
        const cpuUsage = this.props.getNodeUsage(
          this.props.jobId,
          job,
          this.props.nodeData[nodeName],
          nodeName,
        ).cpu;

        // CPU percent is out of the requested memory
        let memPercent = 0.0;
        if (!(this.props.nodeData[nodeName].mem === null)) {
          memPercent = 100 * job.mem[nodeName] / job.memReq;
        }

        let diskPercent = 0.0;
        if (!(this.props.nodeData[nodeName].disk === null)) {
          diskPercent = 100 * (1.0 - this.props.nodeData[nodeName].disk.free / this.props.nodeData[nodeName].disk.total);
        }
        let swapPercent = 0.0;
        if (!(this.props.nodeData[nodeName].swap === null)) {
          swapPercent = 100 * (1.0 - this.props.nodeData[nodeName].swap.free / this.props.nodeData[nodeName].swap.total);
        }
        let gpuPercent = 0.0;
        if (!(this.props.nodeData[nodeName].gpus === null)) {
          let nGpus = 0;
          for (const i in job.gpuLayout[nodeName]) {
            nGpus += 1;
            gpuPercent += this.props.nodeData[nodeName].gpus['gpu'.concat(i.toString())];
          }
          gpuPercent /= nGpus;
        }

        nodePies.push(
          <NodePie
            key={nodeName}
            nodeName={nodeName}
            cpuUsage={cpuUsage}
            mem={memPercent}
            disk={diskPercent}
            gpu={gpuPercent}
            swap={swapPercent}
            gangliaURL={this.props.gangliaURL}
            onRowClick={(node) => this.props.onRowClick(node)}
            nodeWarn={this.props.warnings[nodeName]}
            isGpuJob={job.nGpus > 0}
          />,
        );
      }
    }
    return nodePies;
  }

  getWarnedJobs() {
    const warnedJobs = [];
    // For each node in warnings
    for (const nodeName in this.props.warnings) {
      const warnings = this.props.warnings[nodeName];
      // For each job on each node
      over_jobs:
      for (const jobId in warnings.jobs) {
        if (!(warnedJobs.includes(jobId))) {
          // Job type warnings
          for (const warning in warnings.jobs[jobId]) {
            if (warnings.jobs[jobId][warning]) {
              warnedJobs.push(jobId);
              continue over_jobs;
            }
          }

          // Node type warnings
          for (const warning in warnings.node) {
            if (warnings.node[warning]) {
              warnedJobs.push(jobId);
              continue over_jobs;
            }
          }
        }
      }
    }
    return warnedJobs;
  }

  getUserJobList() {
    const warnedJobs = this.getWarnedJobs();

    const jobList = {
      running: [],
      pending: [],
      completed: [],
      cancelled: [],
      failed: [],
    };

    const userJobs = {};
    let nRunningJobs = 0;
    for (const jobId in this.props.jobs) {
      const job = this.props.jobs[jobId];
      if (job.username === this.props.username) {
        userJobs[jobId] = job;
        if (job.state === 'RUNNING') nRunningJobs++;
      }
    }

    for (const jobId in userJobs) {
      const job = userJobs[jobId];
      if (job.state === 'RUNNING') {
        const jobText = (
          <div key={jobId}>
            <div
              className="running-job-row"
              onClick={() => this.props.onJobClick(jobId)}
            >
              <div className="running-job-text">
                <JobText
                  id={jobId}
                  job={job}
                  warn={warnedJobs.includes(jobId)}
                />
              </div>
              {((nRunningJobs <= 10) || (jobId === this.props.jobId))
                            && (
                            <div className="running-job-chart">
                              {this.getRunningJobChart(job, jobId)}
                            </div>
                            )}
            </div>
            {(jobId === this.props.jobId)
                        && (
                        <div>
                          <div className="overview-pies">
                            {this.getNodePies()}
                          </div>
                        </div>
                        )}
          </div>
        );
        jobList.running.push(jobText);
      } else {
        const jobText = (
          <div key={jobId} className="other-job-row">
            <JobText
              id={jobId}
              job={job}
              warn={warnedJobs.includes(jobId)}
              onClick={() => this.props.onJobClick(jobId)}
            />
          </div>
        );
        if (job.state === 'PENDING') {
          jobList.pending.push(jobText);
        } else if (job.state === 'COMPLETED') {
          jobList.completed.push(jobText);
        } else if (job.state === 'CANCELLED') {
          jobList.cancelled.push(jobText);
        } else if (job.state === 'FAILED') {
          jobList.failed.push(jobText);
        }
      }
    }
    return jobList;
  }

  getRunningJobChart(job, jobId) {
    const style = getComputedStyle(document.documentElement);
    const historyChart = [];

    const sortedHistory = this.props.historyData;
    sortedHistory.sort((a, b) => ((a.timestamp < b.timestamp) ? -1 : (a.timestamp > b.timestamp) ? 1 : 0));

    const chartRes = 20;
    let nSkip = 1;
    if (chartRes < sortedHistory.length) {
      nSkip = Math.floor(sortedHistory.length / chartRes);
    }
    let i = 0;

    const memRequested = job.memReq * 1024 ** 2 * Object.keys(job.layout).length;

    for (const data of sortedHistory) {
      i++;
      if (!(i % nSkip === 0)) continue;

      const { nodes } = data;

      // Job CPU usage for all nodes of job
      const usage = this.props.getJobUsage(jobId, job, nodes);

      const d = new Date(data.timestamp * 1000);

      historyChart.push({
        timeString: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
        user: usage.cpu.user,
        system: usage.cpu.system,
        wait: usage.cpu.wait,
        used: usage.mem.used * 1024 ** 2, // mb
        max: usage.mem.max * 1024 ** 2, // mb
        request: memRequested, // used = memory used, request = memory requested (text shortened for display)
        gpu: usage.gpu.total,
      });
    }

    return (
      <div className="mini-row">
        <PropChartMini
          name="Job CPU usage"
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
          hasGpu={job.nGpus > 0}
        />
        <PropChartMini
          name="Job Memory usage"
          data={historyChart}
                    // dataKeys = {['used', 'max', 'request']}
          dataKeys={['used', 'request']}
          colors={[
            style.getPropertyValue('--piecolor-mem'),
            // style.getPropertyValue('--piecolor-mem'),
            style.getPropertyValue('--piecolor-mem'),
          ]}
          lineStyle={[
            'fill',
            // 'line',
            'dashed',
          ]}
          unit="B"
          dataMax={memRequested}
          stacked
          hasGpu={job.nGpus > 0}
        />
        {job.nGpus > 0 && (
        <PropChartMini
          name="Job GPU usage"
          data={historyChart}
          dataKeys={['gpu']}
          colors={[
            style.getPropertyValue('--piecolor-gpu'),
          ]}
          lineStyle={[
            'fill',
          ]}
          unit="%"
          dataMax={100}
          stacked
          hasGpu={job.nGpus > 0}
        />
        )}
      </div>
    );
  }

  render() {
    const jobList = this.getUserJobList();

    const legend = (
      <div id="cpu-legend">
        <div className="cpu-legend-item">
          <div className="circle user">
                    &nbsp;
          </div>
          <div className="cpu-legend-label">
            user
          </div>
        </div>
        <div className="cpu-legend-item">
          <div className="circle system">
                    &nbsp;
          </div>
          <div className="cpu-legend-label">
            sys
          </div>
        </div>
        <div className="cpu-legend-item">
          <div className="circle wait">
                    &nbsp;
          </div>
          <div className="cpu-legend-label">
            wait
          </div>
        </div>
        <div className="cpu-legend-item">
          <div className="circle mem">
                    &nbsp;
          </div>
          <div className="cpu-legend-label">
            mem
          </div>
        </div>
        <div className="cpu-legend-item">
          <div className="circle gpu">
                    &nbsp;
          </div>
          <div className="cpu-legend-label">
            gpu
          </div>
        </div>
      </div>
    );

    if (this.props.username === null) {
      return (
        <div className="main-item center">
          <div className="instruction">
            Select a user on the left to view jobs
          </div>
          <br />
          {(Object.keys(this.props.warnedUsers).length > 0)
                    && (
                    <div className="bad-job">
                      Red users and jobs may require attention
                    </div>
                    )}
        </div>
      );
    }

    return (
      <div className="main-item center">
        <div id="username-title">
          {this.props.username}
        </div>
        {legend}

        <br />
        <div className="heading">
          Running
        </div>
        {jobList.running}
        <br />

        <div className="job-names">
          {(jobList.pending.length > 0)
                        && (
                        <div>
                          <div className="job-names heading">
                            Pending
                          </div>
                          <div>
                            {jobList.pending}
                          </div>
                        </div>
                        )}
          {(jobList.completed.length > 0)
                        && (
                        <div>
                          <div className="job-names heading">
                            Completed
                          </div>
                          <div>
                            {jobList.completed}
                          </div>
                        </div>
                        )}
          {(jobList.cancelled.length > 0)
                        && (
                        <div>
                          <div className="job-names heading">
                            Cancelled
                          </div>
                          <div>
                            {jobList.cancelled}
                          </div>
                        </div>
                        )}
          {(jobList.failed.length > 0)
                        && (
                        <div>
                          <div className="job-names heading">
                            Failed
                          </div>
                          <div>
                            {jobList.failed}
                          </div>
                        </div>
                        )}
        </div>
      </div>
    );
  }
}
