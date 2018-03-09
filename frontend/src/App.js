import React from 'react';
import logo from './logo.png';
import './App.css';

import {testData} from "./data";
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Sector,
    Cell,
    Label,
} from 'recharts';

class NodeDetails extends React.Component {
    render () {
        // Cores belonging to selected job
        let jobCores = [];
        if (!(this.props.selectedJobId === null)) {
            jobCores = this.props.jobs[this.props.selectedJobId].layout[this.props.name]
        }
        let corePiesLeft = [];
        let corePiesRight = [];
        for (let i = 0; i < this.props.node.cpu.core.length; i++) {
            const core = this.props.node.cpu.core[i];
            let coreSelected = false;
            if (!(jobCores === null)) {
                coreSelected = jobCores.includes(i);
            }

            const coreTotal = core.user + core.wait + core.system + core.idle;
            let user = core.user
            // Measurement for user is missing - reconstruct value
            if (coreTotal < 99.0) {
                user = 100.0 - core.wait - core.system - core.idle
            }

            if (i < this.props.node.cpu.core.length / 2){
                corePiesLeft.push(
                    <CorePie
                        key = {i}
                        type = 'cpu'
                        data = {[
                            {name: 'user', data: user},
                            {name: 'wait', data: core.wait},
                            {name: 'system', data: core.system},
                            {name: 'idle', data: core.idle}
                        ]}
                        selected = {coreSelected}
                    />
                )
            } else {
                corePiesRight.push(
                    <CorePie
                        key = {i}
                        type = 'cpu'
                        data = {[
                            {name: 'user', data: user},
                            {name: 'wait', data: core.wait},
                            {name: 'system', data: core.system},
                            {name: 'idle', data: core.idle}
                        ]}
                        selected = {coreSelected}
                    />
                )
            }

        }

        let userJobList = [];
        let otherJobList = [];

        for (let jobId in this.props.jobs) {
            if (this.props.jobs[jobId].layout.hasOwnProperty(this.props.name)) {
                if (this.props.jobs[jobId].username === this.props.username) {
                    userJobList.push(
                        <JobText
                            key={jobId}
                            job={this.props.jobs[jobId]}
                            warn={this.props.warnings[this.props.name].jobs.hasOwnProperty(jobId)}
                            onClick={() => this.props.onJobClick(jobId)}
                        />
                    )
                } else {
                    otherJobList.push(
                        <JobText
                            key={jobId}
                            job={this.props.jobs[jobId]}
                            warn={this.props.warnings[this.props.name].jobs.hasOwnProperty(jobId)}
                            onClick={() => this.props.onJobClick(jobId)}
                        />
                    )
                }

            }
        }

        let warningText = [];
        if (this.props.warnings[this.props.name].node.cpuWait) {
            warningText.push('- Significant CPU time spent waiting for IO')
        }
        if (this.props.warnings[this.props.name].node.swapUse) {
            warningText.push('- Heavy use of disk swap')
        }
        for (let jobId in this.props.warnings[this.props.name].jobs) {
            const jobWarns = this.props.warnings[this.props.name].jobs[jobId];
            if (jobWarns['cpuUtil']) {
                warningText.push('- Job under-utilizes requested CPUs')
            }
        }

        let warningList = [];
        if (warningText.length > 0) {
            for (let w of warningText) {
                warningList.push(
                    <div key={w} className='bad-job'>
                        {w}
                    </div>
                )
            }
        }

        const gangliaLink = this.props.gangliaURL.replace('%h', this.props.name);

        return (
            <div className="main-item right">
                <div id='nodename-title'>
                    {this.props.name}
                </div>
                <div className='core-grid'>
                    {corePiesLeft}
                </div>
                <br />
                <div className='core-grid'>
                    {corePiesRight}
                </div>
                <div id='node-description'>
                </div>
                {warningList}
                <div id='job-names'>
                    <div className='job-names heading'>
                        User jobs:
                    </div>
                    <div>
                        {userJobList}
                    </div>
                </div>
                <br />
                <div>
                    <div className='job-names heading'>
                        Cohabitant jobs:
                    </div>
                    <div>
                        {otherJobList}
                    </div>
                </div>
                <br />
                <div>
                    <a href = {gangliaLink}>
                        Ganglia report
                    </a>
                </div>
            </div>
        )
    }

}

class JobText extends React.Component {
    render () {
        let nameClass = 'job-name';
        // if (this.props.warn) nameClass += ' warn';
        return (
            <div
                className={nameClass}
                onClick={() => this.props.onClick()}
            >
                ({this.props.job.nCpus}) {this.props.job.name} ({this.props.job.state})
            </div>
        )
    }
}

