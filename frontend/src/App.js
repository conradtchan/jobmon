import React from 'react';
import logo from './logo.png';
import './App.css';

import NodeDetails from "./NodeDetails"
import NodeOverview from "./NodeOverview"
import UserPiePlot from "./UserPiePlot"
import TimeMachine from "./TimeMachine"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: 'https://supercomputing.swin.edu.au/monitor/api/',
            apiData: null,
            gotData: false,
            username: null,
            nodeName: null,
            job: null,
            warnings: null,
            snapshotTime: new Date(0),
            holdSnap: false,
            history: null,
            historyData: [],
            historyDataWindow: 3600, // seconds
        };

        this.fetchHistory();
        this.fetchLatest();

    }

    initHistoryData(nVal) {
        if (!(this.state.history === null)) {
            const observerNow = this.state.snapshotTime / 1000;

            // Get the times to request
            const times = Object.keys(this.state.history);
            let historyDataTimes = [];
            for (let time of times) {
                const timeDiff = observerNow - time;
                if ((timeDiff < this.state.historyDataWindow) && (timeDiff > 0)) {
                    historyDataTimes.push(time)
                }
            }

            // Calculate the data coarseness
            let requestDataTimes = [];
            if ((0 < nVal) && (nVal < historyDataTimes.length)) {
                const nSkip = Math.floor(historyDataTimes.length / nVal);
                for (let i = 0; i < historyDataTimes.length; i += nSkip) {
                    requestDataTimes.push(historyDataTimes[i])
                }
            } else {
                requestDataTimes = historyDataTimes
            }

            // Make requests, then push to list
            let historyDataTemp = [];
            for (let time of requestDataTimes) {
                let xhr = new XMLHttpRequest();
                // eslint-disable-next-line
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4 && xhr.status === 200) {
                        const jsonData = JSON.parse(xhr.responseText);
                        historyDataTemp.push(jsonData);
                        if (historyDataTemp.length === requestDataTimes.length) {
                            if (nVal > historyDataTimes.length) {
                                this.setState({historyData: historyDataTemp});
                            } else {
                                this.setState({
                                    historyData: historyDataTemp,
                                }, () => this.initHistoryData(nVal * 10));
                            }
                        }
                    }
                };
                xhr.open("GET", this.state.address + "bobdata.py?time=" + time.toString(), true);
                xhr.send();
            }
        }
    }

    updateHistoryData() {
        if (this.state.historyData.length < 3) {
            this.historyTimeJump()
        } else {
            const observerNow = this.state.snapshotTime / 1000;

            let newHistoryData = [];
            let times = [];
            for (let data of this.state.historyData) {
                const timeDiff = observerNow - data.timestamp;
                if ((timeDiff < this.state.historyDataWindow) && (timeDiff > 0)) {
                    newHistoryData.push(data);
                    times.push(data.timestamp)
                }
            }

            // Add newest snapshot
            if (!(times.includes(this.state.apiData.timestamp)) && !(this.state.apiData === null)) {
                newHistoryData.push(this.state.apiData)
            }

            // Update, before putting past values in (if history is too short)
            this.setState({historyData: newHistoryData})
        }
    }

    historyTimeJump() {
        this.setState({historyData: []},
            () => this.initHistoryData(20)
        )
    }

    fetchHistory() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonData = JSON.parse(xhr.responseText);
                this.setState({history: jsonData.history})
                setTimeout(() => {this.fetchHistory()}, 100000) // 100 seconds
            }
        };
        xhr.open("GET", this.state.address + "bobhistory.py", true);
        xhr.send();
    }

    fetchLatest() {
        // Only update if the user doesn't want to hold onto a snap
        if (!(this.state.holdSnap)) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    const jsonData = JSON.parse(xhr.responseText);
                    this.cleanState(jsonData);
                    this.setState({
                        apiData: jsonData,
                        snapshotTime: new Date(jsonData.timestamp * 1000),
                        gotData: true,
                    }, () => this.updateHistoryData());
                    setTimeout(() => {this.fetchLatest()}, 10000) // 10 seconds
                }
            };
            xhr.open("GET", this.state.address + "bobdata.py", true);
            xhr.send();
        }
    }

    fetchTime(time) {
        this.setState({holdSnap: true});
        let xhr = new XMLHttpRequest();
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
        xhr.open("GET", this.state.address + "bobdata.py?time=" + time.toString(), true);
        xhr.send();
    }

    cleanState(newData) {
        // If a job is gone
        if (!(newData.jobs.hasOwnProperty(this.state.job))) {
            this.setState({job: null})
        }

        // If a node is gone (unlikely)
        if (!(newData.nodes.hasOwnProperty(this.state.nodeName))) {
            this.setState({nodeName: null})
        }

        // If a user is gone
        let hasUser = false;
        for (let jobId in newData.jobs) {
            if (newData.jobs[jobId].username === this.state.username) {
                hasUser = true
            }
        }
        if (!(hasUser)) this.setState({nodeName: null})
    }

    selectNode(node) {
        this.setState({nodeName: node})
    }

    getNodeOverview(warnings) {
        const jobs = this.state.apiData.jobs;

        let nodeHasJob = {};
        // For each job
        for (let jobId in jobs) {
            // If job is running
            if (jobs[jobId].state === 'RUNNING') {
                // For each host that the job is running on
                for (let host in jobs[jobId].layout) {
                    // Add this job to the node
                    if (!(nodeHasJob.hasOwnProperty(host))) {
                        nodeHasJob[host] = {}
                    }
                    nodeHasJob[host][jobId] = jobs[jobId]
                }
            }
        }

        if (this.state.username === null) {
            return (<div className="main-item center"/>)
        } else {
            return (
                <NodeOverview
                    username={this.state.username}
                    jobId={this.state.job}
                    nodeData={this.state.apiData.nodes}
                    jobs={this.state.apiData.jobs}
                    nodeHasJob={nodeHasJob}
                    onRowClick={(node) => this.selectNode(node)}
                    warnings={warnings}
                    onJobClick={(jobId) => this.selectJob(jobId)}
                    historyData={this.state.historyData}
                />
            )
        }
    }

    selectJob(jobId) {
        // Unselect job if it is already selected
        if (this.state.job === jobId) {
            this.setState({job: null})
        } else {
            this.setState({job: jobId})
        }
    }

    getNodeDetails(warnings) {
        if (this.state.nodeName === null) {
            return (<div className="main-item right"/>)
        } else {
            return (
                <NodeDetails
                    name={this.state.nodeName}
                    node={this.state.apiData.nodes[this.state.nodeName]}
                    gangliaURL={this.state.apiData.gangliaURL}
                    jobs={this.state.apiData.jobs}
                    username={this.state.username}
                    selectedJobId={this.state.job}
                    onJobClick={(jobId) => this.selectJob(jobId)}
                    warnings={warnings}
                    historyData={this.state.historyData}
                />
            )
        }
    }

    getQueue() {
        let queue = {
            size: 0,
            cpuHours: 0,
        };
        for (let jobId in this.state.apiData.jobs) {
            const job = this.state.apiData.jobs[jobId]
            if (job.state === 'PENDING') {
                queue.size++;
                // Time limit is given in minutes
                queue.cpuHours += job.timeLimit * job.nCpus / 60

            }
        }
        return queue
    }


    getSystemUsage() {
        let usage = {
            availCores: 0,
            runningCores: 0,
            availNodes: 0,
            runningNodes: 0,

        };


        const nodes = this.state.apiData.nodes;
        for (let host in nodes) {
            if (nodes[host].isCounted) {
                // Available cores
                usage.availCores += nodes[host].nCpus;

                // Available nodes
                usage.availNodes += 1
            }
        }

        const jobs = this.state.apiData.jobs;
        let runningNodeList = [];
        for (let jobId in jobs) {
            if (jobs[jobId].state === 'RUNNING') {
                // Running cores
                usage.runningCores += jobs[jobId].nCpus;
                // Running nodes
                for (let host in jobs[jobId].layout) {
                    if (!(runningNodeList.includes(host))) {
                        runningNodeList.push(host)
                    }
                }
            }
        }

        // Some nodes are not counted because they are rarely used
        // But if they are used, then bump up the avail count
        // if (usage.runningCores > usage.availCores) usage.availCores = usage.runningCores;

        usage.runningNodes = runningNodeList.length;

        return usage
    }

    updateUsername(name) {
        this.setState({username: name, nodeName: null, job: null})
    }

    getWarnedUsers(warnings) {
        let warnedUsers = [];
        const jobs = this.state.apiData.jobs;
        for (let nodeName in warnings) {
            over_jobs:
            for (let jobId in warnings[nodeName].jobs) {
                if (jobs.hasOwnProperty(jobId)) {
                    const username = jobs[jobId].username;
                    if (warnedUsers.includes(username)) continue; // over_jobs

                    // Node type warnings
                    for (let warning in warnings[nodeName].node) {
                        if (!(warnedUsers.includes(username))) {
                            if (warnings[nodeName].node[warning]) {
                                warnedUsers.push(username);
                                continue over_jobs
                            }
                        }
                    }

                    // Job type warnings
                    for (let warning in warnings[nodeName].jobs[jobId]) {
                        if (warnings[nodeName].jobs[jobId][warning]) {
                            if (!(warnedUsers.includes(username))) {
                                warnedUsers.push(username);
                                continue over_jobs
                            }

                        }
                    }
                }
            }
        }
        return warnedUsers
    }

    getUserPiePlot(warnings) {
        const systemUsage = this.getSystemUsage();
        let usageData = {running: {}, queued: {}};

        // Sum usage
        for (let jobId in this.state.apiData.jobs) {
            const job = this.state.apiData.jobs[jobId];
            const username = job.username;
            if (job.state === 'RUNNING') {
                if (!(usageData.running.hasOwnProperty(username))) {
                    usageData.running[username] = {
                        cpus: 0,
                        jobs: 0,
                    }
                }
                usageData.running[username].cpus += job.nCpus;
                usageData.running[username].jobs++
            } else if (job.state === 'PENDING') {
                if (!(usageData.queued.hasOwnProperty(username))) {
                    usageData.queued[username] = {
                        jobs: 0,
                        hours: 0,
                    }
                }
                usageData.queued[username].hours += job.nCpus * job.timeLimit / 60;
                usageData.queued[username].jobs++
            }
        }

        // Get usage percentage
        for (let username in usageData.running) {
            usageData.running[username]['percent'] = 100 * usageData.running[username]['cpus'] / systemUsage.availCores.toFixed(0)
        }

        // Convert to array
        let usageDataArray = [];
        for (let username in usageData.running) {
            usageDataArray.push({
                username: username,
                cpus: usageData.running[username].cpus,
                jobs: usageData.running[username].jobs,
            })
        }
        usageData.running = usageDataArray;
        let queueDataArray = [];
        for (let username in usageData.queued) {
            queueDataArray.push({
                username: username,
                jobs: usageData.queued[username].jobs,
                hours: usageData.queued[username].hours,
            })
        }
        usageData.queued = queueDataArray;

        // Sort by usage
        usageData.running.sort((a, b) => a.cpus - b.cpus);
        for (let i=0; i<usageData.running.length; i++) {
            usageData.running[i]['index'] = i
        }

        return (
            <UserPiePlot
                usageData = {usageData}
                runningCores = {systemUsage.runningCores}
                availCores = {systemUsage.availCores}
                updateUsername = {(name) => this.updateUsername(name)}
                warnedUsers = {this.getWarnedUsers(warnings)}
                queue = {this.getQueue()}
            />
        )

    }


    show() {
        if (this.state.gotData) {
            const warnings = this.generateWarnings();
            return (
                <div id='main-box'>
                    {this.getUserPiePlot(warnings)}
                    {this.getNodeOverview(warnings)}
                    {this.getNodeDetails(warnings)}
                </div>
            )
        }
    }

    instantWarnings(data) {
        const warnSwap = 20; // If swap greater than
        const warnWait = 10; // If waiting more than
        const warnUtil = 90; // If CPU utilisation below

        let warnings = {};

        for (let nodeName in data.nodes) {
            const node = data.nodes[nodeName];
            warnings[nodeName] = {node: {}, jobs: {}};

            warnings[nodeName].node['cpuWait'] = (node.cpu.total.wait > warnWait);
            warnings[nodeName].node['swapUse'] = (100 * ((node.swap.total - node.swap.free) / node.swap.total) > warnSwap);
        }

        for (let jobId in data.jobs) {
            const job = data.jobs[jobId];
            if (job.state === 'RUNNING') {
                for (let nodeName in job.layout) {
                    const node = data.nodes[nodeName];
                    warnings[nodeName].jobs[jobId] = {};

                    let cpuUsage = 0;
                    for (let i of job.layout[nodeName]) {
                        cpuUsage += node.cpu.core[i].user
                    }
                    cpuUsage /= job.layout[nodeName].length;
                    warnings[nodeName].jobs[jobId]['cpuUtil'] = (cpuUsage < warnUtil);
                }
            }
        }
        return warnings
    }

    generateWarnings() {
        const warningWindow = 60; // Time window to check for warnings
        const warningFraction = 0.5; // If more than this fraction in the window is bad, then trigger warning

        // Get the data snapshots that we check for warnings
        const now = this.state.snapshotTime / 1000;
        let warningDataIndex = [];
        for (let i = 0; i < this.state.historyData.length; i++) {
            const data = this.state.historyData[i];
            if (now - data.timestamp < warningWindow) {
                warningDataIndex.push(i)
            }
        }

        // Threshold number of snapshots for triggering warning
        const threshold = Math.floor(warningFraction * warningDataIndex.length);

        // Collate all the instantaneous warnings
        let warningSums = {};
        // i is the index of the data, j is counting the snapshots
        let j = 0;
        for (let i of warningDataIndex) {
            j++;
            const data = this.state.historyData[i];
            const warnings = this.instantWarnings(data);
            for (let nodeName in warnings) {
                if (!(warningSums.hasOwnProperty(nodeName))) {
                    warningSums[nodeName] = {node: {}, jobs: {}};
                }
                for (let warningName in warnings[nodeName].node) {
                    if (!(warningSums[nodeName].node.hasOwnProperty(warningName))) {
                        warningSums[nodeName].node[warningName] = 0;
                    }
                    if (warnings[nodeName].node[warningName]) {
                        warningSums[nodeName].node[warningName]++
                    }
                    // Convert count into boolean
                    if (j === warningDataIndex.length) {
                        warningSums[nodeName].node[warningName] = (warningSums[nodeName].node[warningName] > threshold)
                    }
                }
                for (let jobId in warnings[nodeName].jobs) {
                    if (!(warningSums[nodeName].jobs.hasOwnProperty(jobId))) {
                        warningSums[nodeName].jobs[jobId] = {}
                    }
                    for (let warningName in warnings[nodeName].jobs[jobId]) {
                        if (!(warningSums[nodeName].jobs[jobId].hasOwnProperty(warningName))) {
                            warningSums[nodeName].jobs[jobId][warningName] = 0;
                        }
                        if (warnings[nodeName].jobs[jobId][warningName]) {
                            warningSums[nodeName].jobs[jobId][warningName]++
                        }
                        // Convert count into boolean
                        if (j === warningDataIndex.length) {
                            warningSums[nodeName].jobs[jobId][warningName] = (warningSums[nodeName].jobs[jobId][warningName] > threshold)
                        }
                    }
                }
            }
        }
        return warningSums // Has been converted from counts into booleans
    }

    getTimeMachine() {
        return(
            <TimeMachine
                history = {this.state.history}
                clickLoadTime = {(time) => this.fetchTime(time)}
                snapshotTime = {this.state.snapshotTime}
                freeze = {() => this.freeze()}
                unfreeze = {() => this.unfreeze()}
            />
        )
    }

    freeze() {
        this.setState({holdSnap: true});
    }

    unfreeze() {
        this.setState({holdSnap: false},
            () => this.fetchLatest()
        );
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
                        <div id="header-right">
                        </div>
                    </div>
                </header>
                {this.getTimeMachine()}
                {this.show()}

            </div>
        );

    }
}

export default App;
