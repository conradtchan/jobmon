import React from 'react';
import logo from './logo.png';
import './App.css';

import NodeDetails from './NodeDetails';
import NodeOverview from './NodeOverview';
import UserPiePlot from './UserPiePlot';
import TimeMachine from './TimeMachine';
import Queue from './Queue';
import Backfill from './Backfill';

class App extends React.Component {
  static extractGpuLayout(data) {
    // The GPU mapping always needs to be the current one,
    // because it may not have been properly determined in the past
    const layout = {};
    const jobIds = Object.keys(data.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jid = jobIds[i];
      if (data.jobs[jid].nGpus > 0) {
        layout[jid] = {};
        const gpuHosts = Object.keys(data.jobs[jid].gpuLayout);
        for (let j = 0; j < gpuHosts.length; j += 1) {
          const host = gpuHosts[j];
          layout[jid][host] = data.jobs[jid].gpuLayout[host];
        }
      }
    }
    return layout;
  }

  constructor(props) {
    super(props);
    this.state = {
      address: 'https://supercomputing.swin.edu.au/monitor/api/',
      apiData: null,
      gotData: false,
      username: null,
      nodeName: null,
      job: null,
      snapshotTime: new Date(0),
      lastFetchAttempt: new Date(0),
      holdSnap: false,
      history: null,
      historyData: [],
      historyDataWindow: 600, // seconds
      historyDataCountInitial: 30,
      future: false,
      backfill: null,
      cpuKeys: {
        user: 0, nice: 1, system: 2, wait: 3, idle: 4,
      },
      gpuLayout: null,
    };

    this.fetchHistory();
    this.fetchLatest();
    this.fetchBackfill();
  }

  getTimeMachine() {
    const {
      history,
      snapshotTime,
    } = this.state;
    return (
      <TimeMachine
        history={history}
        clickLoadTime={(time) => this.fetchTime(time)}
        snapshotTime={snapshotTime}
        viewPresent={() => this.viewPresent()}
        viewFuture={() => this.viewFuture()}
        viewPast={() => this.viewPast()}
      />
    );
  }

  getBackfill() {
    const { backfill } = this.state;
    return (
      <Backfill
        backfillData={backfill}
      />
    );
  }

  getQueue() {
    const { apiData } = this.state;
    // Sum usage
    let queueData = {};
    const queueTotal = { size: 0, cpuHours: 0 };

    const jobIds = Object.keys(apiData.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      const job = apiData.jobs[jobId];
      const { username } = job;
      if (job.state === 'PENDING') {
        queueTotal.size += 1;

        // Time limit is given in minutes
        queueTotal.cpuHours += job.timeLimit * (job.nCpus / 60);

        if (!(Object.prototype.hasOwnProperty.call(queueData, username))) {
          queueData[username] = {
            jobs: 0,
            hours: 0,
          };
        }
        queueData[username].hours += job.nCpus * (job.timeLimit / 60);
        queueData[username].jobs += 1;
      }
    }

    const queueDataArray = [];
    const usernames = Object.keys(queueData);
    for (let i = 0; i < usernames.length; i += 1) {
      const username = usernames[i];
      queueDataArray.push({
        username,
        jobs: queueData[username].jobs,
        hours: queueData[username].hours,
      });
    }
    queueData = queueDataArray;

    return (
      <Queue
        queueData={queueData}
        queueTotal={queueTotal}
        availCores={this.getSystemUsage().availCores}
      />
    );
  }

  getUserPiePlot(warnings, warnedUsers, systemUsage) {
    const { apiData } = this.state;
    let runningData = {};

    // Sum usage
    const jobIds = Object.keys(apiData.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      const job = apiData.jobs[jobId];
      const { username } = job;
      if (job.state === 'RUNNING') {
        if (!(Object.prototype.hasOwnProperty.call(runningData, username))) {
          runningData[username] = {
            cpus: 0,
            jobs: 0,
          };
        }
        runningData[username].cpus += job.nCpus;
        runningData[username].jobs += 1;
      }
    }

    const usernames = Object.keys(runningData);

    // Convert to array
    const usageDataArray = [];
    for (let i = 0; i < usernames.length; i += 1) {
      const username = usernames[i];
      usageDataArray.push({
        username,
        cpus: runningData[username].cpus,
        jobs: runningData[username].jobs,
      });
    }
    runningData = usageDataArray;

    // Sort by usage
    runningData.sort((a, b) => a.cpus - b.cpus);
    for (let i = 0; i < runningData.length; i += 1) {
      runningData[i].index = i;
    }

    return (
      <UserPiePlot
        runningData={runningData}
        runningCores={systemUsage.runningCores}
        availCores={systemUsage.availCores}
        updateUsername={(name) => this.updateUsername(name)}
        warnedUsers={warnedUsers}
        badness={this.getUserBadness(warnings, usernames)}
      />
    );
  }