class UserPiePlot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            usagePieActiveIndex: null,
            usagePieSelectedIndex: null,
            activeSectorSize: 'small',
        }
    }

    updateActive(index) {
        this.setState({usagePieActiveIndex: index})
        this.setState({activeSectorSize: 'big'})
    }

    restoreSelected() {
        this.setState({usagePieActiveIndex: this.state.usagePieSelectedIndex})
        this.setState({activeSectorSize: 'small'})
    }

    updateUsername(index,name) {
        this.props.updateUsername(name);
        this.setState({usagePieSelectedIndex: index})
    }

    render() {
        let userStrings = [];
        for (let user of this.props.usageData.running) {
            userStrings.push(
                <UserString
                    key={user.username}
                    user={user}
                    hoveredIndex={this.state.usagePieActiveIndex}
                    mouseEnter={() => this.updateActive(user.index)}
                    mouseLeave={() => this.restoreSelected()}
                    onClick={() => this.updateUsername(user.index, user.username)}
                    warning={this.props.warnedUsers.includes(user.username)}
                />
            )
        }

        let queueStrings = [];
        for (let user of this.props.usageData.queued) {
            queueStrings.push(
                <QueueString
                    key={user.username}
                    user={user}
                />
            )
        }

        userStrings.sort((a, b) => (a.props.username < b.props.username ) ? -1 : (a.props.username  > b.props.username) ? 1 : 0);

        let userStringsLeft = [];
        let userStringsRight = [];
        for (let i = 0; i < userStrings.length; i++) {
            if (i < userStrings.length / 2) {
                userStringsLeft.push(userStrings[i])
            } else {
                userStringsRight.push(userStrings[i])
            }
        }

        return (
            <div className='main-item left'>
                <div className='instruction'>
                    Select a user to view detailed system usage.
                </div>
                <UsagePie
                    runningData={this.props.usageData.running}
                    runningCores={this.props.runningCores}
                    availCores={this.props.availCores}
                    onPieClick={(data,index) => this.updateUsername(index,data.name)}
                    onMouseEnter={(data,index) => this.updateActive(index)}
                    onMouseLeave={(data,index) => this.restoreSelected()}
                    activeIndex={this.state.usagePieActiveIndex}
                    activeSectorSize={this.state.activeSectorSize}
                />
                <div className='bad-job'>
                    Users and nodes with bad jobs are highlighted.
                </div>
                <br />
                <div className="heading">
                    Running:
                </div>
                <div className="user-strings">
                    <div className="user-strings-col">
                        {userStringsLeft}
                    </div>
                    <div className="user-strings-col">
                        {userStringsRight}
                    </div>
                </div>
                <br />
                <div className="heading">
                    Queue: {this.props.queue.size} jobs queued for {this.props.queue.cpuHours} cpu-h ({(this.props.queue.cpuHours / this.props.availCores).toFixed(0)} machine-h)
                </div>
                <div className="queue-strings">
                    {queueStrings}
                </div>
            </div>
        )
    }
}

