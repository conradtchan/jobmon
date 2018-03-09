import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
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
