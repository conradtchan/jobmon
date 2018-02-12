import React, {PropTypes} from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import {Button, PageHeader,} from 'react-bootstrap';

const data = require('./data');
const xmlToJSON = require('xmltojson');

import s from './Home.css';

const title = 'Sb Admin React';

// Convert the data from xml to json

import {
  Tooltip,
  XAxis, YAxis, Area,
  CartesianGrid, AreaChart, Bar, BarChart,
  ResponsiveContainer
} from '../../vendor/recharts';


class Home extends React.Component {
  // constructor(props, context)
  // {
  //   super(props, context);
  //   //this.props = props;
  //   //this.context = context;
  // }
  render() {

    let values = [];
    try {
      console.log("A")
      const json = xmlToJSON.parseString(data.data);
      console.log("B")
      const cpuValues = JSON.parse(json.bobMonData[0].cpuBar[0]._text)
      console.log("C")
      cpuValues.forEach((v) => {
        values.push({
          name: v[0],
          uv: v[1],
          amt: v[1]
        })
      });
    }
    catch(e) {}

    const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 0},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

    console.log(values);

    return (
      <div>
        <div className="row">
          <div className="col-lg-12">
            <PageHeader>Dashboard</PageHeader>
          </div>
        </div>

        <div>
          <ResponsiveContainer width="100%" aspect={2}>
            <BarChart data={data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
              {/*<CartesianGrid stroke="#ccc"/>*/}
              {/*<XAxis dataKey="name"/>*/}
              {/*<YAxis/>*/}
              {/*<Tooltip/>*/}
              <Bar dataKey="uv" stackId="1" fill="#8884d8"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }
}

//Hello.contextTypes = {setTitle: PropTypes.func.isRequired};

export default withStyles(s)(Home);
