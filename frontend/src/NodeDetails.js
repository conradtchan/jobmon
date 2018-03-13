import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Label,
} from 'recharts';

export default class NodeDetails extends React.Component {
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

            // const coreTotal = core.user + core.wait + core.system + core.idle;
            if (i < this.props.node.cpu.core.length / 2){
                corePiesLeft.push(
                    <CorePie
                        key = {i}
                        type = 'cpu'
                        data = {[
                            {name: 'user', data: core.user},
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
                            {name: 'user', data: core.user},
                            {name: 'wait', data: core.wait},
                            {name: 'system', data: core.system},
                            {name: 'idle', data: core.idle}
                        ]}
                        selected = {coreSelected}
                    />
                )
            }

        }

        let propPies = [];
        propPies.push(
            <PropPie
                key = 'mem'
                type = 'mem'
                textDescription='mem'
                textValue={(this.props.node.mem.used / 1024).toFixed(0) + 'GB'} // mb->gb
                data = {[
                    {name: 'used', data: this.props.node.mem.used},
                    {name: 'total', data: this.props.node.mem.total - this.props.node.mem.used},
                ]}
            />
        );
        propPies.push(
            <PropPie
                key = 'swap'
                type = 'swap'
                textDescription='swap'
                textValue={((this.props.node.swap.total - this.props.node.swap.free) / 1048576).toFixed(0) + 'GB'} // kb->gb
                data = {[
                    {name: 'used', data: this.props.node.swap.total - this.props.node.swap.free},
                    {name: 'total', data: this.props.node.swap.total},
                ]}
            />
        );
        for (let i = 0; i < this.props.node.nGpus; i++) {
            const gpu = 'gpu' + i.toString();
            console.log(gpu);
            const gpuPercent = this.props.node.gpus[gpu];
            propPies.push(
                <PropPie
                    key = {gpu}
                    type = 'gpu'
                    textDescription={gpu}
                    textValue={gpuPercent + '%'} // kb->gb
                    data = {[
                        {name: 'used', data: gpuPercent},
                        {name: 'total', data: 100 - gpuPercent},
                    ]}
            />
            )
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
                <div className="heading">
                    CPU cores
                </div>
                <div className='core-grid'>
                    {corePiesLeft}
                </div>
                <div className='core-grid'>
                    {corePiesRight}
                </div>
                <div className='prop-pies'>
                    {propPies}
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


class CorePie extends React.Component {
    render() {
        const style = getComputedStyle(document.documentElement);
        let pieColors = [];
        pieColors.push(style.getPropertyValue('--piecolor-blank'));
        pieColors.push(style.getPropertyValue('--piecolor-system'));
        pieColors.push(style.getPropertyValue('--piecolor-wait'));
        pieColors.push(style.getPropertyValue('--piecolor-user'));

        let ring = 0;
        if (this.props.selected) ring = 100;

        return (
            <div className='core-pie'>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={this.props.data}
                            nameKey='name'
                            dataKey='data'
                            innerRadius='0%'
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
                            innerRadius='100%'
                            outerRadius='120%'
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

class PropPie extends React.Component {
    render() {
        const style = getComputedStyle(document.documentElement);
        let pieColors = [];
        pieColors.push(style.getPropertyValue('--piecolor-blank'));
        if (this.props.type === 'mem') {
            pieColors.push(style.getPropertyValue('--piecolor-mem'));
        } else if (this.props.type === 'swap') {
            pieColors.push(style.getPropertyValue('--piecolor-wait'));
        } else if (this.props.type === 'gpu') {
            pieColors.push(style.getPropertyValue('--piecolor-gpu'));
        }

        function PieLabel({viewBox, value1, value2, value3}) {
            const {cx, cy} = viewBox;
            return (
                <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
                    <tspan alignmentBaseline="middle" x={cx} dy="-0.5em" fontSize="1.0em">{value1}</tspan>
                    <tspan alignmentBaseline="middle" x={cx} dy="1.2em" fontSize="0.8em">{value2}</tspan>
                </text>
            )
        }

        return (
            <div className="prop-pie">
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data = {this.props.data}
                            nameKey = 'name'
                            dataKey = 'data'
                            innerRadius = '70%'
                            outerRadius = '100%'
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
                                    value1={this.props.textDescription}
                                    value2={this.props.textValue}
                                />}
                            >
                        </Label>
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}