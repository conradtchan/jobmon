import React from 'react';
import logo from './logo.png';
import './App.css';

import {testData} from "./data";

import NodeDetails from "./NodeDetails"
import NodePieRows from "./NodeOverview"
import UserPiePlot from "./UserPiePlot"
import TimeMachine from "./TimeMachine"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            apiData: null,
            gotData: false,
            username: null,
            nodeName: null,
            job: null,
            warnings: null,
            snapshotTime: new Date(0),
            holdSnap: false,
            history: null,
            briefHistory: [],
            briefHistoryWindow: 3600 // seconds
        };

        this.fetchHistory();
        this.fetchLatest();
    }

    initBriefHistory() {
        if (this.state.briefHistory.length < 3) {
            const observerNow = this.state.snapshotTime / 1000;

            // Add a bunch of values
            for (let time in this.state.history) {
                if (observerNow - time < this.state.briefHistoryWindow) {
                    // Make request for snapshot, then push to list
                    let xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4 && xhr.status === 200) {
                            const jsonData = JSON.parse(xhr.responseText);
                            this.state.briefHistory.push(jsonData)
                        }
                    };
                    xhr.open("GET", "../cgi-bin/bobdata.py?time=" + time.toString(), true);
                    xhr.send();
                }
            }
        }
    }

    updateBriefHistory() {
        const observerNow = this.state.snapshotTime / 1000;

        let newBriefHistory = [];
        let times = [];
        for (let data of this.state.briefHistory) {
            if (observerNow - data.timestamp < this.state.briefHistoryWindow) {
                newBriefHistory.push(data);
                times.push(data.timestamp)
            }
        }

        // Add newest snapshot
        if ( !(times.includes(this.state.apiData.timestamp)) && !(this.state.apiData === null) ) {
            newBriefHistory.push(this.state.apiData)
        }

        // Update, before putting past values in (if history is too short)
        this.setState({briefHistory: newBriefHistory}, () => this.initBriefHistory())
    }

    fetchHistory() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                if (xhr.responseText[0] === '<') {
                    console.log('Using sample history');
                    this.setState({
                        history: {
                            0: {avail: 10, running: 6},
                            100: {avail: 15, running: 3},
                            200: {avail: 15, running: 11},
                            300: {avail: 15, running: 8}
                        }
                    });
                } else {
                    const jsonData = JSON.parse(xhr.responseText);
                    this.setState(
                        {history: jsonData.history}
                    );
                }
            }
        };
        xhr.open("GET", "../cgi-bin/bobhistory.py", true);
        xhr.send();
    }

    fetchLatest() {
        // Only update if the user doesn't want to hold onto a snap
        if (!(this.state.holdSnap)) {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    if (xhr.responseText[0] === '<') {
                        console.log('Using sample data');
                        this.setState({
                            apiData: testData,
                            gotData: true,
                        })
                    } else {
                        const jsonData = JSON.parse(xhr.responseText);
                        this.cleanState(jsonData);
                        this.setState({
                            apiData: jsonData,
                            snapshotTime: new Date(jsonData.timestamp * 1000),
                            gotData: true,
                        }, () => this.updateBriefHistory());
                        console.log(jsonData)
                        setTimeout(() => {this.fetchLatest()}, 10000)
                    }
                }
            };
            xhr.open("GET", "../cgi-bin/bobdata.py", true);
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
                    }, () => this.updateBriefHistory());
                }
            };
            xhr.open("GET", "../cgi-bin/bobdata.py?time=" + time.toString(), true);
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
        this.setState({nodeName: node, job: null})
    }

    getNodeOverview(warnings) {
        const jobs = this.state.apiData.jobs;

        let userOnNode = {};
        let nodeHasJob = {};
        // For each job
        for (let jobId in jobs) {
            // If job is running
            if (jobs[jobId].state === 'RUNNING') {
                // For each host that the job is running on
                for (let host in jobs[jobId].layout) {
                    // Add this node to the list of nodes used by user
                    const username = jobs[jobId].username;
                    if (!(userOnNode.hasOwnProperty(username))) {
                        userOnNode[username] = [];
                        // If this node hasn't been added already
                    }
                    if (!(host in userOnNode[username])) {
                        userOnNode[username].push(host)
                    }

                    // Add this job to the node
                    if (!(nodeHasJob.hasOwnProperty(host))) {
                        nodeHasJob[host] = []
                    }
                    nodeHasJob[host].push({
                        jobId: jobId,
                        username: username,
                        nodeLayout: jobs[jobId].layout[host],
                        jobName: jobs[jobId].name,
                    })
                }
            }
        }

        if (this.state.username === null) {
            return (<div className="main-item center"/>)
        } else {
            return (
                <NodePieRows
                    username={this.state.username}
                    nodeData={this.state.apiData.nodes}
                    userOnNode={userOnNode}
                    nodeHasJob={nodeHasJob}
                    onRowClick={(node) => this.selectNode(node)}
                    warnings={warnings}
                />
            )
        }
    }

    selectJob(jobId) {
        this.setState({job: jobId})
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
                    data={this.state.apiData}
                    briefHistory={this.state.briefHistory}
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
            if (nodes[host].inSlurm) {
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

    generateWarnings() {
        const warnSwap = 20; // If swap greater than
        const warnWait = 10; // If waiting more than
        const warnUtil = 90; // If CPU utilisation below

        let warnings = {};

        for (let nodeName in this.state.apiData.nodes) {
            const node = this.state.apiData.nodes[nodeName];
            warnings[nodeName] = {node: {}, jobs: {}};

            warnings[nodeName].node['cpuWait'] = (node.cpu.total.wait > warnWait);
            warnings[nodeName].node['swapUse'] = (100 * ((node.swap.total - node.swap.free) / node.swap.total) > warnSwap);
        }

        for (let jobId in this.state.apiData.jobs) {
            const job = this.state.apiData.jobs[jobId];
            if (job.state === 'RUNNING') {
                for (let nodeName in job.layout) {
                    const node = this.state.apiData.nodes[nodeName];
                    warnings[nodeName].jobs[jobId] = {}
                    // Crude check to see if underutilized - doesn't work if other jobs are on node
                    if (node.cpu.total.user * node.nCpus / job.layout[nodeName].length < warnUtil) {
                        warnings[nodeName].jobs[jobId]['cpuUtil'] = true
                    }

                }
            }
        }
        return warnings
    }

    getTimeMachine() {
        return(
            <TimeMachine
                history = {this.state.history}
                clickLoadTime = {(time) => this.fetchTime(time)}
                snapshotTime = {this.state.snapshotTime}
            />
        )
    }

    freeze() {
        this.setState({holdSnap: true});
    }

    unfreezeLatest() {
        this.setState({holdSnap: false},
            () => this.fetchLatest()
        );
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    {/*<h1 className="App-title">System monitor</h1>*/}
                </header>
                {this.getTimeMachine()}
                {this.show()}

            </div>
        );

    }
}

export default App;
