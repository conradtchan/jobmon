import React from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    ComposedChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
} from 'recharts';

export default class TimeMachine extends React.Component {
    render () {

        if (this.props.history === null) return null;

        let data = [];
        let i = 0;
        for (let time in this.props.history) {
            if (i % 3 === 0) {
                const d = new Date(time * 1000);
                data.push({
                    time: time,
                    timeString: d.toLocaleTimeString('en-AU', {timeZone: 'australia/Melbourne'}),
                    running: this.props.history[time].running,
                    avail: this.props.history[time].avail
                })
            }
            i++
        }

        return (
            <div>
                <div className='instruction'>
                    Click on a point in time.
                </div>
                <ResponsiveContainer width='100%' height={100}>
                    <ComposedChart
                        data={data}
                        barCategoryGap={0}
                    >
                        <XAxis dataKey="timeString"/>
                        <YAxis/>
                        {/*<Tooltip/>*/}
                        <Line type='monotone' dataKey='avail' stroke='#82ca9d' fill='#EEEEEE' />
                        {/*<Line type='monotone' dataKey='running' stroke='#8884d8' fill='#8884d8'*/}
                            {/*onClick={() => console.log('clicked')}*/}
                        {/*/>*/}
                        <Bar
                            dataKey='running'
                            fill='#8884d8'
                            onClick={(obj, index) => this.props.clickLoadTime(data[index].time)}
                        />

                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        )
    }
}