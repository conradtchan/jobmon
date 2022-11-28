import React from "react";
import JobText from "./JobText";
import PropChart from "./PropChart";
import CorePie from "./CorePie";
import config from "./config";
import constants from "./constants";
import arraysEqual from "./utils";
import { getNodeUsage } from "./usage";

function getTimestampList(historyData) {
  return historyData.map((a) => a.timestamp);
}

function idCopy(id) {
  navigator.clipboard.writeText(id);
}

export default class NodeDetails extends React.Component {
  static whyDidYouRender = true

  shouldComponentUpdate(nextProps) {
    const {
      name,
      username,
      selectedJobId,
      timestamp,
      timeWindow,
      historyData,
      theme,
    } = this.props;

    if (nextProps.name !== name) {
      return true;
    } if (nextProps.username !== username) {
      return true;
    } if (nextProps.selectedJobId !== selectedJobId) {
      return true;
    } if (nextProps.timestamp !== timestamp) {
      return true;
    } if (nextProps.timeWindow !== timeWindow) {
      return true;
    } if (!arraysEqual(
      getTimestampList(nextProps.historyData),
      getTimestampList(historyData),
    )) {
      return true;
    } if (nextProps.theme !== theme) {
      return true;
    }

    return false;
  }

  getCorePies() {
    const {
      selectedJobId,
      name,
      node,
      jobs,
    } = this.props;
    // Cores belonging to selected job
    let jobCores = [];
    if (!(selectedJobId === null)) {
      const jobLayout = jobs[selectedJobId].layout;
      if (Object.prototype.hasOwnProperty.call(jobLayout, name)) {
        jobCores = jobLayout[name];
      }
    }

    // // Calculate number of rows
    const rows = Math.ceil(node.cpu.core.length / config.maxPiesPerRow);
    // // Set the core pie div width to make the rows even
    // // E.g. 2 rows of 18 instead of 20 and 16
    const pieWidth = `${(rows * 100) / node.cpu.core.length}%`;

    const corePies = [];
    for (let i = 0; i < node.cpu.core.length; i += 1) {
      const core = node.cpu.core[i];
      let coreSelected = false;
      if (!(jobCores === null)) {
        coreSelected = jobCores.includes(i);
      }

      corePies.push(
        <CorePie
          key={i}
          type="cpu"
          data={[
            { name: "user", data: core[config.cpuKeys.user] + core[config.cpuKeys.nice] },
            { name: "wait", data: core[config.cpuKeys.wait] },
            { name: "system", data: core[config.cpuKeys.system] },
            { name: "idle", data: core[config.cpuKeys.idle] },
          ]}
          selected={coreSelected}
          percentWidth={pieWidth}
        />,
      );
    }
    return corePies;
  }

  getWarnings() {
    const {
      name,
      selectedJobId,
      warnings,
    } = this.props;
    const warningText = [];

    if (Object.prototype.hasOwnProperty.call(warnings, name)) {
      if (warnings[name].node.swapUse) {
        warningText.push("Node is using disk swap");
      }

      if (Object.prototype.hasOwnProperty.call(warnings[name].jobs, selectedJobId)) {
        const jobWarns = warnings[name].jobs[selectedJobId];
        if (jobWarns.cpuUtil) {
          warningText.push("Job underutilizes requested CPUs");
        }
        if (jobWarns.cpuSys) {
          warningText.push("Job spends significant time in sys calls");
        }
        if (jobWarns.cpuWait) {
          warningText.push("Job spends significant time waiting");
        }
        if (jobWarns.memUtil) {
          warningText.push("Job underutilizes requested memory");
        }
      }
    }

    const warningList = [];
    if (warningText.length > 0) {
      for (let i = 0; i < warningText.length; i += 1) {
        const w = warningText[i];
        warningList.push(
          <div key={w} className="bad-job">
            Warning:
            {" "}
            {w}
          </div>,
        );
      }
    }
    return warningList;
  }

