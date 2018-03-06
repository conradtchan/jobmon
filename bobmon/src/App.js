import React from 'react';
import logo from './logo.svg';
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
        this.props.updateUsername(name)
        this.setState({usagePieSelectedIndex: index})
    }

    render() {
        let userStrings = [];
        for (let user of this.props.usagePieData) {
            userStrings.push(
                <UserString
                    key={user.index}
                    index={user.index}
                    hoveredIndex={this.state.usagePieActiveIndex}
                    username={user.username}
                    percent={user.percent}
                    jobs={user.jobs}
                    mouseEnter={() => this.updateActive(user.index)}
                    mouseLeave={() => this.restoreSelected()}
                    onClick={() => this.updateUsername(user.index, user.username)}
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
                Select a user to view detailed system usage.

                X jobs queued for X cpu/h (X machine/h)
                <UsagePie
                    usagePieData={this.props.usagePieData}
                    runningCores={this.props.runningCores}
                    availCores={this.props.availCores}
                    onPieClick={(data,index) => this.updateUsername(index,data.name)}
                    onMouseEnter={(data,index) => this.updateActive(index)}
                    onMouseLeave={(data,index) => this.restoreSelected()}
                    activeIndex={this.state.usagePieActiveIndex}
                    activeSectorSize={this.state.activeSectorSize}
                />
                <div id="user-strings">
                    <div id="user-strings-col">
                        {userStringsLeft}
                    </div>
                    <div id="user-strings-col">
                        {userStringsRight}
                    </div>
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
                        cpuUser={this.props.nodeData[nodeName].cpu.user}
                        cpuSystem={this.props.nodeData[nodeName].cpu.system}
                        cpuWait={this.props.nodeData[nodeName].cpu.wait}
                        cpuIdle={this.props.nodeData[nodeName].cpu.idle}
                        mem={memPercent}
                        disk={diskPercent}
                        gpu={gpuPercent}
                        gangliaURL={this.props.gangliaURL}
                    />
                )
            }
        }

        return (
            <div className="main-item right">
                <div id='username-title'>
                    {this.props.username}
                </div>
                <div>
                    Mouseover jobs to highlight multi-node jobs (if any)
                </div>
                <div id='node-pies'>
                    <div className='pie-row headings'>
                        <div className='node-name heading'>Node</div>
                        <div className='node-pie heading'>CPU</div>
                        <div className='node-pie heading'>Mem</div>
                        <div className='node-pie heading'>Disk</div>
                        <div className='node-pie heading'>GPU</div>
                        <div className='job-names heading'>User Jobs</div>
                        <div className='job-names heading'>Cohabitant Jobs</div>
                    </div>
                    {nodePies}
                </div>
            </div>
        )
    }
}

