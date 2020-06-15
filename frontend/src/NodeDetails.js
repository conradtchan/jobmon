import React from "react";
import JobText from "./JobText"
import PropChart from "./PropChart"

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

export default class NodeDetails extends React.Component {
    getCorePies () {
        // Cores belonging to selected job
        let jobCores = [];
        if (!(this.props.selectedJobId === null)) {
            const jobLayout = this.props.jobs[this.props.selectedJobId].layout;
            if (jobLayout.hasOwnProperty(this.props.name)) {
                jobCores = jobLayout[this.props.name];
            }
        }
        let corePies = [];
        for (let i = 0; i < this.props.node.cpu.coreC.length; i++) {
            const core = this.props.node.cpu.coreC[i];
            let coreSelected = false;
            if (!(jobCores === null) ) {
                coreSelected = jobCores.includes(i);
            }

            corePies.push(
                <CorePie
                    key = {i}
                    type = 'cpu'
                    data = {[
                        {name: 'user', data: core[this.props.cpuKeys['user']] + core[this.props.cpuKeys['nice']]},
                        {name: 'wait', data: core[this.props.cpuKeys['wait']]},
                        {name: 'system', data: core[this.props.cpuKeys['system']]},
                        {name: 'idle', data: core[this.props.cpuKeys['idle']]}
                    ]}
                    selected = {coreSelected}
                />
            )

        }
        return corePies
    }

    getWarnings() {
        let warningText = [];
        if (Object.keys(this.props.warnings).length > 0) {
            if (this.props.warnings[this.props.name].node.swapUse) {
                warningText.push('Heavy use of disk swap')
            }
            for (let jobId in this.props.warnings[this.props.name].jobs) {
                const jobWarns = this.props.warnings[this.props.name].jobs[jobId];
                if (jobWarns['cpuUtil']) {
                    warningText.push(`Job ${jobId} under-utilizes requested CPUs`)
                }
                if (jobWarns['cpuWait']) {
                    warningText.push(`Job ${jobId} spends significant time waiting`)
                }
            }
        }

        let warningList = [];
        if (warningText.length > 0) {
            for (let w of warningText) {
                warningList.push(
                    <div key={w} className='bad-job'>
                        Warning: {w}
                    </div>
                )
            }
        }
        return warningList
    }

    getOtherJobList() {
        let otherJobList = [];

        for (let jobId in this.props.jobs) {
            if (this.props.jobs[jobId].layout.hasOwnProperty(this.props.name)) {
                if (!(this.props.jobs[jobId].username === this.props.username)) {
                    let warnJob = false;
                    if (Object.keys(this.props.warnings).length > 0) {
                        warnJob = this.props.warnings[this.props.name].jobs.hasOwnProperty(jobId);
                    }
                    otherJobList.push(
                        <div key={jobId} className = "cohab-job" onClick={() => this.props.onJobClick(jobId)}>
                            <JobText
                                key={jobId}
                                id={jobId}
                                job={this.props.jobs[jobId]}
                                warn={warnJob}
                            />
                        </div>
                    )
                }

            }
        }
        return otherJobList
    }

    getHistoryChart() {
        let historyChart = [];

        let sortedHistory = this.props.historyData;
        sortedHistory.sort((a, b) => (a.timestamp < b.timestamp ) ? -1 : (a.timestamp  > b.timestamp) ? 1 : 0);

        for (let data of sortedHistory) {
            const nodeData = data.nodes[this.props.name];

            let jobMem = 0.0
            if (data.jobs[this.props.selectedJobId].mem.hasOwnProperty(this.props.name)) {
                jobMem = data.jobs[this.props.selectedJobId].mem[this.props.name]
            }

            const d = new Date(data.timestamp * 1000);
            let x = {
                time: data.timestamp,
                timeString: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0'),
                user: nodeData.cpu.totalC[this.props.cpuKeys['user']] + nodeData.cpu.totalC[this.props.cpuKeys['nice']] ,
                system: nodeData.cpu.totalC[this.props.cpuKeys['system']],
                wait: nodeData.cpu.totalC[this.props.cpuKeys['wait']],
                mem: nodeData.mem.used * 1048576, // mb
                job_mem: jobMem * 1024, // kb
                swap: (nodeData.swap.total - nodeData.swap.free) * 1024, // kb
                infiniband_in: nodeData.infiniband.bytes_in,
                infiniband_out: nodeData.infiniband.bytes_out,
                infiniband_pkts_in: nodeData.infiniband.pkts_in,
                infiniband_pkts_out: nodeData.infiniband.pkts_out,
                lustre_read: nodeData.lustre.read,
                lustre_write: nodeData.lustre.write,
            };
            for (let i = 0; i < nodeData.nGpus; i++) {
                const gpuName = 'gpu' + i.toString();
                x[gpuName] = nodeData.gpus[gpuName]
            }
            historyChart.push(x);
        }
        return historyChart
    }

