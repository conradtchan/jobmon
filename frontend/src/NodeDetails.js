import React from "react";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
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
                            innerRadius='100%'
                            outerRadius='130%'
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