  getNodeOverview(warnings, warnedUsers) {
    const {
      apiData,
      username,
      job,
      historyData,
      cpuKeys,
    } = this.state;
    const { jobs } = apiData;

    const nodeHasJob = {};
    // For each job
    const jobIds = Object.keys(jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      // If job is running
      if (jobs[jobId].state === 'RUNNING') {
        // For each host that the job is running on
        const layoutHosts = Object.keys(jobs[jobId].layout);
        for (let j = 0; j < layoutHosts.length; j += 1) {
          const host = layoutHosts[j];
          // Add this job to the node
          if (!(Object.keys(nodeHasJob).includes(host))) {
            nodeHasJob[host] = {};
          }
          nodeHasJob[host][jobId] = jobs[jobId];
        }
      }
    }
    return (
      <NodeOverview
        username={username}
        jobId={job}
        nodeData={apiData.nodes}
        jobs={apiData.jobs}
        nodeHasJob={nodeHasJob}
        onRowClick={(node) => this.selectNode(node)}
        warnings={warnings}
        warnedUsers={warnedUsers}
        onJobClick={(jobId) => this.selectJob(jobId)}
        historyData={historyData}
        cpuKeys={cpuKeys}
        getJobUsage={(jid, job_, nodes) => this.getJobUsage(jid, job_, nodes)}
        getNodeUsage={(jid, job_, node, host) => this.getNodeUsage(jid, job_, node, host)}
        getTotalUsage={(totalC) => this.getTotalUsage(totalC)}
      />
    );
  }

  setUserToJob() {
    const { username, apiData, job } = this.state;
    // Set the username to the currently selected job
    const jobUsername = apiData.jobs[job].username;
    if (username !== jobUsername) {
      this.updateUsername(jobUsername);
    }
  }

  getNodeDetails(warnings) {
    const {
      nodeName,
      apiData,
      username,
      job,
      historyData,
      cpuKeys,
      historyDataWindow,
    } = this.state;
    return (
      <NodeDetails
        name={nodeName}
        node={nodeName === null ? null : apiData.nodes[nodeName]}
        jobs={apiData.jobs}
        username={username}
        selectedJobId={job}
        onJobClick={(jobId) => this.selectJob(jobId)}
        warnings={warnings}
        historyData={historyData}
        cpuKeys={cpuKeys}
        changeTimeWindow={(t) => this.changeTimeWindow(t)}
        timeWindow={historyDataWindow}
        getNodeUsage={(jid, job_, node, host) => this.getNodeUsage(jid, job_, node, host)}
      />
    );
  }

  getSystemUsage() {
    const { apiData } = this.state;

    const usage = {
      availCores: 0,
      runningCores: 0,
      availNodes: 0,
      runningNodes: 0,
      freeCores: {},
    };

    const nodeFreeCores = {};

    const { nodes } = apiData;

    const hosts = Object.keys(nodes);
    for (let i = 0; i < hosts.length; i += 1) {
      const host = hosts[i];
      if (nodes[host].isCounted) {
        // Available cores
        usage.availCores += nodes[host].nCpus;

        // Available nodes
        usage.availNodes += 1;

        // Node specific free cores
        nodeFreeCores[host] = nodes[host].nCpus;
      }
    }

    const { jobs } = apiData;
    const runningNodeList = [];
    const jobIds = Object.keys(jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      if (jobs[jobId].state === 'RUNNING') {
        // Running cores
        usage.runningCores += jobs[jobId].nCpus;
        // Running nodes
        const jobHosts = Object.keys(jobs[jobId].layout);
        for (let j = 0; j < jobHosts.length; j += 1) {
          const host = jobHosts[j];
          if (!(runningNodeList.includes(host))) {
            runningNodeList.push(host);
          }
          if (Object.keys(nodeFreeCores).includes(host)) {
            nodeFreeCores[host] -= jobs[jobId].layout[host].length;
          }
        }
      }
    }

    // if a "bonus" node us being wholy or partially used then count it as avail
    for (let i = 0; i < runningNodeList.length; i += 1) {
      const host = runningNodeList[i];
      if (!(nodes[host].isCounted)) {
        usage.availCores += nodes[host].nCpus;
        usage.availNodes += 1;
      }
    }

    const freeHosts = Object.keys(nodeFreeCores);
    for (let i = 0; i < freeHosts.length; i += 1) {
      const host = freeHosts[i];
      const count = nodeFreeCores[host];
      if (!(Object.prototype.hasOwnProperty.call(usage.freeCores, count))) {
        usage.freeCores[count] = 1;
      } else {
        usage.freeCores[count] += 1;
      }
    }

    usage.runningNodes = runningNodeList.length;

    return usage;
  }

