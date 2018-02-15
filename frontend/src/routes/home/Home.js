import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Button, PageHeader,} from 'react-bootstrap';

import {testData} from "./data";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
  Label,
} from 'recharts';


const xmlToJSON = require('xmltojson');

import s from './Home.css';

const title = 'Sb Admin React';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      gotData: false,
    };
  }

  fetchData() {
    const jsonData = xmlToJSON.parseString(testData)
    this.setState({
      data: jsonData,
      gotData: true,
    })
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
      <div>
        {/*<div>*/}
          {/*{this.getCpuPlot()}*/}
        {/*</div>*/}
        <div>
          {this.getUserPiePlot()}
        </div>
      </div>
    )
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

  getCpuPlot() {
    return (
      <div>
        <BarChart width={600} height={300} data={this.getCpuUsage()}
            margin={{top: 5, right: 30, left: 20, bottom: 5}}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <CartesianGrid strokeDasharray="3 3"/>
       <Tooltip/>
       <Legend />
       <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
      </div>
    );
  }

  getCpuUsage() {
    const cpuData = JSON.parse(
      this.state.data.bobMonData[0].cpuBar[0]._text
    );
    let cpuUsage = [];
    cpuData.forEach((v) => {
      cpuUsage.push({
        name: v[0],
        value: v[1],
      })
    });

    cpuUsage.sort(
      function (a, b) {
        return a.name.localeCompare(b.name);
      }
    );

    return cpuUsage

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
      throw 'Mismatch in number of used cores'
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
        percent:  (100 * usageCount[username].cpus / systemUsage.pbs_avail_cores).toFixed(0),
      })
    }
    usagePieData.sort((a, b) => a.cpus - b.cpus);

    const idleCount = systemUsage.pbs_avail_cores - systemUsage.pbs_running_cores
    const idleFraction = idleCount / systemUsage.pbs_avail_cores
    const usedFraction = systemUsage.pbs_running_cores / systemUsage.pbs_avail_cores

    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    function PieLabel({viewBox, value1, value2}){
      const {cx, cy} = viewBox;
      return (
         <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
            <tspan alignmentBaseline="middle" x={cx} fontSize="64">{value1}</tspan>
            <tspan alignmentBaseline="middle" x={cx} dy="1.5em" fontSize="26">{value2}</tspan>
         </text>
      )
    }

    return (
      <div>
        <PieChart width={800} height={400}>
          <Pie
            data={usagePieData}
            nameKey='username'
            dataKey='cpus'
            label={({username, percent, jobs})=>`${username} ${percent}% (${jobs} jobs)`}
            labelLine={false}
            // cx={400}
            // cy={400}
            innerRadius={150}
            outerRadius={180}
            fill="#8884d8"
            paddingAngle={2}
            startAngle={90 + (360 * idleFraction)}
            endAngle={450}
          >
            {
              usagePieData.map(
                (entry, index) => <Cell
                  key={index}
                  fill={pieColors[index % pieColors.length]}
                />
              )
            }
            <Label width={30} position="center"
              content={<PieLabel
                value1={`${(usedFraction * 100).toFixed(0)}%`}
                value2='CPU'
              />}>
            </Label>
          </Pie>
        </PieChart>
      </div>
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
      <div>
        <div className="row">
          <div className="col-lg-12">
            <PageHeader>Dashboard</PageHeader>
          </div>
        </div>

        <div>
          <button onClick={() => this.fetchData()}>
            Fetch data!
          </button>
        </div>

        {this.showData()}

      </div>
    );

  }
}

//Hello.contextTypes = {setTitle: PropTypes.func.isRequired};

export default withStyles(s)(Home);
