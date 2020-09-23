import React from 'react';
import PropTypes from 'prop-types';
import JobText from './JobText';
import PropChartMini from './PropChartMini';
import NodePie from './NodePie';

export default class NodeOverview extends React.Component {
  getNodePies() {
    const {
      nodeHasJob,
      jobId,
      jobs,
      nodeData,
      gangliaURL,
      onRowClick,
      warnings,
      getNodeUsage,
    } = this.props;

    const nodePies = [];

    // Only these node names have jobs on them
    const nodeNames = Object.keys(nodeHasJob);
    const nameSorted = [];

    // Sort node names in a sensible way
    let maxNumLen = 0;
    for (let i = 0; i < nodeNames.length; i += 1) {
      const name = nodeNames[i];
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
    nameSorted.sort(
      (a, b) => {
        if (a.sortIndex < b.sortIndex) {
          return -1;
        } if (a.sortIndex > b.sortIndex) {
          return 1;
        }
        return 0;
      },
    );

    for (let i = 0; i < nameSorted.length; i += 1) {
      const ns = nameSorted[i];
      const nodeName = ns.name;

      if (Object.prototype.hasOwnProperty.call(nodeHasJob[nodeName], jobId)) {
        const job = jobs[jobId];

        // CPU percent is only out of the requested cores
        const cpuUsage = getNodeUsage(
          jobId,
          job,
          nodeData[nodeName],
          nodeName,
        ).cpu;

        // CPU percent is out of the requested memory
        let memPercent = 0.0;
        if (!(nodeData[nodeName].mem === null)) {
          memPercent = 100 * (job.mem[nodeName] / job.memReq);
        }

        let diskPercent = 0.0;
        if (!(nodeData[nodeName].disk === null)) {
          diskPercent = 100 * (1.0 - nodeData[nodeName].disk.free / nodeData[nodeName].disk.total);
        }
        let swapPercent = 0.0;
        if (!(nodeData[nodeName].swap === null)) {
          swapPercent = 100 * (1.0 - nodeData[nodeName].swap.free / nodeData[nodeName].swap.total);
        }
        let gpuPercent = 0.0;
        if (!(nodeData[nodeName].gpus === null)) {
          let nGpus = 0;
          if (Object.prototype.hasOwnProperty.call(job.gpuLayout, nodeName)) {
            for (let j = 0; j < job.gpuLayout[nodeName].length; j += 1) {
              const gpuIndex = job.gpuLayout[nodeName][j];
              nGpus += 1;
              gpuPercent += nodeData[nodeName].gpus['gpu'.concat(gpuIndex.toString())];
            }
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
            gangliaURL={gangliaURL}
            onRowClick={(node) => onRowClick(node)}
            nodeWarn={warnings[nodeName]}
            isGpuJob={job.nGpus > 0}
          />,
        );
      }
    }
    return nodePies;
  }

  getWarnedJobs() {
    const {
      warnings,
    } = this.props;

    const warnedJobs = [];

    // For each node in warnings
    const warnedNodes = Object.keys(warnings);
    for (let i = 0; i < warnedNodes.length; i += 1) {
      const nodeName = warnedNodes[i];
      const nodeWarnings = warnings[nodeName];

      if (Object.prototype.hasOwnProperty.call(warnings, 'jobs')) {
        // For each job on each node
        const warnedJobIds = Object.keys(warnings.jobs);
        let jobWarned = false;
        for (let j = 0; j < warnedJobs.length; j += 1) {
          const jobId = warnedJobIds[j];
          if (!(warnedJobs.includes(jobId))) {
            // Job type warnings
            const jobTypeWarnIds = Object.keys(warnings.jobs[jobId]);
            for (let k = 0; k < jobTypeWarnIds.length; k += 1) {
              const warning = jobTypeWarnIds[k];
              if (nodeWarnings.jobs[jobId][warning]) {
                warnedJobs.push(jobId);
                jobWarned = true;
                break;
              }
            }

            // Check for node type warnings if there are no job type warnings
            if (!(jobWarned)) {
              // Node type warnings
              const nodeTypeWarnIds = Object.keys(warnings.node);
              for (let k = 0; k < nodeTypeWarnIds.length; k += 1) {
                const warning = nodeTypeWarnIds[k];
                if (nodeWarnings.node[warning]) {
                  warnedJobs.push(jobId);
                  jobWarned = true;
                  break;
                }
              }
            }
          }
        }
      }
    }
    return warnedJobs;
  }

  getUserJobList() {
    const {
      jobs,
      username,
      onJobClick,
      jobId,
    } = this.props;

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
    const jobIds = Object.keys(jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jid = jobIds[i];
      const job = jobs[jid];
      if (job.username === username) {
        userJobs[jid] = job;
        if (job.state === 'RUNNING') nRunningJobs += 1;
      }
    }

    const userJobIds = Object.keys(userJobs);
    for (let i = 0; i < userJobIds.length; i += 1) {
      const jid = userJobIds[i];
      const job = userJobs[jid];
      if (job.state === 'RUNNING') {
        const jobText = (
          <div key={jid}>
            <button
              className="running-job-row"
              onClick={() => onJobClick(jid)}
              type="button"
            >
              <div className="running-job-text">
                <JobText
                  id={jid}
                  job={job}
                  warn={warnedJobs.includes(jid)}
                />
              </div>
              {((nRunningJobs <= 10) || (jid === jobId))
              && (
                <div className="running-job-chart">
                  {this.getRunningJobChart(job, jid)}
                </div>
              )}
            </button>
            {(jid === jobId)
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
          <div key={jid} className="other-job-row">
            <JobText
              id={jid}
              job={job}
              warn={warnedJobs.includes(jid)}
              onClick={() => onJobClick(jid)}
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
    const {
      historyData,
      getJobUsage,
    } = this.props;
    const style = getComputedStyle(document.documentElement);
    const historyChart = [];

    const sortedHistory = historyData;
    sortedHistory.sort(
      (a, b) => {
        if (a.timestamp < b.timestamp) {
          return -1;
        } if (a.timestamp > b.timestamp) {
          return 1;
        }
        return 0;
      },
    );

    const chartRes = 20;
    let nSkip = 1;
    if (chartRes < sortedHistory.length) {
      nSkip = Math.floor(sortedHistory.length / chartRes);
    }

    const memRequested = job.memReq * 1024 ** 2 * Object.keys(job.layout).length;

    for (let i = 0; i < sortedHistory.length; i += 1) {
      if (i % nSkip === 0) {
        const data = sortedHistory[i];
        const { nodes } = data;

        // Job CPU usage for all nodes of job
        const usage = getJobUsage(jobId, job, nodes);

        const d = new Date(data.timestamp * 1000);

        historyChart.push({
          timeString: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
          user: usage.cpu.user,
          system: usage.cpu.system,
          wait: usage.cpu.wait,
          used: usage.mem.used * 1024 ** 2, // mb
          max: usage.mem.max * 1024 ** 2, // mb
          request: memRequested, // used = memory used, request = memory requested
          gpu: usage.gpu.total,
        });
      }
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
    const {
      username,
      warnedUsers,
    } = this.props;

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

    if (username === null) {
      return (
        <div className="main-item center">
          <div className="instruction">
            Select a user on the left to view jobs
          </div>
          <br />
          {(Object.keys(warnedUsers).length > 0)
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
          {username}
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

NodeOverview.propTypes = {
  nodeHasJob: PropTypes.objectOf(PropTypes.object).isRequired,
  jobId: PropTypes.string,
  jobs: PropTypes.objectOf(PropTypes.object).isRequired,
  nodeData: PropTypes.objectOf(PropTypes.object).isRequired,
  gangliaURL: PropTypes.string,
  onRowClick: PropTypes.func.isRequired,
  onJobClick: PropTypes.func.isRequired,
  getJobUsage: PropTypes.func.isRequired,
  warnings: PropTypes.objectOf(PropTypes.object).isRequired,
  getNodeUsage: PropTypes.func.isRequired,
  username: PropTypes.string,
  historyData: PropTypes.arrayOf(PropTypes.object).isRequired,
  warnedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
};

NodeOverview.defaultProps = {
  jobId: null,
  gangliaURL: null,
  username: null,
};