class NodePieRows extends React.Component {
    constructor(props) {
        super(props);
        this.state = {jobIdLink: null}
    }
    render () {
        let nodePies = [];

        let nodeNames = Object.keys(this.props.nodeData);
        let nameSorted = [];

        // Sort node names in a sensible way
        let maxNumLen = 0;
        for (let name of nodeNames) {
            const numbers = name.match(/\d/g);
            let index = 0
            if (!(numbers === null)) {
                if (numbers.length > maxNumLen) maxNumLen = numbers.length;
                index += parseInt(numbers.join(""), 10)
            }
            nameSorted.push({
                name:       name,
                sortIndex:  name.replace(/\d/g, '') + index.toString().padStart(maxNumLen, "0")
            })
        }
        nameSorted.sort((a, b) => (a.sortIndex < b.sortIndex ) ? -1 : (a.sortIndex  > b.sortIndex) ? 1 : 0);

        for (let ns of nameSorted) {
            const nodeName = ns.name;
            if (
                (this.props.userOnNode.hasOwnProperty(this.props.username)) &&
                (this.props.userOnNode[this.props.username].includes(nodeName))
            ) {
                let memPercent = 0.0;
                if (!(this.props.nodeData[nodeName].mem === null)) {
                    memPercent = 100 * this.props.nodeData[nodeName].mem.used / this.props.nodeData[nodeName].mem.total;
                }
                let diskPercent = 0.0;
                if (!(this.props.nodeData[nodeName].disk === null)) {
                    diskPercent = 100 * (1.0 - this.props.nodeData[nodeName].disk.free / this.props.nodeData[nodeName].disk.total);
                }
                let swapPercent = 0.0;
                if (!(this.props.nodeData[nodeName].swap === null)) {
                    swapPercent = 100 * (1.0 - this.props.nodeData[nodeName].swap.free / this.props.nodeData[nodeName].swap.total);
                }
                let gpuPercent = 0.0;
                if (!(this.props.nodeData[nodeName].gpus === null)) {
                    let nGpus = 0;
                    for (let gpu in this.props.nodeData[nodeName].gpus) {
                        nGpus += 1;
                        gpuPercent += this.props.nodeData[nodeName].gpus[gpu]
                    }
                    gpuPercent /= nGpus;
                }

                nodePies.push(
                    <NodePieRow
                        key={nodeName}
                        selectedUser={this.props.username}
                        jobs={this.props.nodeHasJob[nodeName]}
                        nodeName={nodeName}
                        multiNodeJobLink={this.state.jobIdLink}
                        jobMouseEnter={(jobId) => this.setState({jobIdLink: jobId})}
                        cpuUser={this.props.nodeData[nodeName].cpu.total.user}
                        cpuSystem={this.props.nodeData[nodeName].cpu.total.system}
                        cpuWait={this.props.nodeData[nodeName].cpu.total.wait}
                        cpuIdle={this.props.nodeData[nodeName].cpu.total.idle}
                        mem={memPercent}
                        disk={diskPercent}
                        gpu={gpuPercent}
                        swap={swapPercent}
                        gangliaURL={this.props.gangliaURL}
                        onRowClick={(node) => this.props.onRowClick(node)}
                        nodeWarn={this.props.warnings[nodeName]}
                    />
                )
            }
        }

        return (
            <div className="main-item center">
                <div id='username-title'>
                    {this.props.username}
                </div>
                <div id='node-pies'>
                    <div className='pie-row headings'>
                        <div className='node-name heading'>Node</div>
                        <div className='node-pie heading'>CPU</div>
                        <div className='node-pie heading'>Mem</div>
                        <div className='node-pie heading'>Disk</div>
                        <div className='node-pie heading'>GPU</div>
                    </div>
                    {nodePies}
                </div>
            </div>
        )
    }
}

class NodePieRow extends React.Component {
    render() {
        let nameClass = 'node-name';
        let doWarn = false;
        for (let w in this.props.nodeWarn.node) {
            if (this.props.nodeWarn.node[w]) {
                doWarn = true;
                break
            }
        }
        for (let jobId in this.props.nodeWarn.jobs) {
            for (let w in this.props.nodeWarn.jobs[jobId]) {
                if (this.props.nodeWarn.jobs[jobId][w]) {
                    doWarn = true;
                    break
                }
            }
        }
        if (doWarn) nameClass += ' warn';


        return (
            <div className='pie-row items' onClick={() => this.props.onRowClick(this.props.nodeName)}>
                <div className={nameClass}>
                    {this.props.nodeName}
                </div>
                <NodePie
                    type='cpu'
                    data={[
                        {name: 'user', data: this.props.cpuUser},
                        {name: 'wait', data: this.props.cpuWait},
                        {name: 'system', data: this.props.cpuSystem},
                        {name: 'idle', data: this.props.cpuIdle},
                    ]}
                    warn={this.props.nodeWarn.cpuWait}
                />
                <NodePie
                    type='mem'
                    data={[
                        {name: 'mem', data: this.props.mem},
                        {name: 'free', data: 100 - this.props.mem},
                    ]}
                    warn={this.props.nodeWarn.swapUse}
                />
                <NodePie
                    type='disk'
                    data={[
                        {name: 'disk', data: this.props.disk},
                        {name: 'free', data: 100 - this.props.disk},
                    ]}
                    warn={false}
                />
                <NodePie
                    type='gpu'
                    data={[
                        {name: 'gpu', data: this.props.gpu},
                        {name: 'free', data: 100 - this.props.gpu},
                    ]}
                    warn={false}
                />
            </div>
        )
    }
}

