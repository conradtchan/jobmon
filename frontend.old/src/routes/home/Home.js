import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Button, PageHeader,} from 'react-bootstrap';

import {testData} from "./data";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
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

class NodePie extends React.Component {
  render() {
    const data = [
      {name: 'user', data: this.props.cpuUser},
      {name: 'wait', data: this.props.cpuWait},
      {name: 'system', data: this.props.cpuSystem},
      {name: 'idle', data: this.props.cpuIdle},
      ]

    const pieColors = ['#DDDDDD','#BF2B1A','#637AFF','#17852D'];

    return (
      <div id='flex-item'>
        <PieChart width={50} height={50}>
          <Pie
            data={data}
            nameKey='name'
            dataKey='data'
            innerRadius={10}
            outerRadius={20}
            startAngle={90}
            endAngle={450}
          >
            {
              data.map(
                (entry, index) => <Cell
                key={index}
                fill={pieColors[index]}
                />
              )
            }
          </Pie>
        </PieChart>
      </div>
    )
  }
}

class UsagePie extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 1,
    };
  }

  onPieMouseEnter(data, index) {
    this.setState({
      activeIndex: index,
    });
  }

  renderActiveShape(props) {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value } = props;
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius*0.98}
          outerRadius={outerRadius*1.02}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
      </g>
    )
  }

  render() {
    const pieColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    function PieLabel({viewBox, value1, value2}) {
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
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              activeIndex={this.state.activeIndex}
              activeShape={this.renderActiveShape}
              data={this.props.usagePieData}
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
              startAngle={90 + (360 * this.props.idleFraction)}
              endAngle={450}
              onClick={(data,index) => this.props.onPieClick(data,index)}
              onMouseEnter={(data,index) => this.onPieMouseEnter(data,index)}
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
                width={30}
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

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      gotData: false,
      username: null,
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
        {this.getUserPiePlot()}
        {this.getNodeOverview()}
      </div>
    )
  }

  filterNodePies(data,index) {
    this.setState(
      {
        username: data.name
      }
    )
  }

  getNodeOverview() {
    const cpuUsage = this.getCpuUsage();

    const jobData = this.parseJobArray(
      JSON.parse(
        this.state.data.bobMonData[0].jobs[0]._text
      )
    );

    let userList = {}
    for (let i in jobData) {
      if (!(jobData[i].username in userList)) {
        userList[jobData[i].username] = []
      }
      for (let j in jobData[i].nodeList) {
        if (!(jobData[i].nodeList[j] in userList[jobData[i].username])) {
          userList[jobData[i].username].push(jobData[i].nodeList[j])
        }
      }
    }

    let nodePies = [];
    for (let nodeName in cpuUsage) {
      if ((this.state.username === null) || (userList[this.state.username].includes(nodeName))) {
        nodePies.push(
          <NodePie
            key={nodeName}
            nodeName={nodeName}
            cpuUser={cpuUsage[nodeName]['user']}
            cpuSystem={cpuUsage[nodeName]['system']}
            cpuWait={cpuUsage[nodeName]['wait']}
            cpuIdle={cpuUsage[nodeName]['idle']}
          />
        )
      }
    }

    return(
      <div id='flex-container'>
        {nodePies}
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

  getCpuUsage() {
    const cpuData = JSON.parse(
      this.state.data.bobMonData[0].cpuBar[0]._text
    );
    let cpuUsage = [];

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

    return (
      <UsagePie
        usagePieData={usagePieData}
        usedFraction={usedFraction}
        idleFraction={idleFraction}
        onPieClick={(data,index) => this.filterNodePies(data,index)}
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