class NodePieRow extends React.Component {
    render() {
        let userJobList = [];
        let otherJobList = [];
        let index = 0;
        for (let job of this.props.jobs) {
            // Highlight jobs that span multiple nodes
            let link = '';
            if (job.jobId === this.props.multiNodeJobLink) {
                link = 'job-name link'
            } else {
                link = 'job-name'
            }

            if (job.username === this.props.selectedUser) {
                userJobList.push(
                    <div
                        key={index}
                        className={link}
                        onMouseOver={() => this.props.jobMouseEnter(job.jobId)}
                    >
                        ({job.count}) {job.jobName}
                    </div>
                );
            } else {
                otherJobList.push(
                    <div
                        key={index}
                        className={link}
                        onMouseOver={() => this.props.jobMouseEnter(job.jobId)}
                    >
                        ({job.count}) {job.jobName}
                    </div>
                );
            }
            index++
        }

        const gangliaLink = this.props.gangliaURL.replace('%h', this.props.nodeName)

        return (
            <div className='pie-row items'>
                <div className="node-name">
                    <a href={gangliaLink}>
                        {this.props.nodeName}
                    </a>
                </div>
                <NodePie
                    type='cpu'
                    data={[
                        {name: 'user', data: this.props.cpuUser},
                        {name: 'wait', data: this.props.cpuWait},
                        {name: 'system', data: this.props.cpuSystem},
                        {name: 'idle', data: this.props.cpuIdle},
                    ]}
                />
                <NodePie
                    type='mem'
                    data={[
                        {name: 'mem', data: this.props.mem},
                        {name: 'free', data: 100 - this.props.mem},
                    ]}
                />
                <NodePie
                    type='disk'
                    data={[
                        {name: 'disk', data: this.props.disk},
                        {name: 'free', data: 100 - this.props.disk},
                    ]}
                />
                <NodePie
                    type='gpu'
                    data={[
                        {name: 'gpu', data: this.props.gpu},
                        {name: 'free', data: 100 - this.props.gpu},
                    ]}
                />
                <div className="job-names">
                    {userJobList}
                </div>
                <div className="job-names">
                    {otherJobList}
                </div>
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
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}

class UserString extends React.Component {
    render() {
        let nameHovered = '';
        if (this.props.index === this.props.hoveredIndex) {
            nameHovered += 'user-string hovered'
        } else {
            nameHovered += 'user-string'
        }
        return (
            <div
                className={nameHovered}
                onMouseEnter={this.props.mouseEnter}
                onMouseLeave={this.props.mouseLeave}
                onClick={this.props.onClick}
            >
                <div className="user-string-username">
                    {this.props.username}
                </div>
                <div className="user-string-percent">
                    {this.props.percent}%
                </div>
                <div className="user-string-jobs">
                    ({this.props.jobs} jobs)
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

        // function pieMouseLeave() {
        //
        // }

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

        return (
            <div>
            <ResponsiveContainer width='100%' minWidth={0} minHeight={400}>
                <PieChart>
                    <Pie
                        activeIndex={this.props.activeIndex}
                        activeShape={(props) => this.renderActiveShape(props)}
                        data={this.props.usagePieData}
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
                            this.props.usagePieData.map(
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
        };
    }

    sampleData() {
        this.setState({
            apiData: testData,
            gotData: true,
        })
    }

    // fetchData() {
    //     let xhr = new XMLHttpRequest();
    //     xhr.onreadystatechange = () => {
    //         if (xhr.readyState === 4 && xhr.status === 200) {
    //             const jsonData = xmlToJSON.parseString(xhr.responseText);
    //             this.setState({
    //                 data: jsonData,
    //                 // gotData: true,
    //             })
    //         }
    //     };
    //     xhr.open("GET", "../cgi-bin/catBobData", true);
    //     xhr.send();
    //
    //     this.fetchAPI()
    // }

    fetchAPI() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonData = JSON.parse(xhr.responseText);
                this.setState({
                    apiData: jsonData,
                    // data: jsonData,
                    gotData: true,
                })
            }
        };
        xhr.open("GET", "../cgi-bin/catBobData2", true);
        xhr.send();
    }

    parseJobArray(jobArray) {
        let jobData = [];
        for (let i=0; i < jobArray.length; i++) {
            jobData.push({
                jobId:        jobArray[i][0],
                username:     jobArray[i][1],
                group:        jobArray[i][2],
                nodeList:     jobArray[i][3],
                jobLine:      jobArray[i][4],
                mem:          jobArray[i][5][0],
                vmem:         jobArray[i][5][1],
                nCpus:        jobArray[i][5][2],
                nNodes:       jobArray[i][5][3],
                cpuTime:      jobArray[i][5][4],
                wallTime:     jobArray[i][5][5],
                wallLimit:    jobArray[i][5][6],
                parallelEff:  jobArray[i][5][7],
                jobState:     jobArray[i][5][8],
                nodeReqLine:  jobArray[i][5][9],
            })
        }
        return jobData
    }

    renderPlots() {
        return (
            <div id='main-box'>
                {this.getUserPiePlot()}
                {this.getNodeOverview()}
            </div>
        )
    }

    getNodeOverview() {
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
            return (<div className="main-item right"/>)
        } else {
            return (
                <NodePieRows
                    username={this.state.username}
                    nodeData={this.state.apiData.nodes}
                    userOnNode={userOnNode}
                    nodeHasJob={nodeHasJob}
                    gangliaURL={this.state.apiData.gangliaURL}
                />
            )
        }
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

    getUserUsage() {
        let usageCount = {};
        const jobs = this.state.apiData.jobs;

        for (let jobId in jobs) {
            const username = jobs[jobId].username;
            if (!(usageCount.hasOwnProperty(username))) {
                usageCount[username] = {
                    cpus: 0,
                    jobs: 0,
                }
            }
            if (jobs[jobId].state === 'RUNNING') {
                usageCount[username].cpus += jobs[jobId].nCpus;
                usageCount[username].jobs += 1
            }
        }

        return usageCount
    }

    getUserPiePlot() {
        let usageCount = this.getUserUsage();
        const systemUsage = this.getSystemUsage();
        let usagePieData = [];

        for (let username in usageCount) {
            usagePieData.push({
                username: username,
                cpus:     usageCount[username].cpus,
                jobs:     usageCount[username].jobs,
                percent:  (100 * usageCount[username].cpus / systemUsage.availCores).toFixed(0),
            })
        }

        usagePieData.sort((a, b) => a.cpus - b.cpus);
        for (let i=0; i<usagePieData.length; i++) {
            usagePieData[i]['index'] = i
        }

        return (
            <UserPiePlot
                usagePieData={usagePieData}
                runningCores = {systemUsage.runningCores}
                availCores = {systemUsage.availCores}
                updateUsername={(name) => this.setState({username: name})}
            />
        )

    }


    showData() {
        if (this.state.gotData) {
            console.log(this.state.apiData)
            return (
                <div>
                    {/*{this.printSystemUsage()}*/}
                    {/*{this.printTextStats()}*/}
                    {this.renderPlots()}
                </div>
            )
        }
    }

    render() {
        return (

            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <h1 className="App-title">OzSTAR bobMonitor</h1>
                </header>

                <div>
                    <button onClick={() => this.sampleData()}>
                        Use sample data
                    </button>
                    <button onClick={() =>this.fetchAPI()}>
                        Fetch data
                    </button>
                </div>

                {this.showData()}

            </div>
        );

    }
}

export default App;
