import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
} from 'recharts';

export default class NodePieRows extends React.Component {
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
            if (
                (this.props.userOnNode.hasOwnProperty(this.props.username)) &&
                (this.props.userOnNode[this.props.username].includes(nodeName))
            ) {
                // CPU percent is only out of the requested cores
                let userCores = [];
                for (let job of this.props.nodeHasJob[nodeName]) {
                    if (job.username === this.props.username) {
                        for (let core of job.nodeLayout) {
                            if (!(userCores.includes(core))) {
                                userCores.push(core)
                            }
                        }
                    }
                }
                let cpuUsage = {user: 0, system: 0, wait: 0, idle: 0};
                for (let i of userCores) {
                    cpuUsage.user   += this.props.nodeData[nodeName].cpu.core[i].user;
                    cpuUsage.system += this.props.nodeData[nodeName].cpu.core[i].system;
                    cpuUsage.wait   += this.props.nodeData[nodeName].cpu.core[i].wait;
                    cpuUsage.idle   += this.props.nodeData[nodeName].cpu.core[i].idle;

                }
                cpuUsage.user   /= userCores.length;
                cpuUsage.system /= userCores.length;
                cpuUsage.wait   /= userCores.length;
                cpuUsage.idle   /= userCores.length;

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
                        multiNodeJobLink={this.state.jobIdLink}
                        jobMouseEnter={(jobId) => this.setState({jobIdLink: jobId})}
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

        return (
            <div className="main-item center">
                <div id='username-title'>
                    {this.props.username}
                </div>
                <div className='heading'>
                    CPU usage legend:
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
                        {nodePies}
                    </div>
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