  getWarnedUsers(warnings) {
    const { apiData } = this.state;
    const warnedUsers = [];
    const { jobs } = apiData;
    const nodeNames = Object.keys(warnings);
    for (let i = 0; i < nodeNames.length; i += 1) {
      const nodeName = nodeNames[i];
      const jobIds = Object.keys(warnings[nodeName].jobs);
      for (let j = 0; j < jobIds.length; j += 1) {
        const jobId = jobIds[j];
        if (Object.prototype.hasOwnProperty.call(jobs, jobId)) {
          const { username } = jobs[jobId];
          if (!warnedUsers.includes(username)) {
            let nodeWarned = false;
            // Node type warnings
            const nodeWarnings = Object.keys(warnings[nodeName].node);
            for (let k = 0; k < nodeWarnings.length; k += 1) {
              const warning = nodeWarnings[k];
              if (!(warnedUsers.includes(username))) {
                if (warnings[nodeName].node[warning]) {
                  warnedUsers.push(username);
                  nodeWarned = true;
                  break;
                }
              }
            }

            // Job type warnings
            if (!nodeWarned) {
              const jobWarnings = Object.keys(warnings[nodeName].jobs[jobId]);
              for (let k = 0; k < jobWarnings.length; k += 1) {
                const warning = jobWarnings[k];
                if (warnings[nodeName].jobs[jobId][warning]) {
                  if (!(warnedUsers.includes(username))) {
                    warnedUsers.push(username);
                    break;
                  }
                }
              }
            }
          }
        }
      }
    }
    return warnedUsers;
  }

  getUserBadness(scoreSums, users) {
    const { apiData } = this.state;
    const badness = {};
    const { jobs } = apiData;

    // Start each user at 0
    for (let i = 0; i < users.length; i += 1) {
      const username = users[i];
      badness[username] = 0;
    }

    const nodeNames = Object.keys(scoreSums);
    for (let i = 0; i < nodeNames.length; i += 1) {
      const nodeName = nodeNames[i];
      // For job type warnings
      const jobIds = Object.keys(scoreSums[nodeName].jobs);
      for (let j = 0; j < jobIds.length; j += 1) {
        const jobId = jobIds[j];
        if (Object.prototype.hasOwnProperty.call(jobs, jobId)) {
          const { username } = jobs[jobId];

          // Job type warnings
          const warnings = Object.keys(scoreSums[nodeName].jobs[jobId]);
          for (let k = 0; k < warnings.length; k += 1) {
            const warning = warnings[k];
            badness[username] += scoreSums[nodeName].jobs[jobId][warning];
          }
        }
      }

      // For node type warnings
      const warnings = Object.keys(scoreSums[nodeName].node);
      for (let j = 0; j < warnings.length; j += 1) {
        const warning = warnings[j];
        // Find each job
        const nodeJobIds = Object.keys(scoreSums[nodeName].jobs);
        for (let k = 0; k < jobIds.length; k += 1) {
          const jobId = nodeJobIds[k];
          if (Object.prototype.hasOwnProperty.call(jobs, jobId)) {
            const { username } = jobs[jobId];
            badness[username] += scoreSums[nodeName].node[warning];
          }
        }
      }
    }

    return badness;
  }

