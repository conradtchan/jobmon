import React from "react";
import JobText from "./JobText"
import {PropChartMini} from "./PropChart"

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
} from 'recharts';

export default class NodeOverview extends React.Component {
    getNodePies() {
        let nodePies = [];

        // Only these node names have jobs on them
        let nodeNames = Object.keys(this.props.nodeHasJob);
        let nameSorted = [];

        // Sort node names in a sensible way
        let maxNumLen = 0;
        for (let name of nodeNames) {
            const numbers = name.match(/\d/g);
            let index = 0;
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

            if (this.props.username === 'allnodes') {
                // CPU percent is only out of the requested cores
                const cpuUsage = this.props.nodeData[nodeName].cpu.total
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
                    <NodePie
                        key={nodeName}
                        nodeName={nodeName}
                        cpuUsage={cpuUsage}
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

            else if (Object.keys(this.props.nodeHasJob[nodeName]).includes(this.props.jobId)) {
                // CPU percent is only out of the requested cores
                const cpuUsage = this.getNodeUsage(
                    this.props.jobs[this.props.jobId],
                    this.props.nodeData[nodeName],
                    nodeName
                ).cpu;
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
                    <NodePie
                        key={nodeName}
                        nodeName={nodeName}
                        cpuUsage={cpuUsage}
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
        return nodePies
    }

    getWarnedJobs() {
        let warnedJobs = [];
        // For each node in warnings
        for (let nodeName in this.props.warnings) {
            const warnings = this.props.warnings[nodeName];
            // For each job on each node
            over_jobs:
            for (let jobId in warnings.jobs) {
                if (!(warnedJobs.includes(jobId))) {
                    // Job type warnings
                    for (let warning in warnings.jobs[jobId]) {
                        if (warnings.jobs[jobId][warning]) {
                            warnedJobs.push(jobId);
                            continue over_jobs
                        }
                    }

                    // Node type warnings
                    for (let warning in warnings.node) {
                        if (warnings.node[warning]) {
                            warnedJobs.push(jobId);
                            continue over_jobs
                        }
                    }

                }
            }
        }
        return warnedJobs
    }

    getUserJobList() {
        const warnedJobs = this.getWarnedJobs();

        let jobList = {
            running: [],
            pending: [],
            completed: [],
            cancelled: [],
            failed: []
        };

        let userJobs = {};
        let nRunningJobs = 0;
        for (let jobId in this.props.jobs) {
            const job = this.props.jobs[jobId];
            if (job.username === this.props.username) {
                userJobs[jobId] = job;
                if (job.state === 'RUNNING') nRunningJobs++
            }
        }

        for (let jobId in userJobs) {
            const job = userJobs[jobId];
            if (job.state === 'RUNNING') {
                const jobText = (
                <div key={jobId}>
                    <div
                        className = 'running-job-row'
                        onClick={() => this.props.onJobClick(jobId)}
                    >
                        <div className = 'running-job-text'>
                            <JobText
                                id={jobId}
                                job={job}
                                warn={warnedJobs.includes(jobId)}
                            />
                        </div>
                        {((nRunningJobs <= 10) || (jobId === this.props.jobId)) &&
                            <div className='running-job-chart'>
                                {this.getRunningJobChart(job)}
                            </div>
                        }
                    </div>
                    {(jobId === this.props.jobId) &&
                        <div>
                            <div className='instruction'>
                                Select a node to view detailed system usage:
                            </div>
                            <div className='overview-pies'>
                                {this.getNodePies()}
                            </div>
                        </div>
                    }
                </div>
            );
                jobList.running.push(jobText)
            } else {
                const jobText = (
                <div key={jobId} className = 'other-job-row'>
                    <JobText
                        id={jobId}
                        job={job}
                        warn={warnedJobs.includes(jobId)}
                        onClick={() => this.props.onJobClick(jobId)}
                    />
                </div>
            );
                if (job.state === 'PENDING') {
                    jobList.pending.push(jobText)
                } else if (job.state === 'COMPLETED') {
                    jobList.completed.push(jobText)
                } else if (job.state === 'CANCELLED') {
                    jobList.cancelled.push(jobText)
                } else if (job.state === 'FAILED') {
                    jobList.failed.push(jobText)
                }
            }
        }
        return jobList
    }

    getNodeUsage(job, node, host) {
        let usage = {
            cpu: {user: 0, system: 0, wait: 0, idle: 0},
            mem: {used: 0, total: 0},
            infiniband: {bytes_in: 0, bytes_out: 0},
            lustre: {read: 0, write: 0},
            gpu: {total: 0},
        };

        if (job.layout.hasOwnProperty(host)) {
            const layout = job.layout[host];
            for (let i of layout) {
                usage.cpu.user += node.cpu.core[i].user;
                usage.cpu.system += node.cpu.core[i].system;
                usage.cpu.wait += node.cpu.core[i].wait;
                usage.cpu.idle += node.cpu.core[i].idle;
            }
            for (let gpuName in node.gpus) {
                usage.gpu.total += node.gpus[gpuName]
            }
            usage.mem.used          += node.mem.used;
            usage.mem.total         += node.mem.total;
            usage.infiniband.bytes_in     += node.infiniband.bytes_in;
            usage.infiniband.bytes_out    += node.infiniband.bytes_out;
            usage.lustre.read       += node.lustre.read;
            usage.lustre.write      += node.lustre.write;

            const nCores = layout.length;
            usage.cpu.user   /= nCores;
            usage.cpu.system /= nCores;
            usage.cpu.wait   /= nCores;
            usage.cpu.idle   /= nCores;
            usage.gpu.total  /= node.nGpus;
        }

        return usage
    }

    getJobUsage(job, nodes) {
        let usage = {
            cpu: {user: 0, system: 0, wait: 0, idle: 0},
            mem: {used: 0, total: 0},
            infiniband: {bytes_in: 0, bytes_out: 0},
            lustre: {read: 0, write: 0},
            gpu: {total: 0},
        };
        for (let host in job.layout) {
            const nodeUsage = this.getNodeUsage(job, nodes[host], host);
            const nCores = job.layout[host].length;
            usage.cpu.user              += nodeUsage.cpu.user * nCores;
            usage.cpu.system            += nodeUsage.cpu.system * nCores;
            usage.cpu.wait              += nodeUsage.cpu.wait * nCores;
            usage.cpu.idle              += nodeUsage.cpu.idle * nCores;
            usage.mem.used          += nodeUsage.mem.used;
            usage.mem.total         += nodeUsage.mem.total;
            usage.infiniband.bytes_in     += nodeUsage.infiniband.bytes_in;
            usage.infiniband.bytes_out    += nodeUsage.infiniband.bytes_out;
            usage.lustre.read       += nodeUsage.lustre.read;
            usage.lustre.write      += nodeUsage.lustre.write;
            usage.gpu.total         += nodeUsage.gpu.total;
        }

        usage.cpu.user   /= job.nCpus;
        usage.cpu.system /= job.nCpus;
        usage.cpu.wait   /= job.nCpus;
        usage.cpu.idle   /= job.nCpus;
        usage.gpu.total  /= Object.keys(job.layout).length;

        return usage
    }

    getRunningJobChart(job) {
        const style = getComputedStyle(document.documentElement);
        let historyChart = [];

        let sortedHistory = this.props.historyData;
        sortedHistory.sort((a, b) => (a.timestamp < b.timestamp ) ? -1 : (a.timestamp  > b.timestamp) ? 1 : 0);

        const chartRes = 30;
        let nSkip = 1;
        if (chartRes < sortedHistory.length) {
            nSkip = Math.floor(sortedHistory.length / chartRes);
        }
        let i = 0;

        let memTotal = 0;
        for (let data of sortedHistory) {
            i++;
            if (!(i % nSkip === 0)) continue;

            const nodes = data.nodes;
            const usage = this.getJobUsage(job, nodes);
            const d = new Date(data.timestamp * 1000);
            historyChart.push({
                timeString: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'),
                user: usage.cpu.user,
                system: usage.cpu.system,
                wait: usage.cpu.wait,
                mem: usage.mem.used * 1048576, // mb
                infiniband_in: usage.infiniband.bytes_in,
                infiniband_out: usage.infiniband.bytes_out,
                lustre_read: usage.lustre.read,
                lustre_write: usage.lustre.write,
                gpu: usage.gpu.total,
            });
            if (usage.mem.total > memTotal) memTotal = usage.mem.total
        }

        return (
            <div className = 'mini-row'>
                <PropChartMini
                    name = 'Job CPU usage'
                    data = {historyChart}
                    dataKeys = {['user', 'system', 'wait']}
                    colors = {[
                        style.getPropertyValue('--piecolor-user'),
                        style.getPropertyValue('--piecolor-system'),
                        style.getPropertyValue('--piecolor-wait'),
                    ]}
                    unit = '%'
                    dataMax = {100}
                    stacked = {true}
                />
                <PropChartMini
                    name = 'Job Memory usage'
                    data = {historyChart}
                    dataKeys = {['mem']}
                    colors = {[
                        style.getPropertyValue('--piecolor-mem'),
                    ]}
                    unit = 'B'
                    dataMax = {memTotal}
                    stacked = {true}
                />
                <PropChartMini
                    name = 'Job GPU usage'
                    data = {historyChart}
                    dataKeys = {['gpu']}
                    colors = {[
                        style.getPropertyValue('--piecolor-gpu')
                    ]}
                    unit = '%'
                    dataMax = {100}
                    stacked = {true}
                />
                <PropChartMini
                    name = 'Job InfiniBand traffic'
                    data = {historyChart}
                    dataKeys = {['infiniband_in', 'infiniband_out']}
                    colors = {[
                        style.getPropertyValue('--piecycle-1'),
                        style.getPropertyValue('--piecycle-2'),
                    ]}
                    unit = 'B/s'
                    dataMax = 'dataMax'
                    stacked = {true}
                />
                <PropChartMini
                    name = 'Job Lustre access'
                    data = {historyChart}
                    dataKeys = {['lustre_read', 'lustre_write']}
                    colors = {[
                        style.getPropertyValue('--piecycle-1'),
                        style.getPropertyValue('--piecycle-2'),
                    ]}
                    unit = 'B/s'
                    dataMax = 'dataMax'
                    stacked = {true}
                />
            </div>
        )
    }

    render() {
        const jobList = this.getUserJobList();

        const legend = <div id='cpu-legend'>
            <div className='cpu-legend-item'>
                <div className='circle user'>
                    &nbsp;
                </div>
                <div className='cpu-legend-label'>
                    user
                </div>
            </div>
            <div className='cpu-legend-item'>
                <div className='circle system'>
                    &nbsp;
                </div>
                <div className='cpu-legend-label'>
                    sys
                </div>
            </div>
            <div className='cpu-legend-item'>
                <div className='circle wait'>
                    &nbsp;
                </div>
                <div className='cpu-legend-label'>
                    wait
                </div>
            </div>
            <div className='cpu-legend-item'>
                <div className='circle mem'>
                    &nbsp;
                </div>
                <div className='cpu-legend-label'>
                    mem
                </div>
            </div>
            <div className='cpu-legend-item'>
                <div className='circle gpu'>
                    &nbsp;
                </div>
                <div className='cpu-legend-label'>
                    gpu
                </div>
            </div>
        </div>

        if (this.props.username === 'allnodes') {
            return (
                <div className="main-item center">
                    <div className="heading">
                        All non-empty nodes:
                    </div>
                    {legend}
                    <div className='instruction'>
                        Select a node to view detailed system usage
                    </div>
                    <div className='overview-pies'>
                        {this.getNodePies()}
                    </div>
                </div>
            )
        } else {
            return (
                <div className="main-item center">
                    <div id='username-title'>
                        {this.props.username}
                    </div>
                    {legend}

                    <div className='instruction'>
                        Select a running job to view nodes:
                    </div>

                    <div className='job-names heading'>
                        Running
                    </div>
                        {jobList.running}
                    <br />

                    <div className='job-names'>
                        {(jobList.pending.length > 0) &&
                            <div>
                                <div className='job-names heading'>
                                    Pending
                                </div>
                                <div>
                                    {jobList.pending}
                                </div>
                            </div>
                        }
                        {(jobList.completed.length > 0) &&
                            <div>
                                <div className='job-names heading'>
                                    Completed
                                </div>
                                <div>
                                    {jobList.completed}
                                </div>
                            </div>
                        }
                        {(jobList.cancelled.length > 0) &&
                            <div>
                                <div className='job-names heading'>
                                    Cancelled
                                </div>
                                <div>
                                    {jobList.cancelled}
                                </div>
                            </div>
                        }
                        {(jobList.failed.length > 0) &&
                            <div>
                                <div className='job-names heading'>
                                    Failed
                                </div>
                                <div>
                                    {jobList.failed}
                                </div>
                            </div>
                        }
                    </div>
                </div>
            )
        }
    }
}


class NodePie extends React.Component {
    constructor(props) {
        super(props);
        this.state = {expanded: false}
    }

    render() {
        const style = getComputedStyle(document.documentElement);

        const cpuColors = [
            style.getPropertyValue('--piecolor-blank'),
            style.getPropertyValue('--piecolor-system'),
            style.getPropertyValue('--piecolor-wait'),
            style.getPropertyValue('--piecolor-user'),
        ];

        const memColors = [
            style.getPropertyValue('--piecolor-blank'),
            style.getPropertyValue('--piecolor-mem'),
        ];

        const gpuColors = [
            style.getPropertyValue('--piecolor-blank'),
            style.getPropertyValue('--piecolor-gpu'),
        ];

        const data = {
            cpu: [
                {name: 'user', data: this.props.cpuUsage.user},
                {name: 'wait', data: this.props.cpuUsage.wait},
                {name: 'system', data: this.props.cpuUsage.system},
                {name: 'idle', data: this.props.cpuUsage.idle},
            ],
            mem: [
                {name: 'mem', data: this.props.mem},
                {name: 'free', data: 100 - this.props.mem},
            ],
            gpu: [
                {name: 'gpu', data: this.props.gpu},
                {name: 'free', data: 100 - this.props.gpu},
            ],
        };

        // Make label red if warning
        let doWarn = false;
        if (this.props.nodeWarn) {
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
        }
        let nameColor = '';
        if (doWarn) nameColor = style.getPropertyValue('--bad-job-color');

        function PieLabel({viewBox, value1, value2}) {
            const {cx, cy} = viewBox;
            return (
                    <text
                        x={cx}
                        y={cy}
                        fill={nameColor}
                        textAnchor="middle"
                        dominantBaseline="central"
                    >
                        <tspan alignmentBaseline="middle" x={cx} dy="-0.4em" fontSize="12">{value1}</tspan>
                        <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize="12">{value2}</tspan>
                    </text>
            )
        }

        const nodeLetters = this.props.nodeName.replace(/\d+/g, '');
        const nodeNumber = parseInt(this.props.nodeName.match(/\d+$/)[0], 10);

        let dRing = 0;
        if (this.state.expanded) dRing = 10;

        return (
            <div className='overview-pie' onClick={() => this.props.onRowClick(this.props.nodeName)}>
                <ResponsiveContainer>
                    <PieChart
                        onMouseEnter = {() => this.setState({expanded: true})}
                        onMouseLeave = {() => this.setState({expanded: false})}
                        cursor="pointer"
                    >
                        <Pie
                            data = {data.cpu}
                            nameKey='name'
                            dataKey='data'
                            innerRadius={90 + dRing + '%'}
                            outerRadius={110 + dRing + '%'}
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        >
                            <Label
                                position="center"
                                content={<PieLabel
                                    value1={nodeLetters}
                                    value2={nodeNumber}
                                />}>
                            </Label>
                            {
                                data.cpu.reverse().map(
                                    (entry, index) => <Cell
                                        key={index}
                                        fill={cpuColors[index]}
                                    />
                                )
                            }
                        </Pie>
                        <Pie
                            data = {data.mem}
                            nameKey='name'
                            dataKey='data'
                            innerRadius={75 + dRing + '%'}
                            outerRadius={90 + dRing + '%'}
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        >
                            {
                                data.mem.reverse().map(
                                    (entry, index) => <Cell
                                        key={index}
                                        fill={memColors[index]}
                                    />
                                )
                            }
                        </Pie>
                        <Pie
                            data = {data.gpu}
                            nameKey='name'
                            dataKey='data'
                            innerRadius={60 + dRing + '%'}
                            outerRadius={75 + dRing + '%'}
                            startAngle={90}
                            endAngle={450}
                            isAnimationActive={false}
                        >
                            {
                                data.gpu.reverse().map(
                                    (entry, index) => <Cell
                                        key={index}
                                        fill={gpuColors[index]}
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