class NodePie extends React.Component {
    render() {
        let pieColors = [];
        pieColors.push('#DDDDDD');
        if (this.props.type === 'cpu') {
            pieColors.push('#637AFF'); // system
            pieColors.push('#BF2B1A'); // wait
            pieColors.push('#17852D'); // user
        } else if (this.props.type === 'mem') {
            pieColors.push('#E5B81F');
        } else if (this.props.type === 'disk') {
            pieColors.push('#3A2CC2');
        } else if (this.props.type === 'gpu') {
            pieColors.push('#9A3FC2')
        }

        let ring = 0;
        if (this.props.warn) {
            ring = 100
        }

        return (
            <div className='node-pie'>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={this.props.data}
                            nameKey='name'
                            dataKey='data'
                            innerRadius='60%'
                            outerRadius='100%'
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        >
                            {
                                this.props.data.reverse().map(
                                    (entry, index) => <Cell
                                        key={index}
                                        fill={pieColors[index]}
                                    />
                                )
                            }
                        </Pie>
                        <Pie
                            data={[{name: 'ring', ring: ring}]}
                            nameKey='name'
                            dataKey='ring'
                            innerRadius='100%'
                            outerRadius='120%'
                            startAngle={90}
                            endAngle={450}
                            fill="#FF0000"
                            paddingAngle={0}
                            isAnimationActive={false}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

class CorePie extends React.Component {
    render() {
        let pieColors = [];
        pieColors.push('#DDDDDD');
        if (this.props.type === 'cpu') {
            pieColors.push('#637AFF'); // system
            pieColors.push('#BF2B1A'); // wait
            pieColors.push('#17852D'); // user
        } else if (this.props.type === 'mem') {
            pieColors.push('#E5B81F');
        } else if (this.props.type === 'disk') {
            pieColors.push('#3A2CC2');
        } else if (this.props.type === 'gpu') {
            pieColors.push('#9A3FC2')
        }

        let ring;
        if (this.props.selected) {
            ring = 100;
        } else {
            ring = 0;
        }


        return (
            <div className='core-pie'>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={this.props.data}
                            nameKey='name'
                            dataKey='data'
                            innerRadius='30%'
                            outerRadius='100%'
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        >
                            {
                                this.props.data.reverse().map(
                                    (entry, index) => <Cell
                                        key={index}
                                        fill={pieColors[index]}
                                    />
                                )
                            }
                        </Pie>
                        {/*Selector ring*/}
                        <Pie
                            data={[{name: 'ring', ring: ring}]}
                            nameKey='name'
                            dataKey='ring'
                            innerRadius='90%'
                            outerRadius='110%'
                            startAngle={90}
                            endAngle={450}
                            fill="#222222"
                            paddingAngle={0}
                            isAnimationActive={false}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}


class UserString extends React.Component {
    render() {
        let nameClass= 'user-string';
        if (this.props.user.index === this.props.hoveredIndex) {
            nameClass += ' hovered'
        }
        if (this.props.warning) {
            nameClass += ' warn'
        }
        return (
            <div
                className={nameClass}
                onMouseEnter={this.props.mouseEnter}
                onMouseLeave={this.props.mouseLeave}
                onClick={this.props.onClick}
            >
                <div className="user-string-username">
                    {this.props.user.username}
                </div>
                <div className="user-string-percent">
                    {this.props.user.percent}%
                </div>
                <div className="user-string-jobs">
                    ({this.props.user.jobs} jobs)
                </div>
            </div>
        )
    }

}


class QueueString extends React.Component {
    render() {
        return (
            <div
                className='queue-string'
            >
                <div className="queue-string-username">
                    {this.props.user.username}
                </div>
                <div className="queue-string-hours">
                    {this.props.user.hours.toFixed(0)} cpu-h
                </div>
                <div className="queue-string-jobs">
                    ({this.props.user.jobs} jobs)
                </div>
            </div>
        )
    }

}


class UsagePie extends React.Component {
    renderActiveShape(props) {
        const { cx, cy, innerRadius, outerRadius, startAngle, endAngle,
            fill } = props;

        let growth = 0.0;
        if (this.props.activeSectorSize === 'small') {
            growth = 0.02
        } else {
            growth = 0.04
        }

        return (
            <g>
                <Sector
                    cx={cx}
                    cy={cy}
                    innerRadius={innerRadius*(1.0 - growth)}
                    outerRadius={outerRadius*(1.0 + growth)}
                    startAngle={startAngle}
                    endAngle={endAngle}
                    fill={fill}
                />
            </g>
        )
    }

    pieMouseEnter(data, index) {
        this.props.onMouseEnter(data, index);
    }

    pieMouseLeave(data, index) {
        this.props.onMouseLeave();
    }

    render() {
        const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

        function PieLabel({viewBox, value1, value2, value3}) {
            const {cx, cy} = viewBox;
            return (
                <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                    <tspan alignmentBaseline="middle" x={cx} fontSize="48">{value1}</tspan>
                    <tspan alignmentBaseline="middle" x={cx} dy="1.5em" fontSize="18">{value2}</tspan>
                    <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize="22">{value3}</tspan>
                </text>
            )
        }

        let pieData = [];
        for (let user of this.props.runningData) {
            pieData.push({
                username: user.username,
                cpus: user.cpus,
            })
        }

        return (
            <div>
            <ResponsiveContainer width='100%' minWidth={0} minHeight={400}>
                <PieChart>
                    <Pie
                        activeIndex={this.props.activeIndex}
                        activeShape={(props) => this.renderActiveShape(props)}
                        data={pieData}
                        nameKey='username'
                        dataKey='cpus'
                        // label={({username, percent, jobs})=>`${username} ${percent}% (${jobs} jobs)`}
                        labelLine={false}
                        // cx={400}
                        // cy={400}
                        innerRadius="60%"
                        outerRadius="70%"
                        fill="#8884d8"
                        paddingAngle={2}
                        startAngle={90 + (360 * (1.0 - (this.props.runningCores / this.props.availCores)))}
                        endAngle={450}
                        onClick={(data,index) => this.props.onPieClick(data,index)}
                        onMouseEnter={(data,index) => this.pieMouseEnter(data,index)}
                        onMouseLeave={(data,index) => this.pieMouseLeave(data,index)}
                    >
                        {
                            this.props.runningData.map(
                                (entry, index) => <Cell
                                    key={index}
                                    fill={pieColors[index % pieColors.length]}
                                />
                            )
                        }
                        <Label
                            // width="50%"
                            position="center"
                            content={<PieLabel
                                value1={`${(this.props.runningCores / this.props.availCores * 100).toFixed(0)}%`}
                                value2={`(${this.props.runningCores} / ${this.props.availCores})`}
                                value3='core utilization'
                            />}>
                        </Label>
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
            </div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: null,
            gotData: false,
            username: null,
            nodeName: null,
            job: null,
            warnings: null,
            lastUpdate: null,
        };
    }

    sampleData() {
        this.setState({
            apiData: testData,
            gotData: true,
        })
    }

    fetchAPI() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonData = JSON.parse(xhr.responseText);
                this.cleanState(jsonData);
                this.setState({
                    apiData: jsonData,
                    lastUpdate: new Date(),
                    gotData: true,
                });
                setTimeout(() => {this.fetchAPI()}, 10000)
            }
        };
        xhr.open("GET", "../cgi-bin/catBobData2", true);
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

    // parseJobArray(jobArray) {
    //     let jobData = [];
    //     for (let i=0; i < jobArray.length; i++) {
    //         jobData.push({
    //             jobId:        jobArray[i][0],
    //             username:     jobArray[i][1],
    //             group:        jobArray[i][2],
    //             nodeList:     jobArray[i][3],
    //             jobLine:      jobArray[i][4],
    //             mem:          jobArray[i][5][0],
    //             vmem:         jobArray[i][5][1],
    //             nCpus:        jobArray[i][5][2],
    //             nNodes:       jobArray[i][5][3],
    //             cpuTime:      jobArray[i][5][4],
    //             wallTime:     jobArray[i][5][5],
    //             wallLimit:    jobArray[i][5][6],
    //             parallelEff:  jobArray[i][5][7],
    //             jobState:     jobArray[i][5][8],
    //             nodeReqLine:  jobArray[i][5][9],
    //         })
    //     }
    //     return jobData
    // }


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
                        count: jobs[jobId].layout[host].length,
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


    showData() {
        if (this.state.gotData) {
            console.log(this.state.apiData);
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
        const warnSwap = 10; // If swap greater than
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

    render() {

        let updateTime;
        if (!(this.state.lastUpdate === null)) {
            updateTime = (
                <div>
                    Last updated {this.state.lastUpdate.toTimeString()}
                </div>
            )
        }

        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">System monitor</h1>
                </header>

                <div>
                    <button onClick={() => this.sampleData()}>
                        Use sample data
                    </button>
                    <button onClick={() =>this.fetchAPI()}>
                        Fetch data
                    </button>
                </div>

                {updateTime}

                {this.showData()}

            </div>
        );

    }
}

export default App;
