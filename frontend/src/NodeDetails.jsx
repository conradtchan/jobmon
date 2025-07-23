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
      // Skip if core data is missing
      if (!core) {
        // eslint-disable-next-line no-continue
        continue;
      }

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

      let jobGpu = -1.0; // -1 means no GPU
      let jobGpuMem = 0.0; // GPU memory used by job
      let jobGpuMemTotal = 0.0; // Total GPU memory available

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

      let jobfs = 0.0;
      let jobfsRequested = 0.0;

      // Only if the job has started running
      if (Object.prototype.hasOwnProperty.call(data.jobs, selectedJobId)) {
        const job = data.jobs[selectedJobId];

        // Skip this data point if the job is not in RUNNING state
        if (job.state !== "RUNNING") {
          // eslint-disable-next-line no-continue
          continue;
        }

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

        // JOBFS usage
        jobfs = usage.jobfs.used;
        jobfsRequested = job.jobfsReq;

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

        // GPU usage
        if (job.nGpus > 0) {
          jobGpu = usage.gpu.total;

          // GPU memory usage
          if (usage.gpu.memory && usage.gpu.memory.total > 0) {
            jobGpuMem = usage.gpu.memory.used;
            jobGpuMemTotal = usage.gpu.memory.total;
          }
        }
      }

      const d = new Date(data.timestamp * 1000);
      const x = {
        time: data.timestamp,
        timeString: `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`,
        user: (nodeData.cpu.total && nodeData.cpu.total[config.cpuKeys.user] !== undefined)
          ? nodeData.cpu.total[config.cpuKeys.user] + nodeData.cpu.total[config.cpuKeys.nice]
          : 0,
        system: (nodeData.cpu.total && nodeData.cpu.total[config.cpuKeys.system] !== undefined)
          ? nodeData.cpu.total[config.cpuKeys.system]
          : 0,
        wait: (nodeData.cpu.total && nodeData.cpu.total[config.cpuKeys.wait] !== undefined)
          ? nodeData.cpu.total[config.cpuKeys.wait]
          : 0,
        mem: nodeData.mem.used * constants.mb,
        job_user: jobUser,
        job_system: jobSystem,
        job_wait: jobWait,
        job_mem: jobMem * constants.mb,
        job_mem_max: jobMemMax * constants.mb,
        job_mem_requested: jobMemRequested * constants.mb,
        job_gpu: jobGpu,
        job_gpu_mem: jobGpuMem * constants.mb,
        job_gpu_mem_total: jobGpuMemTotal * constants.mb,
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
        jobfs_used: jobfs * constants.mb,
        jobfs_requested: jobfsRequested * constants.mb,
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
        const gpuMemName = `${gpuName}_mem`;

        if (nodeData.gpus && gpuName in nodeData.gpus) {
          // Use GPU utilization from the data
          x[gpuName] = nodeData.gpus[gpuName].util;

          // Add GPU memory information
          if (nodeData.gpus[gpuName].memory) {
            const memTotal = nodeData.gpus[gpuName].memory.total;
            const memUsed = nodeData.gpus[gpuName].memory.used;
            // Convert MiB to bytes and store memory usage
            if (memTotal > 0) {
              // Convert from MiB to bytes
              x[gpuMemName] = memUsed * constants.mb;
              x[`${gpuMemName}_total`] = memTotal * constants.mb; // Store total for y-axis limit
            }
          }
        }
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

    const charts = [];

    charts.push(
      <PropChart
        key="cpu-total"
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
      />,
    );

    charts.push(
      <PropChart
        key="memory"
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
      />,
    );

    charts.push(
      <PropChart
        key="swap"
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
      />,
    );

    if (gpuNames.length > 0) {
      charts.push(
        <PropChart
          key="gpu-utilization"
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
        />,
      );
    }

    if (gpuMemNames.length > 0) {
      charts.push(
        <PropChart
          key="gpu-memory"
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
        />,
      );
    }

    charts.push(
      <PropChart
        key="infiniband-traffic"
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
      />,
    );

    charts.push(
      <PropChart
        key="infiniband-packets"
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
      />,
    );

    charts.push(
      <PropChart
        key="lustre-access"
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
      />,
    );

    charts.push(
      <PropChart
        key="jobfs-access"
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
      />,
    );

    return (
      <div className="prop-charts">
        {charts}
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
        <div className="job-info-header">
          <button id="id-button" onClick={() => idCopy(selectedJobId)} type="button">
            {selectedJobId}
          </button>
          <div className="job-info-details">
            <div className="node-name">{name}</div>
            <div className="job-name">
              {(selectedJobId !== null) && jobs[selectedJobId].name}
            </div>
          </div>
          <div className="time-selector-compact">
            <select
              value={timeWindow}
              onChange={(e) => changeTimeWindow(Number(e.target.value))}
              className="time-select"
            >
              <option value={28800}>8h</option>
              <option value={7200}>2h</option>
              <option value={1800}>30m</option>
            </select>
          </div>
          <div className="copyhint">
            Click on job ID to copy to clipboard
          </div>
        </div>
        {warningList}

        <div className="resource-section job-usage-section">
          <div className="heading">
            Job resource usage
          </div>
          {NodeDetails.getJobPropCharts(historyChart)}
        </div>

        <div className="resource-section cpu-cores-section">
          <div className="heading">
            CPU cores
          </div>
          <div className="core-grid">
            {corePies}
          </div>
        </div>

        <div className="resource-section node-usage-section">
          <div className="heading">
            Node resource usage
          </div>
          {this.getPropCharts(historyChart, gpuNames)}
        </div>

        {(otherJobList.length > 0)
        && (
          <div className="resource-section cohabitant-jobs-section">
            <div className="heading">
              Cohabitant jobs
            </div>
            <div className="cohabitant-jobs-container">
              {otherJobList}
            </div>
          </div>
        )}
      </div>
    );
  }
}
