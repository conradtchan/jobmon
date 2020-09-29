import React from 'react';
import logo from './logo.png';
import './App.css';

import NodeDetails from './NodeDetails';
import NodeOverview from './NodeOverview';
import UserPiePlot from './UserPiePlot';
import TimeMachine from './TimeMachine';
import Queue from './Queue';
import Backfill from './Backfill';
import generateWarnings from './warnings';
import config from './config';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
      future: false,
      backfill: null,
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
        timestamp={apiData.timestamp}
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
        timestamp={apiData.timestamp}
        username={username}
        jobId={job}
        nodeData={apiData.nodes}
        jobs={apiData.jobs}
        apiData={apiData}
        nodeHasJob={nodeHasJob}
        onRowClick={(node) => this.selectNode(node)}
        warnings={warnings}
        warnedUsers={warnedUsers}
        onJobClick={(jobId) => this.selectJob(jobId)}
        historyData={historyData}
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
      historyDataWindow,
    } = this.state;
    return (
      <NodeDetails
        timestamp={apiData.timestamp}
        name={nodeName}
        node={nodeName === null ? null : apiData.nodes[nodeName]}
        jobs={apiData.jobs}
        username={username}
        selectedJobId={job}
        onJobClick={(jobId) => this.selectJob(jobId)}
        warnings={warnings}
        historyData={historyData}
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
    const { gpuLayout } = this.state;
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
      for (let i = 0; i < layout.length; i += 1) {
        const iLayout = layout[i];
        usage.cpu.user += node.cpu.coreC[iLayout][config.cpuKeys.user]
          + node.cpu.coreC[iLayout][config.cpuKeys.nice];
        usage.cpu.system += node.cpu.coreC[iLayout][config.cpuKeys.system];
        usage.cpu.wait += node.cpu.coreC[iLayout][config.cpuKeys.wait];
        usage.cpu.idle += node.cpu.coreC[iLayout][config.cpuKeys.idle];
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
    const total = {};
    const categories = Object.keys(config.cpuKeys);
    for (let i = 0; i < categories.length; i += 1) {
      const key = categories[i];
      total[key] = totalC[config.cpuKeys[key]];
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
    this.setState({ historyDataWindow: t },
      () => this.initHistoryData(config.historyDataCountInitial));
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
      historyData,
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
          const warnings = generateWarnings(snapshotTime, historyData);
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
    const that = this;
    fetch(`${config.address}bobdata.py?time=${time.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        that.cleanState(data);
        that.setState({
          apiData: data,
          snapshotTime: new Date(data.timestamp * 1000),
          gotData: true,
        }, () => that.historyTimeJump());
      })
      .catch((err) => {
        console.log('Error fetching history', err);
      });
  }

  fetchHistory() {
    const that = this;
    fetch(`${config.address}bobhistory.py`)
      .then((response) => response.json())
      .then((data) => {
        that.setState({ history: data.history });
        setTimeout(() => { that.fetchHistory(); }, 100000); // 100 seconds
      })
      .catch((err) => {
        console.log('Error fetching history', err);
      });
  }

  fetchLatest() {
    const { holdSnap } = this.state;
    // Only update if the user doesn't want to hold onto a snap
    if (!(holdSnap)) {
      const that = this;
      fetch(`${config.address}bobdata.py`)
        .then((response) => response.json())
        .then((data) => {
          that.cleanState(data);
          that.setState({
            apiData: data,
            snapshotTime: new Date(data.timestamp * 1000),
            lastFetchAttempt: new Date(),
            gotData: true,
          },
          () => that.postFetch()
          );
          setTimeout(() => { that.fetchLatest(); }, config.fetchFrequency * 1000);
        })
        .catch((err) => {
          console.log('Error fetching latest data', err);
        });
    }
  }

  postFetch() {
    this.setGpuLayout()
    this.updateHistoryData()
  }

  setGpuLayout() {
    const layout = this.extractGpuLayout()
    this.setState({gpuLayout: layout})
  }

  extractGpuLayout() {
    // The GPU mapping always needs to be the current one,
    // because it may not have been properly determined in the past
    const { apiData } = this.state;
    const layout = {};
    const jobIds = Object.keys(apiData.jobs);
    for (let i = 0; i < jobIds.length; i += 1) {
      const jid = jobIds[i];
      if (apiData.jobs[jid].nGpus > 0) {
        layout[jid] = {};
        const gpuHosts = Object.keys(apiData.jobs[jid].gpuLayout);
        for (let j = 0; j < gpuHosts.length; j += 1) {
          const host = gpuHosts[j];
          layout[jid][host] = apiData.jobs[jid].gpuLayout[host];
        }
      }
    }
    return layout;
  }

  fetchBackfill() {
    const that = this;
    fetch(`${config.address}bobbackfill.py`)
      .then((response) => response.json())
      .then((data) => {
        that.setState({ backfill: data });
        setTimeout(() => { that.fetchBackfill(); }, 100000); // 100 seconds
      })
      .catch((err) => {
        console.log('Error fetching history', err);
      });
  }

  historyTimeJump() {
    this.setState({ historyData: [] },
      () => this.initHistoryData(config.historyDataCountInitial));
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
      const that = this;
      for (let i = 0; i < requestDataTimes.length; i += 1) {
        const time = requestDataTimes[i];
        fetch(`${config.address}bobdata.py?time=${time.toString()}`)
          .then((response) => response.json())
          .then((data) => {
            historyDataTemp.push(data);
            if (historyDataTemp.length === requestDataTimes.length) {
              if (nVal > historyDataTimes.length) {
                that.setState({ historyData: historyDataTemp });
              } else if (nVal < 200) {
                that.setState({
                  historyData: historyDataTemp,
                }, () => that.initHistoryData(nVal * config.historyResolutionMultiplier));
              }
            }
          })
          .catch((err) => {
            console.log('Error fetching history', err);
          });
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
              <a href={config.homepage}>
                <img src={logo} className="App-logo" alt="logo" />
              </a>
            </div>
            <div id="page-title">
              {config.pageTitle}
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