  // Get the per job usage
  getJobUsage(jid, job, nodes) {
    const usage = {
      cpu: {
        user: 0, system: 0, wait: 0, idle: 0,
      },
      mem: { used: 0, max: 0, total: 0 },
      infiniband: { bytes_in: 0, bytes_out: 0 },
      lustre: { read: 0, write: 0 },
      gpu: { total: 0 },
    };

    let nCpus = 0;

    const hosts = Object.keys(job.layout);
    for (let i = 0; i < hosts.length; i += 1) {
      const host = hosts[i];
      if (host in nodes) {
        const nodeUsage = this.getNodeUsage(jid, job, nodes[host], host);
        const nCores = job.layout[host].length;
        usage.cpu.user += nodeUsage.cpu.user * nCores;
        usage.cpu.system += nodeUsage.cpu.system * nCores;
        usage.cpu.wait += nodeUsage.cpu.wait * nCores;
        usage.cpu.idle += nodeUsage.cpu.idle * nCores;
        usage.mem.used += job.mem[host];
        usage.mem.total += nodeUsage.mem.total;
        usage.infiniband.bytes_in += nodeUsage.infiniband.bytes_in;
        usage.infiniband.bytes_out += nodeUsage.infiniband.bytes_out;
        usage.lustre.read += nodeUsage.lustre.read;
        usage.lustre.write += nodeUsage.lustre.write;
        if (job.nGpus > 0) {
          usage.gpu.total += nodeUsage.gpu.total;
        }

        // Count number of CPUs (job.nCpus gives the total amount, not the subset)
        nCpus += job.layout[host].length;
      }
    }

    usage.mem.max = job.memMax;

    usage.cpu.user /= nCpus;
    usage.cpu.system /= nCpus;
    usage.cpu.wait /= nCpus;
    usage.cpu.idle /= nCpus;
    usage.gpu.total /= Object.keys(job.layout).length;

    return usage;
  }

  // Get the per job usage for a specific node
  getNodeUsage(jid, job, node, host) {
    const {
      cpuKeys,
      gpuLayout,
    } = this.state;
    const usage = {
      cpu: {
        user: 0, system: 0, wait: 0, idle: 0,
      },
      mem: { used: 0, total: 0 },
      infiniband: { bytes_in: 0, bytes_out: 0 },
      lustre: { read: 0, write: 0 },
      gpu: { total: 0 },
    };

    if (Object.prototype.hasOwnProperty.call(job.layout, host)) {
      const layout = job.layout[host];
      const layoutNumbers = Object.keys(layout);
      for (let i = 0; i < layoutNumbers.length; i += 1) {
        const iLayout = layoutNumbers[i];
        usage.cpu.user += node.cpu.coreC[iLayout][cpuKeys.user]
          + node.cpu.coreC[iLayout][cpuKeys.nice];
        usage.cpu.system += node.cpu.coreC[iLayout][cpuKeys.system];
        usage.cpu.wait += node.cpu.coreC[iLayout][cpuKeys.wait];
        usage.cpu.idle += node.cpu.coreC[iLayout][cpuKeys.idle];
      }
      let nGpus = 0;
      // If thif is a GPU job
      if (job.nGpus > 0) {
        // Zero if unknown
        usage.gpu.total = 0;

        // If the GPU mapping is known
        if (Object.prototype.hasOwnProperty.call(gpuLayout, jid)) {
          if (Object.prototype.hasOwnProperty.call(gpuLayout[jid], host)) {
            if (gpuLayout[jid][host].length > 0) {
              usage.gpu.total = 0;
              nGpus = 0;
              const gpuNumbers = Object.keys(gpuLayout[jid][host]);
              for (let j = 0; j < gpuNumbers.length; j += 1) {
                const iGpu = gpuNumbers[j];
                usage.gpu.total += node.gpus['gpu'.concat(iGpu.toString())];
                nGpus += 1;
              }
            }
          }
        }
      } else {
        usage.gpu.total = 0;
      }
      usage.mem.used = job.mem[host];
      usage.mem.max = job.memMax;
      usage.mem.total = node.mem.total;
      if (node.infiniband !== null) {
        usage.infiniband.bytes_in = node.infiniband.bytes_in;
        usage.infiniband.bytes_out = node.infiniband.bytes_out;
      } else {
        usage.infiniband.bytes_in = 0.0;
        usage.infiniband.bytes_out = 0.0;
      }

      usage.lustre.read = node.lustre.read;
      usage.lustre.write = node.lustre.write;

      const nCores = layout.length;
      usage.cpu.user /= nCores;
      usage.cpu.system /= nCores;
      usage.cpu.wait /= nCores;
      usage.cpu.idle /= nCores;
      usage.gpu.total /= nGpus;
    }

    return usage;
  }