  getOtherJobList() {
    const {
      jobs,
      name,
      selectedJobId,
      warnings,
      onJobClick,
    } = this.props;
    const otherJobList = [];
    const jobIds = Object.keys(jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      if (Object.prototype.hasOwnProperty.call(jobs[jobId].layout, name)) {
        if (!(jobId === selectedJobId)) {
          let warnJob = false;
          if (Object.keys(warnings).length > 0) {
            warnJob = Object.prototype.hasOwnProperty.call(warnings[name].jobs, jobId);
          }
          otherJobList.push(
            <button type="button" key={jobId} className="cohab-job" onClick={() => onJobClick(jobId)}>
              <JobText
                key={jobId}
                id={jobId}
                job={jobs[jobId]}
                warn={warnJob}
              />
            </button>,
          );
        }
      }
    }
    return otherJobList;
  }

  getHistoryChart() {
    const {
      name,
      selectedJobId,
      historyData,
    } = this.props;
    const historyChart = [];

    const sortedHistory = historyData;
    sortedHistory.sort(
      (a, b) => {
        if (a.timestamp < b.timestamp) {
          return -1;
        }
        if (a.timestamp > b.timestamp) {
          return 1;
        } return 0;
      },
    );

    for (let i = 0; i < sortedHistory.length; i += 1) {
      const data = sortedHistory[i];
      const nodeData = data.nodes[name];

      let jobMem = 0.0;
      let jobMemMax = 0.0;
      let jobMemRequested = 0.0;

      let jobUser = 0.0;
      let jobSystem = 0.0;
      let jobWait = 0.0;

      let fredOssRead = 0.0;
      let fredOssWrite = 0.0;
      let fredMdsIops = 0.0;
      let homeOssRead = 0.0;
      let homeOssWrite = 0.0;
      let homeMdsIops = 0.0;
      let appsOssRead = 0.0;
      let appsMdsIops = 0.0;
      let imagesOssRead = 0.0;
      let imagesMdsIops = 0.0;

      // Only if the job has started running
      if (Object.prototype.hasOwnProperty.call(data.jobs, selectedJobId)) {
        const job = data.jobs[selectedJobId];
        const usage = getNodeUsage(selectedJobId, job, nodeData, name);

        // Memory usage
        if (Object.prototype.hasOwnProperty.call(job.mem, name)) {
          jobMem = usage.mem.used;
          jobMemMax = usage.mem.max;
          jobMemRequested = job.memReq;
        }

        // CPU usage
        jobUser = usage.cpu.user;
        jobSystem = usage.cpu.system;
        jobWait = usage.cpu.wait;

        // Lustre job stats
        if (Object.keys(data.jobs[selectedJobId].lustre).length > 0) {
          const jobLustre = data.jobs[selectedJobId].lustre;

          if (Object.prototype.hasOwnProperty.call(jobLustre, "dagg")) {
            fredOssRead = jobLustre.dagg.oss.read_bytes;
            fredOssWrite = jobLustre.dagg.oss.write_bytes;
            fredMdsIops = jobLustre.dagg.mds.iops;
          }
          if (Object.prototype.hasOwnProperty.call(jobLustre, "apps")) {
            appsOssRead = jobLustre.apps.oss.read_bytes;
            appsMdsIops = jobLustre.apps.mds.iops;
          }
          if (Object.prototype.hasOwnProperty.call(jobLustre, "images")) {
            imagesOssRead = jobLustre.images.oss.read_bytes;
            imagesMdsIops = jobLustre.images.mds.iops;
          }
          if (Object.prototype.hasOwnProperty.call(jobLustre, "home")) {
            homeOssRead = jobLustre.home.oss.read_bytes;
            homeOssWrite = jobLustre.home.oss.write_bytes;
            homeMdsIops = jobLustre.home.mds.iops;
          }
        }
      }

      const d = new Date(data.timestamp * 1000);
      const x = {
        time: data.timestamp,
        timeString: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
        user: nodeData.cpu.total[config.cpuKeys.user] + nodeData.cpu.total[config.cpuKeys.nice],
        system: nodeData.cpu.total[config.cpuKeys.system],
        wait: nodeData.cpu.total[config.cpuKeys.wait],
        mem: nodeData.mem.used * constants.mb,
        job_user: jobUser,
        job_system: jobSystem,
        job_wait: jobWait,
        job_mem: jobMem * constants.mb,
        job_mem_max: jobMemMax * constants.mb,
        job_mem_requested: jobMemRequested * constants.mb,
        swap: (nodeData.swap.total - nodeData.swap.free) * constants.mb,
        fred_read: fredOssRead,
        fred_write: fredOssWrite,
        fred_iops: fredMdsIops,
        home_read: homeOssRead,
        home_write: homeOssWrite,
        home_iops: homeMdsIops,
        apps_read: appsOssRead,
        apps_iops: appsMdsIops,
        images_read: imagesOssRead,
        images_iops: imagesMdsIops,
      };

      if (nodeData.infiniband !== null) {
        x.infiniband_in = nodeData.infiniband.bytes_in;
        x.infiniband_out = nodeData.infiniband.bytes_out;
        x.infiniband_pkts_in = nodeData.infiniband.pkts_in;
        x.infiniband_pkts_out = nodeData.infiniband.pkts_out;
      }

      if (nodeData.lustre !== null) {
        x.lustre_read = nodeData.lustre.read;
        x.lustre_write = nodeData.lustre.write;
      }

      if (nodeData.jobfs !== null) {
        x.jobfs_read = nodeData.jobfs.read;
        x.jobfs_write = nodeData.jobfs.write;
      }

      for (let j = 0; j < nodeData.nGpus; j += 1) {
        const gpuName = `gpu${j.toString()}`;
        x[gpuName] = nodeData.gpus[gpuName];
      }

      historyChart.push(x);
    }
    return historyChart;
  }

