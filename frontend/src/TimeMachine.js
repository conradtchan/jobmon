import React from "react";

import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
} from 'recharts';

export default class TimeMachine extends React.Component {
    render () {

        if (this.props.history === null) return null;

        let data = [];
        for (let time in this.props.history) {
            data.push({time: time, usage: this.props.history[time]})
        }

        return (
            <div>
                <ResponsiveContainer width='100%' height={100}>
                    <AreaChart
                        data={data}
                    >
                        <XAxis dataKey="time"/>
                        <YAxis/>
                        <Area type='monotone' dataKey='usage' stroke='#8884d8' fill='#8884d8' />

                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
    }
}