  getTotalUsage(totalC) {
    const { cpuKeys } = this.state;
    const total = {};
    const categories = Object.kets(cpuKeys);
    for (let i = 0; i < categories.length; i += 1) {
      const key = categories[i];
      total[key] = totalC[cpuKeys[key]];
    }
    return total;
  }

  updateUsername(name) {
    const { job, apiData } = this.state;
    // If this new user owns the job, then a cohab job was selected
    // Don't clear
    let clearJob = true;
    if (job !== null) {
      if (apiData.jobs[job].username === name) {
        clearJob = false;
      }
    }

    if (clearJob) {
      this.setState({ username: name, nodeName: null, job: null });
    } else {
      this.setState({ username: name });
    }
  }

  changeTimeWindow(t) {
    const { historyDataCountInitial } = this.state;
    this.setState({ historyDataWindow: t },
      () => this.initHistoryData(historyDataCountInitial));
  }

  selectJob(jobId) {
    // Unselect job if it is already selected
    const { job } = this.state;
    if (job === jobId) {
      this.setState({ job: null });
      this.selectNode(null);
    } else {
      this.setState({ job: jobId },
        () => this.setUserToJob());
    }
  }

  selectNode(node) {
    this.setState({ nodeName: node });
  }

  show() {
    const {
      future,
      gotData,
      lastFetchAttempt,
      snapshotTime,
      holdSnap,
    } = this.state;
    if (!future) {
      if (gotData) {
        // If haven't fetched for a long time, then force a fetch
        // Usually happens when computer is waking from sleep
        const now = new Date();
        const fetchAge = (now - lastFetchAttempt) / 1000;
        const snapAge = (now - snapshotTime) / 1000;
        if (fetchAge > 300) {
          this.fetchLatest();
          // If the backend copy is old, then maintenance is occuring
        } else if ((snapAge > 600) && !(holdSnap)) {
          return (
            <div id="main-box">
              The job monitor is currently down for maintenance and will be back soon.
              {' '}
              <br />
              Jobs will continue running and can still be inspected by logging
              in to the compute nodes directly.
            </div>
          );
        } else {
          const warnings = this.generateWarnings();
          const warnedUsers = this.getWarnedUsers(warnings);
          const systemUsage = this.getSystemUsage();
          if (systemUsage.runningCores === 0) {
            return (
              <div id="main-box">
                OzSTAR is currently down for maintenance and will be back soon.
                {' '}
                <br />
              </div>
            );
          }
          return (
            <div id="main-box">
              {this.getUserPiePlot(warnings, warnedUsers, systemUsage)}
              {this.getNodeOverview(warnings, warnedUsers)}
              {this.getNodeDetails(warnings)}
            </div>
          );
        }
      }
    } else {
      return (
        <div id="main-box">
          {this.getQueue()}
          {this.getBackfill()}
        </div>
      );
    }

    return null;
  }