  getGpuNames() {
    const { node } = this.props;
    const gpuNames = [];
    for (let i = 0; i < node.nGpus; i += 1) {
      const gpuName = `gpu${i.toString()}`;
      gpuNames.push(gpuName);
    }
    return gpuNames;
  }

  getPropCharts(historyChart, gpuNames) {
    const { node } = this.props;
    const style = getComputedStyle(document.documentElement);

    return (
      <div className="prop-charts">
        <PropChart
          name="CPU total"
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
        />
        <PropChart
          name="Memory"
          data={historyChart}
          dataKeys={["mem"]}
          colors={[
            style.getPropertyValue("--piecolor-mem"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="B"
          dataMax={node.mem.total * constants.mb}
          stacked={false}
        />
        <PropChart
          name="Swap"
          data={historyChart}
          dataKeys={["swap"]}
          colors={[
            style.getPropertyValue("--piecolor-wait"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="B"
          dataMax={node.swap.total * constants.mb}
          stacked={false}
        />
        <PropChart
          name="GPU"
          data={historyChart}
          dataKeys={gpuNames}
          colors={[
            style.getPropertyValue("--piecolor-gpu"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="%"
          dataMax={100}
          stacked={false}
        />
        <PropChart
          name="InfiniBand traffic"
          data={historyChart}
          dataKeys={["infiniband_in", "infiniband_out"]}
          colors={[
            style.getPropertyValue("--piecycle-1"),
            style.getPropertyValue("--piecycle-2"),
          ]}
          lineStyle={[
            "fill",
            "fill",
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="InfiniBand packet rate"
          data={historyChart}
          dataKeys={["infiniband_pkts_in", "infiniband_pkts_out"]}
          colors={[
            style.getPropertyValue("--piecycle-3"),
            style.getPropertyValue("--piecycle-4"),
          ]}
          lineStyle={[
            "fill",
            "fill",
          ]}
          unit="/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="Lustre access"
          data={historyChart}
          dataKeys={["lustre_read", "lustre_write"]}
          colors={[
            style.getPropertyValue("--piecycle-1"),
            style.getPropertyValue("--piecycle-2"),
          ]}
          lineStyle={[
            "fill",
            "fill",
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
        <PropChart
          name="JOBFS access"
          data={historyChart}
          dataKeys={["jobfs_read", "jobfs_write"]}
          colors={[
            style.getPropertyValue("--piecycle-1"),
            style.getPropertyValue("--piecycle-2"),
          ]}
          lineStyle={[
            "fill",
            "fill",
          ]}
          unit="B/s"
          dataMax="dataMax"
          stacked={false}
        />
      </div>
    );
  }

  static getJobPropCharts(historyChart) {
    const style = getComputedStyle(document.documentElement);

    const charts = [];

    charts.push(
      <PropChart
        key="cpu"
        name="CPU"
        data={historyChart}
        dataKeys={["job_user", "job_system", "job_wait"]}
        colors={[
          style.getPropertyValue("--piecolor-user"),
          style.getPropertyValue("--piecolor-system"),
          style.getPropertyValue("--piecolor-wait"),
        ]}
        lineStyle={[
          "fill",
          "fill",
        ]}
        unit="%"
        dataMax={100}
        stacked
      />,
    );

    charts.push(
      <PropChart
        key="mem"
        name="Memory"
        data={historyChart}
        dataKeys={["job_mem", "job_mem_max", "job_mem_requested"]}
        colors={[
          style.getPropertyValue("--piecolor-mem"),
          style.getPropertyValue("--piecolor-mem"),
          style.getPropertyValue("--piecolor-mem"),
        ]}
        lineStyle={[
          "fill",
          "line",
          "dashed",
        ]}
        unit="B"
        stacked={false}
      />,
    );

    charts.push(
      <PropChart
        key="job_lustre_read"
        name="Lustre read"
        data={historyChart}
        dataKeys={["fred_read", "home_read", "apps_read", "images_read"]}
        colors={[
          style.getPropertyValue("--piecycle-1"),
          style.getPropertyValue("--piecycle-2"),
          style.getPropertyValue("--piecycle-3"),
          style.getPropertyValue("--piecycle-4"),
        ]}
        lineStyle={[
          "fill",
          "fill",
          "fill",
          "fill",
        ]}
        unit="B/s"
        stacked
      />,
    );

    charts.push(
      <PropChart
        key="job_lustre_write"
        name="Lustre write"
        data={historyChart}
        dataKeys={["fred_write", "home_write"]}
        colors={[
          style.getPropertyValue("--piecycle-1"),
          style.getPropertyValue("--piecycle-2"),
        ]}
        lineStyle={[
          "fill",
          "fill",
        ]}
        unit="B/s"
        stacked
      />,
    );

    charts.push(
      <PropChart
        key="job_lustre_iops"
        name="Lustre IOPS"
        data={historyChart}
        dataKeys={["fred_iops", "home_iops", "apps_iops", "images_iops"]}
        colors={[
          style.getPropertyValue("--piecycle-1"),
          style.getPropertyValue("--piecycle-2"),
          style.getPropertyValue("--piecycle-3"),
          style.getPropertyValue("--piecycle-4"),
        ]}
        lineStyle={[
          "fill",
          "fill",
          "fill",
          "fill",
        ]}
        unit="/s"
        stacked
      />,
    );

    return (
      <div className="prop-charts">
        {charts}
      </div>
    );
  }

  render() {
    const {
      name,
      username,
      node,
      selectedJobId,
      jobs,
      changeTimeWindow,
      timeWindow,
    } = this.props;
    if (username === null) {
      return null;
    } if (node === null) {
      return (
        <div className="main-item right">
          <div className="instruction">
            Select a running job to view nodes
          </div>
          <br />
          {selectedJobId === null ? null
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
          <button id="id-button" onClick={() => idCopy(selectedJobId)} type="button">
            {selectedJobId}
            {" "}
            {(selectedJobId !== null) && "on"}
            {" "}
            {name}
          </button>
          <div className="copyhint">
            Click on job ID to copy to clipboard
          </div>

        </div>
        <div id="nodename-subtitle">
          {(selectedJobId !== null) && jobs[selectedJobId].name}
        </div>
        {warningList}

        <div className="time-selector">
          <label htmlFor="5h">
            <input
              type="radio"
              id="5h"
              name="timeWindow"
              value="5h"
              onChange={() => changeTimeWindow(18000)}
              checked={timeWindow === 18000}
            />
            5 hours
          </label>
          <label htmlFor="1h">
            <input
              type="radio"
              id="1h"
              name="timeWindow"
              value="1h"
              onChange={() => changeTimeWindow(3600)}
              checked={timeWindow === 3600}
            />
            1 hour
          </label>
          <label htmlFor="10m">
            <input
              type="radio"
              id="10m"
              name="timeWindow"
              value="10m"
              onChange={() => changeTimeWindow(600)}
              checked={timeWindow === 600}
            />
            10 minutes
          </label>
        </div>
        <br />
        <div className="heading">
          Job resource usage
        </div>

        {NodeDetails.getJobPropCharts(historyChart)}

        <div className="heading">
          Node resource usage
        </div>
        <div className="label">
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
