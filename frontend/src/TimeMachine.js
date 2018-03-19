import React from "react";

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    XAxis,
    Tooltip,
} from 'recharts';

export default class TimeMachine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            timeAgo: 0,
        };
        this.getTimeAgo();
    }
    timeString(time) {
        if (time < 60) {
            return time.toFixed(0) + ' seconds'
        } else if (time < 3600) {
            return (time / 60).toFixed(0) + ' minutes'
        } else if (time < 86400) {
            return (time / 3600).toFixed(0) + ' hours'
        } else {
            return (time / 86400).toFixed(0) + ' days'
        }

    }

    getTimeAgo() {
        if (!(this.props.snapshotTime === null)) {
            this.setState({timeAgo: ((new Date() - this.props.snapshotTime) / 1000).toFixed(0)});
            setTimeout(() => {this.getTimeAgo()}, 1000);
        }
    }

    render () {

        if (this.props.history === null) {
            return(
                <div id="time-machine">
                    <div className="loader"></div>
                </div>
            )
        }

        let data = [];
        let i = 0;
        const nBars = 100;
        const nSkip = parseInt((Object.keys(this.props.history).length / nBars).toFixed(0), 10);
        for (let time in this.props.history) {
            if (i % nSkip === 0) {
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
            <div id="time-machine">
                <div>
                    <div>
                    Showing data from
                    </div>
                    <div id='clock'>
                        {this.props.snapshotTime.toTimeString()}
                    </div>
                    <div>
                        ({this.timeString(parseInt(this.state.timeAgo, 10))} ago)
                    </div>
                </div>
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
                <div>
                    <button onClick={() => this.props.freeze()}>Freeze</button>
                    <button onClick={() => this.props.unfreeze()}>Load latest</button>
                </div>
            </div>
        )
    }
}