  instantWarnings(data) {
    const warnSwap = 20; // If swap greater than
    const warnWait = 5; // If waiting more than
    const warnUtil = 80; // If CPU utilisation below
    const warnMem = 70; // If memory used is less than
    const baseMem = 2048; // Megabytes of "free" memory per core not to warn for
    const baseMemSingle = 4096; // Megabytes of memory for the first core
    const graceTime = 5; // (Minutes) give jobs some time to get setup

    const { cpuKeys } = this.state;

    const warnings = {};

    const nodeNames = Object.keys(data.nodes);
    for (let i = 0; i < nodeNames.length; i += 1) {
      const nodeName = nodeNames[i];
      const node = data.nodes[nodeName];

      // Default scores to zero
      warnings[nodeName] = { node: { swapUse: 0 }, jobs: {} };

      // Score = percentage of swap used
      if (100 * ((node.swap.total - node.swap.free) / node.swap.total) > warnSwap) {
        warnings[nodeName].node.swapUse = 100 * (
          (node.swap.total - node.swap.free) / node.swap.total
        );
      }
    }

    const jobIds = Object.keys(data.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      const job = data.jobs[jobId];
      if (job.state === 'RUNNING' && job.runTime > graceTime) {
        const jobNodeNames = Object.keys(job.layout);
        for (let j = 0; j < jobNodeNames.length; j += 1) {
          const jobNodeName = jobNodeNames[j];
          const node = data.nodes[jobNodeName];
          warnings[jobNodeName].jobs[jobId] = {};

          // CPU use
          let cpuUsage = 0;
          let cpuWait = 0;
          const layoutNumbers = Object.keys(job.layout[jobNodeName]);
          for (let k = 1; k < layoutNumbers.length; k += 1) {
            const iLayout = layoutNumbers[k];
            cpuUsage += node.cpu.coreC[iLayout][cpuKeys.user]
              + node.cpu.coreC[iLayout][cpuKeys.system]
              + node.cpu.coreC[iLayout][cpuKeys.nice];
            cpuWait += node.cpu.coreC[iLayout][cpuKeys.wait];
          }

          // If below utilisation
          if (
            cpuUsage / job.layout[jobNodeName].length < warnUtil
            && (
              job.layout[jobNodeName].length > 1
              || job.Gpu === 0
            )
          ) {
            // Score = percentage wasted * number of cores
            warnings[jobNodeName].jobs[jobId].cpuUtil = (job.layout[jobNodeName].length * warnUtil)
            - cpuUsage;
          }

          if (cpuWait / job.layout[jobNodeName].length > warnWait) {
            // Score = percentage waiting * number of cores
            warnings[jobNodeName].jobs[jobId].cpuWait = cpuWait - warnWait;
          }
        }

        // CPUs per node
        const nCpus = job.nCpus / Object.keys(job.layout).length;

        // Memory that jobs can get for free
        const freeMem = baseMem * (nCpus - 1.0) + baseMemSingle;

        // Factor for making it stricter for large requests
        const x = Math.max(0.0, (job.memReq - freeMem) / job.memReq);

        const criteria = (job.memReq - freeMem) * (1.0 - x) + x * (warnMem / 100.0) * job.memReq;
        if (job.memMax < criteria) {
          // Max is over all nodes - only warn if all nodes are below threshold (quite generous)
          const memNodeNames = Object.keys(job.mem);
          for (let k = 1; k < memNodeNames.length; k += 1) {
            const memNodeName = memNodeNames[k];
            // Score = GB wasted
            warnings[memNodeName].jobs[jobId].memUtil = (criteria - job.memMax) / 1024;
          }
        }
      }
    }

    return warnings;
  }

