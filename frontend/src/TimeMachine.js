import React from "react";

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    Line,
    XAxis,
    // Area,
    Tooltip,
} from 'recharts';

export default class TimeMachine extends React.Component {
    render () {

        if (this.props.history === null) return null;

        let data = [];
        let i = 0;
        for (let time in this.props.history) {
            if (i % 6 === 0) {
                const d = new Date(time * 1000);
                data.push({
                    time: time,
                    timeString: d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0') ,
                    running: this.props.history[time].running,
                    free: this.props.history[time].avail - this.props.history[time].running
                })
            }
            i++
        }

        return (
            <div id='timeline'>
                <ResponsiveContainer width='100%' height={100}>
                    <ComposedChart
                        data={data}
                        barCategoryGap={0}
                        barGap={0}
                    >
                        <XAxis dataKey="timeString"/>
                        {/*<Line type='monotone' dataKey='avail' stroke='#82ca9d' fill='#EEEEEE' />*/}
                        <Bar
                            dataKey='running'
                            fill='#8884d8'
                            stackId="a"
                            // fillOpacity={0}
                            onClick={(obj, index) => this.props.clickLoadTime(data[index].time)}
                        />
                        <Bar
                            dataKey='free'
                            fill='#82ca9d'
                            stackId="a"
                            // fillOpacity={0}
                            onClick={(obj, index) => this.props.clickLoadTime(data[index].time)}
                        />
                        <Tooltip/>
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        )
    }
}