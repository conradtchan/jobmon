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

    charts.push(
      <PropChart
        key="jobfs"
        name="JOBFS usage"
        data={historyChart}
        dataKeys={["jobfs_used", "jobfs_requested"]}
        colors={[
          style.getPropertyValue("--piecycle-4"),
          style.getPropertyValue("--piecycle-4"),
        ]}
        lineStyle={[
          "fill",
          "dashed",
        ]}
        unit="B"
        stacked
      />,
    );

    // Display a per-job GPU total if there are GPUs in this job
    if (historyChart.length > 0 && historyChart[0].job_gpu >= 0) {
      charts.push(
        <PropChart
          key="job_gpu"
          name="GPU Utilization"
          data={historyChart}
          dataKeys={["job_gpu"]}
          colors={[
            style.getPropertyValue("--piecolor-gpu-1"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="%"
          dataMax={100}
          stacked
        />,
      );

      // Display a per-job GPU memory usage if available
      if (historyChart.length > 0 && historyChart[0].job_gpu_mem_total > 0) {
        charts.push(
          <PropChart
            key="job_gpu_mem"
            name="GPU Memory"
            data={historyChart}
            dataKeys={["job_gpu_mem"]}
            colors={[
              style.getPropertyValue("--piecolor-gpu-2"),
            ]}
            lineStyle={[
              "fill",
            ]}
            unit="B"
            dataMax={(historyChart[0].job_gpu_mem_total > 0)
              ? historyChart[0].job_gpu_mem_total
              : "dataMax"}
            stacked={false}
          />,
        );
      }
    }

    return (
      <div className="prop-charts">
        {charts}
      </div>
    );
  }

  static initializeJobMetrics() {
    return {
      jobMem: 0.0,
      jobMemMax: 0.0,
      jobMemRequested: 0.0,
      jobUser: 0.0,
      jobSystem: 0.0,
      jobWait: 0.0,
      jobGpu: -1.0,
      jobGpuMem: 0.0,
      jobGpuMemTotal: 0.0,
      jobfs: 0.0,
      jobfsRequested: 0.0,
      fredOssRead: 0.0,
      fredOssWrite: 0.0,
      fredMdsIops: 0.0,
      homeOssRead: 0.0,
      homeOssWrite: 0.0,
      homeMdsIops: 0.0,
      appsOssRead: 0.0,
      appsMdsIops: 0.0,
      imagesOssRead: 0.0,
      imagesMdsIops: 0.0,
    };
  }

  static extractJobUsageMetrics(job, usage, name) {
    const metrics = {
      jobUser: usage.cpu.user,
      jobSystem: usage.cpu.system,
      jobWait: usage.cpu.wait,
      jobfs: usage.jobfs.used,
      jobfsRequested: job.jobfsReq,
      jobMem: 0.0,
      jobMemMax: 0.0,
      jobMemRequested: 0.0,
      jobGpu: -1.0,
      jobGpuMem: 0.0,
      jobGpuMemTotal: 0.0,
    };

    // Memory usage
    if (Object.prototype.hasOwnProperty.call(job.mem, name)) {
      metrics.jobMem = usage.mem.used;
      metrics.jobMemMax = usage.mem.max;
      metrics.jobMemRequested = job.memReq;
    }

    // GPU usage
    if (job.nGpus > 0) {
      metrics.jobGpu = usage.gpu.total;
      if (usage.gpu.memory && usage.gpu.memory.total > 0) {
        metrics.jobGpuMem = usage.gpu.memory.used;
        metrics.jobGpuMemTotal = usage.gpu.memory.total;
      }
    }

    return metrics;
  }

  static extractLustreMetrics(jobLustre) {
    const metrics = {
      fredOssRead: 0.0,
      fredOssWrite: 0.0,
      fredMdsIops: 0.0,
      homeOssRead: 0.0,
      homeOssWrite: 0.0,
      homeMdsIops: 0.0,
      appsOssRead: 0.0,
      appsMdsIops: 0.0,
      imagesOssRead: 0.0,
      imagesMdsIops: 0.0,
    };

    if (Object.prototype.hasOwnProperty.call(jobLustre, "dagg")) {
      metrics.fredOssRead = jobLustre.dagg.oss.read_bytes;
      metrics.fredOssWrite = jobLustre.dagg.oss.write_bytes;
      metrics.fredMdsIops = jobLustre.dagg.mds.iops;
    }
    if (Object.prototype.hasOwnProperty.call(jobLustre, "apps")) {
      metrics.appsOssRead = jobLustre.apps.oss.read_bytes;
      metrics.appsMdsIops = jobLustre.apps.mds.iops;
    }
    if (Object.prototype.hasOwnProperty.call(jobLustre, "images")) {
      metrics.imagesOssRead = jobLustre.images.oss.read_bytes;
      metrics.imagesMdsIops = jobLustre.images.mds.iops;
    }
    if (Object.prototype.hasOwnProperty.call(jobLustre, "home")) {
      metrics.homeOssRead = jobLustre.home.oss.read_bytes;
      metrics.homeOssWrite = jobLustre.home.oss.write_bytes;
      metrics.homeMdsIops = jobLustre.home.mds.iops;
    }

    return metrics;
  }

  static createChartDataPoint(data, nodeData, jobMetrics) {
    const d = new Date(data.timestamp * 1000);

    return {
      time: data.timestamp,
      timeString: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
      user: nodeData.cpu.total[config.cpuKeys.user] + nodeData.cpu.total[config.cpuKeys.nice],
      system: nodeData.cpu.total[config.cpuKeys.system],
      wait: nodeData.cpu.total[config.cpuKeys.wait],
      mem: nodeData.mem.used * constants.mb,
      job_user: jobMetrics.jobUser,
      job_system: jobMetrics.jobSystem,
      job_wait: jobMetrics.jobWait,
      job_mem: jobMetrics.jobMem * constants.mb,
      job_mem_max: jobMetrics.jobMemMax * constants.mb,
      job_mem_requested: jobMetrics.jobMemRequested * constants.mb,
      job_gpu: jobMetrics.jobGpu,
      job_gpu_mem: jobMetrics.jobGpuMem * constants.mb,
      job_gpu_mem_total: jobMetrics.jobGpuMemTotal * constants.mb,
      swap: (nodeData.swap.total - nodeData.swap.free) * constants.mb,
      fred_read: jobMetrics.fredOssRead,
      fred_write: jobMetrics.fredOssWrite,
      fred_iops: jobMetrics.fredMdsIops,
      home_read: jobMetrics.homeOssRead,
      home_write: jobMetrics.homeOssWrite,
      home_iops: jobMetrics.homeMdsIops,
      apps_read: jobMetrics.appsOssRead,
      apps_iops: jobMetrics.appsMdsIops,
      images_read: jobMetrics.imagesOssRead,
      images_iops: jobMetrics.imagesMdsIops,
      jobfs_used: jobMetrics.jobfs * constants.mb,
      jobfs_requested: jobMetrics.jobfsRequested * constants.mb,
    };
  }

  static addOptionalDataToPoint(dataPoint, nodeData) {
    const point = { ...dataPoint };

    if (nodeData.infiniband !== null) {
      point.infiniband_in = nodeData.infiniband.bytes_in;
      point.infiniband_out = nodeData.infiniband.bytes_out;
      point.infiniband_pkts_in = nodeData.infiniband.pkts_in;
      point.infiniband_pkts_out = nodeData.infiniband.pkts_out;
    }

    if (nodeData.lustre !== null) {
      point.lustre_read = nodeData.lustre.read;
      point.lustre_write = nodeData.lustre.write;
    }

    if (nodeData.jobfs !== null) {
      point.jobfs_read = nodeData.jobfs.read;
      point.jobfs_write = nodeData.jobfs.write;
    }

    // Add GPU data
    Array.from({ length: nodeData.nGpus }, (_, gpuIndex) => {
      const gpuName = `gpu${gpuIndex.toString()}`;
      const gpuMemName = `${gpuName}_mem`;

      if (nodeData.gpus && gpuName in nodeData.gpus) {
        point[gpuName] = nodeData.gpus[gpuName].util;

        if (nodeData.gpus[gpuName].memory) {
          const memTotal = nodeData.gpus[gpuName].memory.total;
          const memUsed = nodeData.gpus[gpuName].memory.used;
          if (memTotal > 0) {
            point[gpuMemName] = memUsed * constants.mb;
            point[`${gpuMemName}_total`] = memTotal * constants.mb;
          }
        }
      }
      return null;
    });

    return point;
  }

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
        if (jobWarns.gpuUtil) {
          warningText.push("Job underutilizes requested GPUs");
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
    const { name, selectedJobId, historyData } = this.props;

    // Sort history data by timestamp
    const sortedHistory = [...historyData].sort((a, b) => a.timestamp - b.timestamp);

    const historyChart = [];

    sortedHistory.forEach((data) => {
      const nodeData = data.nodes[name];

      // Initialize default metrics
      let jobMetrics = NodeDetails.initializeJobMetrics();

      // Extract job metrics if job is running
      if (Object.prototype.hasOwnProperty.call(data.jobs, selectedJobId)) {
        const job = data.jobs[selectedJobId];

        // Skip this data point if the job is not in RUNNING state
        if (job.state !== "RUNNING") {
          // eslint-disable-next-line no-continue
          continue;
        }

        const usage = getNodeUsage(selectedJobId, job, nodeData, name);

        // Skip this data point if the job is not in RUNNING state
        if (job.state !== "RUNNING") {
          return; // Use return instead of continue for forEach
        }

        const usage = getNodeUsage(selectedJobId, job, nodeData, name);

        // Extract basic job usage metrics
        const basicMetrics = NodeDetails.extractJobUsageMetrics(job, usage, name);

        // Extract Lustre metrics if available
        let lustreMetrics = {};
        if (Object.keys(job.lustre).length > 0) {
          lustreMetrics = NodeDetails.extractLustreMetrics(job.lustre);
        }

        // Combine all metrics
        jobMetrics = {
          ...basicMetrics,
          ...lustreMetrics,
        };
      }

      // Create data point
      const dataPoint = NodeDetails.createChartDataPoint(data, nodeData, jobMetrics);

      // Add optional node data
      const finalDataPoint = NodeDetails.addOptionalDataToPoint(dataPoint, nodeData);

      historyChart.push(finalDataPoint);
    });

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

  getGpuMemoryNames() {
    const { node } = this.props;
    const gpuMemNames = [];
    for (let i = 0; i < node.nGpus; i += 1) {
      const gpuMemName = `gpu${i.toString()}_mem`;
      gpuMemNames.push(gpuMemName);
    }
    return gpuMemNames;
  }

  getGpuMemoryTotalNames() {
    const { node } = this.props;
    const gpuMemTotalNames = [];
    for (let i = 0; i < node.nGpus; i += 1) {
      const gpuMemTotalName = `gpu${i.toString()}_mem_total`;
      gpuMemTotalNames.push(gpuMemTotalName);
    }
    return gpuMemTotalNames;
  }

  getPropCharts(historyChart, gpuNames) {
    const { node } = this.props;
    const style = getComputedStyle(document.documentElement);
    const gpuMemNames = this.getGpuMemoryNames();
    const gpuMemTotalNames = this.getGpuMemoryTotalNames();

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
          name="GPU Utilization"
          data={historyChart}
          dataKeys={gpuNames}
          colors={[
            style.getPropertyValue("--piecolor-gpu-1"),
            style.getPropertyValue("--piecolor-gpu-2"),
            style.getPropertyValue("--piecolor-gpu-3"),
            style.getPropertyValue("--piecolor-gpu-4"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="%"
          dataMax={100}
          stacked={false}
        />
        <PropChart
          name="GPU Memory"
          data={historyChart}
          dataKeys={gpuMemNames}
          colors={[
            style.getPropertyValue("--piecolor-gpu-1"),
            style.getPropertyValue("--piecolor-gpu-2"),
            style.getPropertyValue("--piecolor-gpu-3"),
            style.getPropertyValue("--piecolor-gpu-4"),
          ]}
          lineStyle={[
            "fill",
          ]}
          unit="B"
          dataMax={
            historyChart.length > 0 && historyChart[0][gpuMemTotalNames[0]]
              ? Math.max(...gpuMemTotalNames.map((name) => (
                Math.max(...historyChart.map((point) => point[name] || 0))
              )))
              : "dataMax"
          }
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
          <label htmlFor="8h" className="radio-label">
            <input
              type="radio"
              id="8h"
              name="timeWindow"
              value="8h"
              onChange={() => changeTimeWindow(28800)}
              checked={timeWindow === 28800}
            />
            8 hours
          </label>
          <label htmlFor="2h" className="radio-label">
            <input
              type="radio"
              id="2h"
              name="timeWindow"
              value="2h"
              onChange={() => changeTimeWindow(7200)}
              checked={timeWindow === 7200}
            />
            2 hours
          </label>
          <label htmlFor="30m" className="radio-label">
            <input
              type="radio"
              id="30m"
              name="timeWindow"
              value="30m"
              onChange={() => changeTimeWindow(1800)}
              checked={timeWindow === 1800}
            />
            30 minutes
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