  generateWarnings() {
    // Time window to check for warnings
    const warningWindow = 600;

    // If more than this fraction in the window is bad, then trigger warning
    const warningFraction = 0.5;

    const {
      snapshotTime,
      historyData,
    } = this.state;

    // Get the data snapshots that we check for warnings
    const now = snapshotTime / 1000;
    const warningDataIndex = [];
    for (let i = 0; i < historyData.length; i += 1) {
      const data = historyData[i];
      if (now - data.timestamp < warningWindow) {
        warningDataIndex.push(i);
      }
    }

    // Threshold number of snapshots for triggering warning
    const threshold = Math.floor(warningFraction * warningDataIndex.length);

    // Collate all the instantaneous warnings
    const warningSums = {};
    const scoreSums = {};

    // i is the index of the data
    for (let i = 0; i < warningDataIndex.length; i += 1) {
      const data = historyData[warningDataIndex[i]];
      const warnings = this.instantWarnings(data);

      // For each node
      const nodeNames = Object.keys(warnings);
      for (let j = 1; j < nodeNames.length; j += 1) {
        const nodeName = nodeNames[j];
        if (!(Object.prototype.hasOwnProperty.call(warningSums, nodeName))) {
          warningSums[nodeName] = { node: {}, jobs: {} };
          scoreSums[nodeName] = { node: {}, jobs: {} };
        }

        // Count node warnings
        const warningNames = Object.keys(warnings);
        for (let k = 0; k < warningNames.length; k += 1) {
          const warningName = warningNames[k];
          if (!(Object.prototype.hasOwnProperty.call(warningSums[nodeName].node, warningName))) {
            warningSums[nodeName].node[warningName] = 0;
            scoreSums[nodeName].node[warningName] = 0;
          }
          if (warnings[nodeName].node[warningName] > 0) {
            warningSums[nodeName].node[warningName] += 1;
            scoreSums[nodeName].node[warningName]
              += Math.floor(warnings[nodeName].node[warningName]);
          }
        }

        // Count job warnings
        const jobIds = Object.keys(warnings[nodeName].jobs);
        for (let k = 0; k < jobIds.length; k += 1) {
          const jobId = jobIds[k];
          if (!(Object.prototype.hasOwnProperty.call(warningSums[nodeName].jobs, jobId))) {
            warningSums[nodeName].jobs[jobId] = {};
            scoreSums[nodeName].jobs[jobId] = {};
          }
          const jobWarningNames = Object.keys(warnings[nodeName].jobs[jobId]);
          for (let l = 0; l < jobWarningNames.length; l += 1) {
            const jobWarningName = jobWarningNames[l];
            if (!(
              Object.prototype.hasOwnProperty.call(
                warningSums[nodeName].jobs[jobId],
                jobWarningName,
              )
            )) {
              warningSums[nodeName].jobs[jobId][jobWarningName] = 0;
              scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
            }
            if (warnings[nodeName].jobs[jobId][jobWarningName] > 0) {
              warningSums[nodeName].jobs[jobId][jobWarningName] += 1;
              scoreSums[nodeName].jobs[jobId][jobWarningName]
                += Math.floor(warnings[nodeName].jobs[jobId][jobWarningName]);
            }
          }
        }
      }
    }

    // Set jobs below the threshold to score = 0
    const nodeNames = Object.keys(warningSums);
    for (let i = 0; i < nodeNames.length; i += 1) {
      const nodeName = nodeNames[i];
      const warningNames = Object.keys(warningSums[nodeName].node);
      for (let j = 0; j < warningNames.length; j += 1) {
        const warningName = warningNames[j];
        if (warningSums[nodeName].node[warningName] > threshold) {
          // convert to integer
          scoreSums[nodeName].node[warningName] = Math.floor(
            scoreSums[nodeName].node[warningName] / warningDataIndex.length,
          );
        } else {
          scoreSums[nodeName].node[warningName] = 0;
        }
      }
      const jobIds = Object.keys(warningSums[nodeName].jobs);
      for (let j = 0; j < jobIds.length; j += 1) {
        const jobId = jobIds[j];
        const jobWarningNames = warningSums[nodeName].jobs[jobId];
        for (let k = 0; k < jobWarningNames.length; k += 1) {
          const jobWarningName = jobWarningNames[k];
          if (warningSums[nodeName].jobs[jobId][jobWarningName] > threshold) {
            // convert to integer
            scoreSums[nodeName].jobs[jobId][jobWarningName] = Math.floor(
              scoreSums[nodeName].jobs[jobId][jobWarningName] / warningDataIndex.length,
            );
          } else {
            scoreSums[nodeName].jobs[jobId][jobWarningName] = 0;
          }
        }
      }
    }

    return scoreSums;
  }

  cleanState(newData) {
    const {
      job,
      nodeName,
      username,
    } = this.state;
    // If a job is gone
    if (!(Object.keys(newData.jobs).includes(job))) {
      this.setState({ job: null });
    }

    // If a node is gone (unlikely)
    if (!(Object.keys(newData.nodes).includes(nodeName))) {
      this.setState({ nodeName: null });
    }

    // If a user is gone
    let hasUser = false;
    const jobIds = Object.keys(newData.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jobId = jobIds[i];
      if (newData.jobs[jobId].username === username) {
        hasUser = true;
        break;
      }
    }
    if (!(hasUser)) this.setState({ nodeName: null });
  }

