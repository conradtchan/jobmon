import React from "react";
import JobText from "./JobText";
import PropChartMini from "./PropChartMini";
import NodePie from "./NodePie";
import { getWarnedJobs } from "./warnings";
import { getJobUsage, getNodeUsage } from "./usage";
import constants from "./constants";

export default class NodeOverview extends React.Component {
  static whyDidYouRender = true

  static addJobToList(jobList, job, jobText, allNodesUp) {
    if (job.state === "RUNNING" && allNodesUp) {
      jobList.running.push(jobText);
    } else if (job.state === "PENDING") {
      jobList.pending.push(jobText);
    } else if (job.state === "COMPLETED") {
      jobList.completed.push(jobText);
    } else if (job.state === "CANCELLED") {
      jobList.cancelled.push(jobText);
    } else if (job.state === "FAILED") {
      jobList.failed.push(jobText);
    }
  }

  static checkAllNodesUp(job, nodes) {
    return Object.keys(job.layout).every((node) => nodes[node] && nodes[node].up === true);
  }

  static countRunningJobs(userJobs) {
    return Object.values(userJobs).filter((job) => job.state === "RUNNING").length;
  }

  static filterUserJobs(jobs, username) {
    return Object.keys(jobs).reduce((acc, jid) => {
      const job = jobs[jid];
      if (job.username === username) {
        return { ...acc, [jid]: job };
      }
      return acc;
    }, {});
  }

  shouldComponentUpdate(nextProps) {
    const {
      timestamp,
      username,
      jobId,
    } = this.props;

    if (nextProps.timestamp !== timestamp) {
      return true;
    } if (nextProps.username !== username) {
      return true;
    } if (nextProps.jobId !== jobId) {
      return true;
    }

    return false;
  }

  getNodePies() {
    const {
      nodeHasJob,
      jobId,
      apiData,
      onRowClick,
      warnings,
    } = this.props;

    const { jobs, nodes } = apiData;

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
        index += parseInt(numbers.join(""), 10);
      }
      nameSorted.push({
        name,
        sortIndex: name.replace(/\d/g, "") + index.toString().padStart(maxNumLen, "0"),
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
          nodes[nodeName],
          nodeName,
        ).cpu;

        // TODO: currently hardcoded to 2,
        // but can make this general from the API
        const nGpuMax = 2;

        // CPU percent is out of the requested memory
        let memPercent = 0.0;
        if (!(nodes[nodeName].mem === null)) {
          memPercent = 100 * (job.mem[nodeName] / job.memReq);
        }
        let swapPercent = 0.0;
        if (!(nodes[nodeName].swap === null)) {
          swapPercent = 100 * (1.0 - nodes[nodeName].swap.free / nodes[nodeName].swap.total);
        }
        let gpuPercent = 0.0;
        if (!(nodes[nodeName].gpus === null)) {
          let nGpus = 0;

          if (Object.prototype.hasOwnProperty.call(job.gpuLayout, nodeName)) {
            for (let j = 0; j < job.gpuLayout[nodeName].length; j += 1) {
              const gpuIndex = job.gpuLayout[nodeName][j];
              nGpus += 1;
              gpuPercent += nodes[nodeName].gpus["gpu".concat(gpuIndex.toString())];
            }
          } else if (job.nGpus === nGpuMax) {
            for (let j = 0; j < nGpuMax; j += 1) {
              nGpus += 1;
              gpuPercent += nodes[nodeName].gpus["gpu".concat(j.toString())];
            }
          }
          gpuPercent /= nGpus;
        }

        let nodeWarn = {};
        if (Object.keys(warnings).includes(nodeName)) {
          nodeWarn = warnings[nodeName];
        }

        nodePies.push(
          <NodePie
            key={nodeName}
            nodeName={nodeName}
            cpuUsage={cpuUsage}
            mem={memPercent}
            gpu={gpuPercent}
            swap={swapPercent}
            onRowClick={(node) => onRowClick(node)}
            nodeWarn={nodeWarn}
            isGpuJob={job.nGpus > 0}
          />,
        );
      }
    }
    return nodePies;
  }

  getUserJobList() {
    const {
      apiData: { jobs, nodes },
      username,
      onJobClick,
      jobId,
      warnings,
    } = this.props;

    const warnedJobs = getWarnedJobs(warnings);

    const jobList = {
      running: [],
      pending: [],
      completed: [],
      cancelled: [],
      failed: [],
    };

    const userJobs = NodeOverview.filterUserJobs(jobs, username);
    const nRunningJobs = NodeOverview.countRunningJobs(userJobs);

    Object.keys(userJobs).forEach((jid) => {
      const job = userJobs[jid];
      const allNodesUp = NodeOverview.checkAllNodesUp(job, nodes);

      const jobText = this.generateJobText(
        jid,
        job,
        allNodesUp,
        nRunningJobs,
        jobId,
        warnedJobs,
        onJobClick,
      );

      NodeOverview.addJobToList(jobList, job, jobText, allNodesUp);
    });

    return jobList;
  }

  getRunningJobChart(job, jobId) {
    const { historyData } = this.props;
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

    const memRequested = job.memReq * constants.mb * Object.keys(job.layout).length;

    for (let i = 0; i < sortedHistory.length; i += 1) {
      if (i % nSkip === 0) {
        const data = sortedHistory[i];
        const { nodes } = data;

        // Job CPU usage for all nodes of job
        const usage = getJobUsage(jobId, job, nodes);

        const d = new Date(data.timestamp * 1000);

        historyChart.push({
          timeString: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
          user: usage.cpu.user,
          system: usage.cpu.system,
          wait: usage.cpu.wait,
          used: usage.mem.used * constants.mb,
          max: usage.mem.max * constants.mb,
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
          dataKeys={["user", "system", "wait"]}
          colors={[
            style.getPropertyValue("--piecolor-user"),
            style.getPropertyValue("--piecolor-system"),
            style.getPropertyValue("--piecolor-wait"),
          ]}
          lineStyle={[
            "fill",
            "fill",
            "fill",
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
          dataKeys={["used", "request"]}
          colors={[
            style.getPropertyValue("--piecolor-mem"),
            // style.getPropertyValue('--piecolor-mem'),
            style.getPropertyValue("--piecolor-mem"),
          ]}
          lineStyle={[
            "fill",
            // 'line',
            "dashed",
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
          dataKeys={["gpu"]}
          colors={[
            style.getPropertyValue("--piecolor-gpu-1"),
          ]}
          lineStyle={[
            "fill",
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

  generateJobText(jid, job, allNodesUp, nRunningJobs, jobId, warnedJobs, onJobClick) {
    if (job.state === "RUNNING" && allNodesUp) {
      return (
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
            {((nRunningJobs <= 10) || (jid === jobId)) && (
              <div className="running-job-chart">
                {this.getRunningJobChart(job, jid)}
              </div>
            )}
          </button>
          {(jid === jobId) && (
            <div>
              <div className="overview-pies">
                {this.getNodePies()}
              </div>
            </div>
          )}
        </div>
      );
    }

    return (
      <div key={jid} className="other-job-row">
        <JobText
          id={jid}
          job={job}
          warn={warnedJobs.includes(jid)}
          onClick={() => onJobClick(jid)}
        />
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
