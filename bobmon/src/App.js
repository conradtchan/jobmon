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


const xmlToJSON = require('xmltojson');

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
        userStrings.sort((a, b) => (a.username < b.username ) ? -1 : (a.username  > b.username) ? 1 : 0);

        let userStringsLeft = [];
        let userStringsRight = [];
        for (let i=0; i<userStrings.length/2; i++) {
            userStringsLeft.push(userStrings[i])
        }
        for (let i=userStrings.length/2; i<userStrings.length; i++) {
            userStringsRight.push(userStrings[i])
        }

        return (
            <div className='main-item left'>
                Select a user to view detailed system usage.
                <UsagePie
                    usagePieData={this.props.usagePieData}
                    usedFraction={this.props.usedFraction}
                    idleFraction={this.props.idleFraction}
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
        for (let nodeName in this.props.cpuUsage) {
            if (
                (this.props.userList.hasOwnProperty(this.props.username)) &&
                (this.props.userList[this.props.username].includes(nodeName))
            ) {
                nodePies.push(
                    <NodePieRow
                        key={nodeName}
                        selectedUser={this.props.username}
                        jobNames={this.props.jobList[nodeName]}
                        nodeName={nodeName}
                        multiNodeJobLink={this.state.jobIdLink}
                        jobMouseEnter={(jobId) => this.setState({jobIdLink: jobId})}
                        cpuUser={this.props.cpuUsage[nodeName]['user']}
                        cpuSystem={this.props.cpuUsage[nodeName]['system']}
                        cpuWait={this.props.cpuUsage[nodeName]['wait']}
                        cpuIdle={this.props.cpuUsage[nodeName]['idle']}
                        mem={this.props.mem[nodeName]['mem']}
                        disk={(this.props.disk[nodeName] == null) ? 0 : this.props.disk[nodeName]['disk']}
                        gpu={(this.props.gpu[nodeName] == null) ? 0 : this.props.gpu[nodeName]['gpu']}
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
        for (let jobName in this.props.jobNames) {
            // Highlight jobs that span multiple nodes
            let link = '';
            if (this.props.jobNames[jobName].jobId === this.props.multiNodeJobLink) {
                link = 'job-name link'
            } else {
                link = 'job-name'
            }
            if (this.props.jobNames[jobName].user === this.props.selectedUser) {
                userJobList.push(
                    <div
                        key={index}
                        className={link}
                        onMouseOver={() => this.props.jobMouseEnter(this.props.jobNames[jobName].jobId)}
                    >
                        ({this.props.jobNames[jobName].count}) {jobName}
                    </div>
                );
            } else {
                otherJobList.push(
                    <div
                        key={index}
                        className={link}
                        onMouseOver={() => this.props.jobMouseEnter(this.props.jobNames[jobName].jobId)}
                    >
                        ({this.props.jobNames[jobName].count}) {jobName}
                    </div>
                );
            }
            index++
        }

        return (
            <div className='pie-row items'>
                <div className="node-name">
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
    constructor(props) {
        super(props);
    }

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

        function PieLabel({viewBox, value1, value2}) {
            const {cx, cy} = viewBox;
            return (
                <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                    <tspan alignmentBaseline="middle" x={cx} fontSize="48">{value1}</tspan>
                    <tspan alignmentBaseline="middle" x={cx} dy="1.5em" fontSize="22">{value2}</tspan>
                </text>
            )
        }

        return (
            <div>
            <ResponsiveContainer width='100%' minWidth={400} minHeight={400}>
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
                        startAngle={90 + (360 * this.props.idleFraction)}
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
                                value1={`${(this.props.usedFraction * 100).toFixed(0)}%`}
                                value2='core utilization'
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
        const jsonData = xmlToJSON.parseString(testData)
        this.setState({
            data: jsonData,
            gotData: true,
        })
    }

    fetchData() {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4 && xhr.status === 200) {
                const jsonData = xmlToJSON.parseString(xhr.responseText);
                console.log(jsonData);
                this.setState({
                    data: jsonData,
                    gotData: true,
                })
            }
        };
        console.log('opening');
        xhr.open("GET", "../cgi-bin/catBobData", true);
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
        const cpuUsage = this.getCpuUsage();
        const mem = this.getMem();
        const disk = this.getDisk();
        const gpu = this.getGPU();

        const jobData = this.parseJobArray(
            JSON.parse(
                this.state.data.bobMonData[0].jobs[0]._text
            )
        );

        let userList = {};
        let jobList = {};
        for (let i in jobData) {
            if (!(jobData[i].username in userList)) {
                userList[jobData[i].username] = []
            }
            for (let j in jobData[i].nodeList) {
                // If user is using node
                if (!(jobData[i].nodeList[j] in userList[jobData[i].username])) {
                    userList[jobData[i].username].push(jobData[i].nodeList[j])
                }
                // If job is on node
                if (!(jobData[i].nodeList[j] in jobList)) {
                    jobList[jobData[i].nodeList[j]] = {}
                }
                // Count cores
                if (!(jobList[jobData[i].nodeList[j]].hasOwnProperty(jobData[i].jobLine[1]))) {
                    jobList[jobData[i].nodeList[j]][jobData[i].jobLine[1]] = {
                        count: 0,
                        jobId: jobData[i].jobId,
                        user: jobData[i].username,
                    }

                }
                jobList[jobData[i].nodeList[j]][jobData[i].jobLine[1]].count++
            }
        }

        if (this.state.username === null) {
            return (<div className="main-item right" />)
        } else {
            return (
                <NodePieRows
                    username={this.state.username}
                    cpuUsage={cpuUsage}
                    userList={userList}
                    jobList={jobList}
                    mem={mem}
                    disk={disk}
                    gpu={gpu}
                />
            )
        }
    }

    printSystemUsage() {
        if (this.state.gotData) {
            const usageData = this.getSystemUsage()
            const percentCpu = 100 * usageData.pbs_running_cores / usageData.pbs_avail_cores
            const percentGpu = 100 * usageData.pbs_running_gpus  / usageData.pbs_avail_gpus
            return (
                <div>
                    <div>
                        CPU usage: {percentCpu.toFixed(0)}% ({usageData.pbs_running_cores}/{usageData.pbs_avail_cores})
                    </div>
                    <div>
                        GPU usage: {percentGpu.toFixed(0)}% ({usageData.pbs_running_gpus}/{usageData.pbs_avail_gpus})
                    </div>
                </div>
            )
        }
    }

    getSystemUsage() {
        const usageArray = JSON.parse(
            this.state.data.bobMonData[0].usage[0]._text
        );
        let usageData = {};
        for (let i = 0; i < usageArray.length; i += 2) {
            usageData[usageArray[i]] = usageArray[i + 1]
        }
        return usageData
    }

    printTextStats() {
        const textStats = JSON.parse(
            this.state.data.bobMonData[0].text[0].stats[0]._text
        )
            .split('_br_');

        return (
            <div>
                {
                    textStats.map(
                        (line, index) =>
                            <div key={index}>
                                {line}
                            </div>
                    )
                }
            </div>
        )
    }

    getCpuUsage() {
        const cpuData = JSON.parse(
            this.state.data.bobMonData[0].cpuBar[0]._text
        );
        let cpuUsage = {};

        for (let i=0; i<cpuData.length; i++) {
            const [nodeName, measure] = cpuData[i][0].split('_');
            if (!(cpuUsage.hasOwnProperty(nodeName))) {
                cpuUsage[nodeName] = {}
            }
            if (measure === 'i') {
                cpuUsage[nodeName]['idle'] = cpuData[i][1]
            } else if (measure === 's') {
                cpuUsage[nodeName]['system'] = cpuData[i][1]
            } else if (measure === 'u') {
                cpuUsage[nodeName]['user'] = cpuData[i][1]
            } else if (measure === 'w') {
                cpuUsage[nodeName]['wait'] = cpuData[i][1]
            }
        }
        return cpuUsage

    }

    getMem() {
        const memData = JSON.parse(
            this.state.data.bobMonData[0].cpuBar[0]._text
        );
        let mem = {};

        for (let i=0; i<memData.length; i++) {
            const [nodeName] = memData[i][0].split('_');
            if (!(mem.hasOwnProperty(nodeName))) {
                mem[nodeName] = {}
            }
            mem[nodeName]['mem'] = memData[i][1]
        }
        return mem
    }

    getDisk() {
        const diskData = JSON.parse(
            this.state.data.bobMonData[0].disk[0]._text
        );
        let disk = {};

        for (let i=0; i<diskData.length; i++) {
            const [nodeName] = diskData[i][0].split('_');
            if (!(disk.hasOwnProperty(nodeName))) {
                disk[nodeName] = {}
            }
            disk[nodeName]['disk'] = diskData[i][1]
        }
        return disk
    }

    getGPU() {
        const gpuData = JSON.parse(
            this.state.data.bobMonData[0].gpuloads[0]._text
        );
        let gpu = {};

        for (let i=0; i<gpuData.length; i++) {
            const [nodeName] = gpuData[i][0].split('_');
            if (!(gpu.hasOwnProperty(nodeName))) {
                gpu[nodeName] = {}
            }
            gpu[nodeName]['gpu'] = gpuData[i][1]
        }
        return gpu
    }

    getUserUsage() {
        const jobData = this.parseJobArray(
            JSON.parse(
                this.state.data.bobMonData[0].jobs[0]._text
            )
        );

        let usageCount = {};
        for (let i=0; i<jobData.length; i++) {
            const username = jobData[i].username
            if (!(usageCount.hasOwnProperty(username))) {
                usageCount[username] = {
                    cpus: 0,
                    jobs: [],
                }
            }
            usageCount[username].cpus += jobData[i].nCpus
            if (!(usageCount[username].jobs.includes(jobData[i].jobId))) {
                usageCount[username].jobs += jobData[i].jobId
            }
        }

        let totalRunning = 0
        for (let username in usageCount) {
            totalRunning += usageCount[username].cpus
            usageCount[username].jobs = usageCount[username].jobs.length
        }

        if (totalRunning !== this.getSystemUsage().pbs_running_cores) {
            console.log('Mismatch in number of used cores')
        }

        return usageCount
    }

    getUserPiePlot() {
        let usageCount = this.getUserUsage();
        const systemUsage = this.getSystemUsage();
        let usagePieData = [];

        let i = 0;
        for (let username in usageCount) {
            i++;
            usagePieData.push({
                index:    i,
                username: username,
                cpus:     usageCount[username].cpus,
                jobs:     usageCount[username].jobs,
                percent:  (100 * usageCount[username].cpus / systemUsage.pbs_avail_cores).toFixed(0),
            })
        }
        usagePieData.sort((a, b) => a.cpus - b.cpus);

        const idleCount = systemUsage.pbs_avail_cores - systemUsage.pbs_running_cores;
        const idleFraction = idleCount / systemUsage.pbs_avail_cores;
        const usedFraction = systemUsage.pbs_running_cores / systemUsage.pbs_avail_cores;

        return (
            <UserPiePlot
                usagePieData={usagePieData}
                usedFraction={usedFraction}
                idleFraction={idleFraction}
                updateUsername={(name) => this.setState({username: name})}
            />
        )

    }


    showData() {
        if (this.state.gotData) {
            return (
                <div>
                    {/*{this.printSystemUsage()}*/}
                    {this.printTextStats()}
                    {this.renderPlots()}
                </div>
            )
        }
    }

    render() {

        // const pieData = [{name: 'Group A', value: 400}, {name: 'Group B', value: 300},
        //               {name: 'Group C', value: 300}, {name: 'Group D', value: 200}];

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
                    <button onClick={() =>this.fetchData()}>
                        Fetch data
                    </button>
                </div>

                {this.showData()}

            </div>
        );

    }
}

export default App;