  fetchTime(time) {
    const { address } = this.state;
    this.setState({ holdSnap: true });
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        this.cleanState(jsonData);
        this.setState({
          apiData: jsonData,
          snapshotTime: new Date(jsonData.timestamp * 1000),
          gotData: true,
        }, () => this.historyTimeJump());
      }
    };
    xhr.open('GET', `${address}bobdata.py?time=${time.toString()}`, true);
    xhr.send();
  }

  fetchHistory() {
    const { address } = this.state;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        this.setState({ history: jsonData.history });
        setTimeout(() => { this.fetchHistory(); }, 100000); // 100 seconds
      }
    };
    xhr.open('GET', `${address}bobhistory.py`, true);
    xhr.send();
  }

  fetchLatest() {
    const { holdSnap, address } = this.state;
    // Only update if the user doesn't want to hold onto a snap
    if (!(holdSnap)) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const jsonData = JSON.parse(xhr.responseText);
          this.cleanState(jsonData);
          this.setState({
            apiData: jsonData,
            gpuLayout: App.extractGpuLayout(jsonData),
            snapshotTime: new Date(jsonData.timestamp * 1000),
            lastFetchAttempt: new Date(),
            gotData: true,
          }, () => this.updateHistoryData());
          setTimeout(() => { this.fetchLatest(); }, 10000); // 10 seconds
        }
      };
      xhr.open('GET', `${address}bobdata.py`, true);
      xhr.send();
    }
  }

  fetchBackfill() {
    const { address } = this.state;
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const jsonData = JSON.parse(xhr.responseText);
        this.setState({ backfill: jsonData });
        setTimeout(() => { this.fetchBackfill(); }, 100000); // 100 seconds
      }
    };
    xhr.open('GET', `${address}bobbackfill.py`, true);
    xhr.send();
  }

  historyTimeJump() {
    const { historyDataCountInitial } = this.state;
    this.setState({ historyData: [] },
      () => this.initHistoryData(historyDataCountInitial));
  }

  updateHistoryData() {
    const {
      historyData,
      snapshotTime,
      historyDataWindow,
      apiData,
    } = this.state;

    if (historyData.length < 3) {
      this.historyTimeJump();
    } else {
      const observerNow = snapshotTime / 1000;

      const newHistoryData = [];
      const times = [];
      for (let i = 0; i < historyData.length; i += 1) {
        const data = historyData[i];
        const timeDiff = observerNow - data.timestamp;
        if ((timeDiff < historyDataWindow) && (timeDiff > 0)) {
          newHistoryData.push(data);
          times.push(data.timestamp);
        }
      }

      // Add newest snapshot
      if (!(times.includes(apiData.timestamp)) && !(apiData === null)) {
        newHistoryData.push(apiData);
      }

      // Update, before putting past values in (if history is too short)
      this.setState({ historyData: newHistoryData });
    }
  }

  initHistoryData(nVal) {
    const {
      history,
      snapshotTime,
      historyDataWindow,
      address,
    } = this.state;

    if (!(history === null)) {
      const observerNow = snapshotTime / 1000;

      // Get the times to request
      const times = Object.keys(history);
      const historyDataTimes = [];
      for (let i = 0; i < times.length; i += 1) {
        const time = times[i];
        const timeDiff = observerNow - time;
        if ((timeDiff < historyDataWindow) && (timeDiff > 0)) {
          historyDataTimes.push(time);
        }
      }

      // Calculate the data coarseness
      let requestDataTimes = [];
      if ((nVal > 0) && (nVal < historyDataTimes.length)) {
        const nSkip = Math.floor(historyDataTimes.length / nVal);
        for (let i = 0; i < historyDataTimes.length; i += nSkip) {
          requestDataTimes.push(historyDataTimes[i]);
        }
      } else {
        requestDataTimes = historyDataTimes;
      }

      // Make requests, then push to list
      const historyDataTemp = [];
      for (let i = 0; i < requestDataTimes.length; i += 1) {
        const time = requestDataTimes[i];
        const xhr = new XMLHttpRequest();
        // eslint-disable-next-line
                xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            const jsonData = JSON.parse(xhr.responseText);
            historyDataTemp.push(jsonData);
            if (historyDataTemp.length === requestDataTimes.length) {
              if (nVal > historyDataTimes.length) {
                this.setState({ historyData: historyDataTemp });
              } else if (nVal < 200) {
                this.setState({
                  historyData: historyDataTemp,
                }, () => this.initHistoryData(nVal * 3));
              }
            }
          }
        };
        xhr.open('GET', `${address}bobdata.py?time=${time.toString()}`, true);
        xhr.send();
      }
    }
  }

  freeze() {
    this.setState({ holdSnap: true });
  }

  unfreeze() {
    this.setState({ holdSnap: false, snapshotTime: new Date() },
      () => this.fetchLatest());
  }

  viewFuture() {
    this.setState({ future: true });
  }

  viewPresent() {
    this.setState({ future: false });
    this.unfreeze();
  }

  viewPast() {
    this.setState({ future: false });
    this.freeze();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div id="header">
            <div id="logo">
              <a href="https://supercomputing.swin.edu.au/">
                <img src={logo} className="App-logo" alt="logo" />
              </a>
            </div>
            <div id="page-title">
              Job Monitor
            </div>
            <div id="header-right" />
          </div>
        </header>
        {this.getTimeMachine()}
        {this.show()}

      </div>
    );
  }
}

export default App;
