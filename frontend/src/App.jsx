import React from 'react';

import { version } from '../package.json';

import logo from './logo.png';
import './App.css';

import config from './config';

import NodeDetails from './NodeDetails';
import NodeOverview from './NodeOverview';
import UserPiePlot from './UserPiePlot';
import TimeMachine from './TimeMachine';
import Queue from './Queue';
import Backfill from './Backfill';
import { generateWarnings, getWarnedUsers} from './warnings';
import extractGpuLayout from './gpuLayout';

class App extends React.Component {
  static whyDidYouRender = true
  constructor(props) {
    super(props);
    this.state = {
      apiData: null,
      gotData: false,
      username: null,
      nodeName: null,
      job: null,
      snapshotTime: new Date(0),
      holdSnap: false,
      history: null,
      historyData: [],
      historyDataWindow: 600, // seconds
      future: false,
      backfill: null,
      gpuLayout: null,
      warnings: {},
      warnedUsers: [],
      systemUsage: null,
      theme: "light",
    };

    this.fetchHistory();
    this.fetchLatest();
    this.fetchBackfill();
  }

  componentDidMount() {
    this.intervalFetch = setInterval(() => this.fetchLatest(), config.fetchFrequency * 1000);
    this.intervalHistory = setInterval(() => this.fetchHistory(), config.fetchHistoryFrequency * 1000);
    this.intervalBackfill = setInterval(() => this.fetchBackfill(), config.fetchBackfillFrequency * 1000);

    // Load saved theme if running in a browser
    if (typeof localStorage !== 'undefined' && localStorage.getItem("theme") === "dark") {
      this.setState({theme: "dark"})
    }

  }

  componentWillUnmount() {
    clearInterval(this.intervalFetch);
    clearInterval(this.intervalHistory);
    clearInterval(this.intervalBackfill);
  }


  getTimeMachine() {
    const {
      history,
      snapshotTime,
      theme,
    } = this.state;
    return (
      <TimeMachine
        history={history}
        clickLoadTime={(time) => this.fetchTime(time)}
        snapshotTime={snapshotTime}
        viewPresent={() => this.viewPresent()}
        viewFuture={() => this.viewFuture()}
        viewPast={() => this.viewPast()}
        theme={theme}
      />
    );
  }

