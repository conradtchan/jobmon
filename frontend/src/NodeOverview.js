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
    constructor(props) {
        super(props);
    }

    getNodePieRows() {
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

            if (Object.keys(this.props.nodeHasJob[nodeName]).includes(this.props.jobId)) {
                // CPU percent is only out of the requested cores
                const cpuUsage = this.getNodeCpuUsage(
                    this.props.jobs[this.props.jobId],
                    this.props.nodeData[nodeName],
                    nodeName
                );
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
        for (let host in this.props.warnings) {
            const warnings = this.props.warnings[host];
            over_jobs:
            for (let jobId in warnings.jobs) {
                if (!(warnedJobs.includes(jobId))) {
                    for (let warning in warnings.jobs[jobId]) {
                        if (warnings.jobs[jobId][warning]) {
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

        for (let jobId in this.props.jobs) {
            const job = this.props.jobs[jobId];
            if (job.username === this.props.username) {
                if (job.state === 'RUNNING') {
                    const jobText = (
                    <div>
                        <div
                            key={jobId}
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
                            <div className = 'running-job-chart'>
                                {this.getRunningJobChart(job)}
                            </div>
                        </div>
                        {(jobId === this.props.jobId) &&
                            <div>
                                <div className='instruction'>
                                    Select a node to view detailed system usage.
                                </div>
                                <div className='overview-pies'>
                                    <div className='overview-header'>
                                        <div className='overview-row'>
                                            <div className='overview-cell'>Node</div>
                                            <div className='overview-cell'>CPU</div>
                                            <div className='overview-cell'>Mem</div>
                                            <div className='overview-cell'>GPU</div>
                                        </div>
                                    </div>
                                    <div className='overview-body'>
                                        {this.getNodePieRows()}
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                );
                    jobList.running.push(jobText)
                } else {
                    const jobText = (
                    <div key={jobId}>
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
        }
        return jobList
    }

    getNodeCpuUsage(job, node, host) {
        let cpuUsage = {user: 0, system: 0, wait: 0, idle: 0};
        if (job.layout.hasOwnProperty(host)) {
            const layout = job.layout[host];
            for (let i of layout) {
                cpuUsage.user   += node.cpu.core[i].user;
                cpuUsage.system += node.cpu.core[i].system;
                cpuUsage.wait   += node.cpu.core[i].wait;
                cpuUsage.idle   += node.cpu.core[i].idle;
            }
            const nCores = layout.length;
            cpuUsage.user   /= nCores;
            cpuUsage.system /= nCores;
            cpuUsage.wait   /= nCores;
            cpuUsage.idle   /= nCores;
        }

        return cpuUsage
    }

    getJobCpuUsage(job, nodes) {
        let cpuUsage = {user: 0, system: 0, wait: 0, idle: 0};
        for (let host in job.layout) {
            const nodeUsage = this.getNodeCpuUsage(job, nodes[host], host);
            const nCores = job.layout[host].length;
            cpuUsage.user += nodeUsage.user * nCores;
            cpuUsage.system += nodeUsage.system * nCores;
            cpuUsage.wait += nodeUsage.wait * nCores;
            cpuUsage.idle += nodeUsage.idle * nCores;
        }

        cpuUsage.user   /= job.nCpus;
        cpuUsage.system /= job.nCpus;
        cpuUsage.wait   /= job.nCpus;
        cpuUsage.idle   /= job.nCpus;

        return cpuUsage
    }

    getRunningJobChart(job) {
        const style = getComputedStyle(document.documentElement);
        let historyChart = [];

        let sortedHistory = this.props.briefHistory;
        sortedHistory.sort((a, b) => (a.timestamp < b.timestamp ) ? -1 : (a.timestamp  > b.timestamp) ? 1 : 0);

        for (let data of sortedHistory) {
            const nodes = data.nodes;
            const usage = this.getJobCpuUsage(job, nodes);
            historyChart.push({
                user: usage.user,
                system: usage.system,
                wait: usage.wait,
            })
        }

        return (
            <PropChartMini
                name = 'Job CPU usage'
                data = {historyChart}
                dataKeys = {['user', 'system', 'wait']}
                colors = {[
                    style.getPropertyValue('--piecolor-user'),
                    style.getPropertyValue('--piecolor-system'),
                    style.getPropertyValue('--piecolor-wait')
                ]}
                unit = '%'
                dataMax = {100}
                stacked = {true}
            />
        )
    }

    render() {
        const nodePies = this.getNodePieRows();
        const jobList = this.getUserJobList();

        return (
            <div className="main-item center">
                <div id='username-title'>
                    {this.props.username}
                </div>
                <div className='instruction'>
                    Select a running job to view nodes.
                </div>
                <div id='cpu-legend'>
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
                            system
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
                </div>

                <div className='job-names heading'>
                    Running:
                </div>
                    {jobList.running}
                <br />

                <div className='job-names'>
                    {(jobList.pending.length > 0) &&
                        <div>
                            <div className='job-names heading'>
                                Pending:
                            </div>
                            <div>
                                {jobList.pending}
                            </div>
                        </div>
                    }
                    {(jobList.completed.length > 0) &&
                        <div>
                            <div className='job-names heading'>
                                Completed:
                            </div>
                            <div>
                                {jobList.completed}
                            </div>
                        </div>
                    }
                    {(jobList.cancelled.length > 0) &&
                        <div>
                            <div className='job-names heading'>
                                Cancelled:
                            </div>
                            <div>
                                {jobList.cancelled}
                            </div>
                        </div>
                    }
                    {(jobList.failed.length > 0) &&
                        <div>
                            <div className='job-names heading'>
                                Failed:
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


class NodePieRow extends React.Component {
    render() {
        let nameClass = 'overview-cell';
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
            <div className='overview-row items' onClick={() => this.props.onRowClick(this.props.nodeName)}>
                <div className={nameClass}>
                    {this.props.nodeName}
                </div>
                <div className='overview-cell'>
                    <NodePie
                        type='cpu'
                        data={[
                            {name: 'user', data: this.props.cpuUsage.user},
                            {name: 'wait', data: this.props.cpuUsage.wait},
                            {name: 'system', data: this.props.cpuUsage.system},
                            {name: 'idle', data: this.props.cpuUsage.idle},
                        ]}
                        warn={this.props.nodeWarn.cpuWait}
                    />
                </div>
                <div className='overview-cell'>
                    <NodePie
                        type='mem'
                        data={[
                            {name: 'mem', data: this.props.mem},
                            {name: 'free', data: 100 - this.props.mem},
                        ]}
                        warn={this.props.nodeWarn.swapUse}
                    />
                </div>
                <div className='overview-cell'>
                    <NodePie
                        type='gpu'
                        data={[
                            {name: 'gpu', data: this.props.gpu},
                            {name: 'free', data: 100 - this.props.gpu},
                        ]}
                        warn={false}
                    />
                </div>
            </div>
        )
    }
}



class NodePie extends React.Component {
    render() {
        const style = getComputedStyle(document.documentElement);
        let pieColors = [];
        pieColors.push(style.getPropertyValue('--piecolor-blank'));
        if (this.props.type === 'cpu') {
            pieColors.push(style.getPropertyValue('--piecolor-system'));
            pieColors.push(style.getPropertyValue('--piecolor-wait'));
            pieColors.push(style.getPropertyValue('--piecolor-user')); // user
        } else if (this.props.type === 'mem') {
            pieColors.push(style.getPropertyValue('--piecolor-mem'));
        } else if (this.props.type === 'disk') {
            pieColors.push(style.getPropertyValue('--piecolor-disk'));
        } else if (this.props.type === 'gpu') {
            pieColors.push(style.getPropertyValue('--piecolor-gpu'));
        }

        let ring = 0;
        if (this.props.warn) ring = 100;


        function PieLabel({viewBox, value1}) {
            const {cx, cy} = viewBox;
            return (
                <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                    <tspan alignmentBaseline="middle" x={cx} dy="0.0em" fontSize="12">{value1}</tspan>
                </text>
            )
        }

        const pieText = (100 - this.props.data[this.props.data.length - 1]['data']).toFixed(0) + '%'; // 100 minus idle

        return (
            <div className='overview-pie'>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={this.props.data}
                            nameKey='name'
                            dataKey='data'
                            innerRadius='75%'
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
                            <Label
                                position="center"
                                content={<PieLabel
                                    value1={pieText}
                                />}>
                            </Label>
                        </Pie>
                        <Pie
                            data={[{name: 'ring', ring: ring}]}
                            nameKey='name'
                            dataKey='ring'
                            innerRadius='100%'
                            outerRadius='120%'
                            startAngle={90}
                            endAngle={450}
                            fill={style.getPropertyValue('--bad-job-color')}
                            paddingAngle={0}
                            isAnimationActive={false}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}