    getGpuNames() {
        let gpuNames = [];
        for (let i = 0; i < this.props.node.nGpus; i++) {
                const gpuName = 'gpu' + i.toString();
                gpuNames.push(gpuName);
            }
        return gpuNames
    }

    getPropCharts(historyChart, gpuNames) {
        const style = getComputedStyle(document.documentElement);

        return(
            <div className='prop-charts'>
                <PropChart
                    name = 'CPU total'
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
                <PropChart
                    name = 'Memory'
                    data = {historyChart}
                    dataKeys = {['mem']}
                    colors = {[
                        style.getPropertyValue('--piecolor-mem'),
                    ]}
                    unit = 'B'
                    dataMax = {this.props.node.mem.total * 1048576}
                    stacked = {false}
                />
                <PropChart
                    name = 'Swap'
                    data = {historyChart}
                    dataKeys = {['swap']}
                    colors = {[
                        style.getPropertyValue('--piecolor-wait'),
                    ]}
                    unit = 'B'
                    dataMax = {this.props.node.swap.total * 1024}
                    stacked = {false}
                />
                <PropChart
                    name = 'GPU'
                    data = {historyChart}
                    dataKeys = {gpuNames}
                    colors = {[
                        style.getPropertyValue('--piecolor-gpu'),
                    ]}
                    unit = '%'
                    dataMax = {100}
                    stacked = {false}
                />
                <PropChart
                    name = 'InfiniBand traffic'
                    data = {historyChart}
                    dataKeys = {['infiniband_in', 'infiniband_out']}
                    colors = {[
                        style.getPropertyValue('--piecycle-1'),
                        style.getPropertyValue('--piecycle-2'),
                    ]}
                    unit = 'B/s'
                    dataMax = 'dataMax'
                    stacked = {false}
                />
                <PropChart
                    name = 'InfiniBand packet rate'
                    data = {historyChart}
                    dataKeys = {['infiniband_pkts_in', 'infiniband_pkts_out']}
                    colors = {[
                        style.getPropertyValue('--piecycle-3'),
                        style.getPropertyValue('--piecycle-4'),
                    ]}
                    unit = '/s'
                    dataMax = 'dataMax'
                    stacked = {false}
                />
                <PropChart
                    name = 'Lustre access'
                    data = {historyChart}
                    dataKeys = {['lustre_read', 'lustre_write']}
                    colors = {[
                        style.getPropertyValue('--piecycle-1'),
                        style.getPropertyValue('--piecycle-2'),
                    ]}
                    unit = 'B/s'
                    dataMax = 'dataMax'
                    stacked = {false}
                />
            </div>
        )
    }

    getJobPropCharts(historyChart) {
        const style = getComputedStyle(document.documentElement);
        return(
            <div className='prop-charts'>
                <PropChart
                    name = 'CPU'
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
                <PropChart
                    name = 'Memory'
                    data = {historyChart}
                    dataKeys = {['job_mem']}
                    colors = {[
                        style.getPropertyValue('--piecolor-mem'),
                    ]}
                    unit = 'B'
                    stacked = {false}
                />
            </div>
        )
    }

    render () {
        const corePies = this.getCorePies();

        const historyChart = this.getHistoryChart();
        const gpuNames = this.getGpuNames();

        const warningList = this.getWarnings();
        const otherJobList = this.getOtherJobList();

        return (
            <div className="main-item right">
                <div id='nodename-title'>
                    {this.props.name}
                </div>
                {warningList}

                <div>
                    <input type="radio" id="5h" name="timeWindow" value="5h" onChange={() => this.props.changeTimeWindow(18000)}/>
                    <label htmlFor="5h"> 5 hours   </label>
                    <input type="radio" id="1h" name="timeWindow" value="1h" onChange={() => this.props.changeTimeWindow(3600)}/>
                    <label htmlFor="1h"> 1 hour   </label>
                    <input type="radio" id="10m" name="timeWindow" value="10m" onChange={() => this.props.changeTimeWindow(600)} defaultChecked/>
                    <label htmlFor="10m"> 10 minutes   </label>
                </div>

                <div className="heading">
                    Job rseource usage
                </div>

                {this.getJobPropCharts(historyChart)}

                <div className="heading">
                    Node resource usage
                </div>
                <div>
                    CPU cores
                </div>
                <div className='core-grid'>
                    {corePies}
                </div>

                {this.getPropCharts(historyChart, gpuNames)}

                {(otherJobList.length > 0) &&

                <div>
                    <div className='job-names heading'>
                        Cohabitant jobs
                    </div>
                    <div>
                        {otherJobList}
                    </div>
                </div>
                }
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
                            // isAnimationActive={false}
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
                            innerRadius='120%'
                            outerRadius='150%'
                            startAngle={90}
                            endAngle={450}
                            fill="#222222"
                            paddingAngle={0}
                            // isAnimationActive={false}
                            stroke="none"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        )
    }
}