  getBackfill() {
    const { backfill, theme } = this.state;
    return (
      <Backfill
        backfillData={backfill}
        theme={theme}
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

  getUserPiePlot() {
    const { apiData, warnings, warnedUsers, systemUsage } = this.state;
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

  getNodeOverview() {
    const {
      apiData,
      username,
      job,
      historyData,
      gpuLayout,
      warnings,
      warnedUsers,
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
        getTotalUsage={(total) => this.getTotalUsage(total)}
        gpuLayout={gpuLayout}
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

  getNodeDetails() {
    const {
      nodeName,
      apiData,
      username,
      job,
      historyData,
      historyDataWindow,
      gpuLayout,
      warnings,
      theme,
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
        gpuLayout={gpuLayout}
        theme={theme}
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

  getTotalUsage(totalArray) {
    const total = {};
    const categories = Object.keys(config.cpuKeys);
    for (let i = 0; i < categories.length; i += 1) {
      const key = categories[i];
      total[key] = totalArray[config.cpuKeys[key]];
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
    const { apiData, job, nodeName } = this.state;
    if (job === jobId) {
      this.setState({ job: null });
      this.selectNode(null);
    } else {
      this.setState({ job: jobId },
        () => this.setUserToJob());

      // Clear node selection if this job does not run on it
      const nodes = Object.keys(apiData.jobs[jobId].layout)
      if (!nodes.includes(nodeName)) {
        this.setState({ nodeName: null})
      }
    }
  }

  selectNode(node) {
    this.setState({ nodeName: node });
  }

  show() {
    const {
      future,
      gotData,
      snapshotTime,
      holdSnap,
      systemUsage,
    } = this.state;
    if (!future) {
      if (gotData) {
        // If haven't fetched for a long time, then force a fetch
        // Usually happens when computer is waking from sleep
        const now = new Date();
        const snapAge = (now - snapshotTime) / 1000;
        if ((snapAge > config.maintenanceAge) && !holdSnap) {
          // If the backend copy is old, then maintenance is occuring
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
          if (systemUsage !== null) {
            if (systemUsage.runningCores === 0) {
              return (
                <div id="main-box">
                  There are no jobs currently running.
                  {' '}
                  <br />
                </div>
              )
            }
          }

          return (
            <div id="main-box">
              {systemUsage !== null && this.getUserPiePlot()}
              {this.getNodeOverview()}
              {this.getNodeDetails()}
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
    if (job !== null) {
      if (!(Object.keys(newData.jobs).includes(job))) {
        this.setState({ job: null });
      }
    }

    // If a node is gone (unlikely)
    if (nodeName !== null) {
      if (!(Object.keys(newData.nodes).includes(nodeName))) {
        this.setState({ nodeName: null });
      }
    }

    // If a user is gone
    if (username !== null) {
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

  }

  fetchTime(time) {
    const that = this;
    fetch(`${config.address}data.py?time=${time.toString()}`)
      .then((response) => response.json())
      .then((data) => {

        if (data.api === config.apiVersion) {
          that.cleanState(data);
          that.setState({
            apiData: data,
            snapshotTime: new Date(data.timestamp * 1000),
            gotData: true,
          }, () => that.historyTimeJump());
        }

      })
      .catch((err) => {
        console.log('Error fetching history', err);
      });
  }

  fetchHistory() {
    const that = this;
    fetch(`${config.address}history.py`)
      .then((response) => response.json())
      .then((data) => {
        that.setState({ history: data.history });
      })
      .catch((err) => {
        console.log('Error fetching history', err);
      });
  }

  fetchLatest() {
    const { holdSnap, apiData } = this.state;
    // Only update if the user doesn't want to hold onto a snap
    if (!(holdSnap)) {
      const that = this;
      fetch(`${config.address}data.py`)
        .then((response) => response.json())
        .then((data) => {

          // Only update if data is new
          if (apiData !== null) {
            if (data.timestamp === apiData.timestamp) {
              return
            }

          }

          that.cleanState(data);

          if (data.api === config.apiVersion) {
            that.setState({
              apiData: data,
              snapshotTime: new Date(data.timestamp * 1000),
              gotData: true,
            },
            () => that.postFetch()
            );
          }
        })
        .catch((err) => {
          console.log('Error fetching latest data', err);
        });
    }
  }

  postFetch() {
    this.setGpuLayout()
    this.updateHistoryData()
    this.setState({
      systemUsage: this.getSystemUsage(),
    })
  }

  getWarnings() {
    const {
      apiData,
      snapshotTime,
      historyData
    } = this.state

    const warnings = generateWarnings(snapshotTime, historyData)
    const warnedUsers = getWarnedUsers(warnings, apiData.jobs)

    this.setState({
      warnings: warnings,
      warnedUsers: warnedUsers,
    })

  }

  setGpuLayout() {
    const { apiData, gpuLayout } = this.state
    const newLayout = extractGpuLayout(apiData, gpuLayout)
    if (newLayout !== null) {
      this.setState({gpuLayout: newLayout})
    }
  }

  fetchBackfill() {
    const that = this;
    fetch(`${config.address}backfill.py`)
      .then((response) => response.json())
      .then((data) => {
        that.setState({ backfill: data });
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
      // This may be the current time, or the time set in the time machine
      const observerNow = snapshotTime / 1000;

      const newHistoryData = [];
      const times = [];
      for (let i = 0; i < historyData.length; i += 1) {
        const data = historyData[i];
        const timeDiff = observerNow - data.timestamp;
        if ((timeDiff <= historyDataWindow) && (timeDiff >= 0)) {
          newHistoryData.push(data);
          times.push(data.timestamp);
        }
      }

      let changed = true
      // Add newest snapshot
      if (!times.includes(apiData.timestamp) && !(apiData === null)) {
        newHistoryData.push(apiData);
      } else {
        // Check if historydata is actually unchanged
        // If the newest snapshot was not added, then the length
        // will remain the same if the contents are unchanged
        if (newHistoryData.length === historyData.length) {
          changed = false
        }
      }

      // Update, before putting past values in (if history is too short)
      if (changed) {
        this.setState({ historyData: newHistoryData },
          () => this.getWarnings()
          );
      }
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
        fetch(`${config.address}data.py?time=${time.toString()}`)
          .then((response) => response.json())
          .then((data) => {

            if (data.api === config.apiVersion) {
              historyDataTemp.push(data);
            }

            // If the last snapshot has been read
            if (i === requestDataTimes.length - 1) {
              if (nVal > historyDataTimes.length) {
                that.setState({ historyData: historyDataTemp },
                  () => this.getWarnings()
                  );
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

  changeTheme() {
    const {
      theme
    } = this.state;

    if (theme === "light") {
      this.setState({theme: "dark"})
      localStorage.setItem("theme", "dark");
    } else {
      this.setState({theme: "light"})
      localStorage.setItem("theme", "light");
    }
  }

  render() {
    const {
      theme
    } = this.state;

    document.documentElement.setAttribute("data-theme", theme)

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
        <div id="theme-switch">
          <input
            name="darkTheme"
            type="checkbox"
            checked={theme === "dark"}
            onChange={() => this.changeTheme()}
          />
          Dark mode
        </div>
        <div id="version">
          v{version}
        </div>
      </div>
    );
  }
}

export default App;
