import React from "react";

import {
    ResponsiveContainer,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    BarChart,
} from 'recharts';

export default class Backfill extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tMaxRes: 7*24*3600 // Max reservable time
        }
    }    

    timeString(num) { 
        if (num === this.state.tMaxRes/60) {
            return 'Unlimited'
        } else {
            const hours = Math.floor(num / 60);  
            const minutes = num % 60;
            return `${hours}:${("0"+minutes).slice(-2)}`;  
        }
               
    }

    render() {
        let backfillCharts = []
        for (const partition of Object.keys(this.props.backfillData).sort()) {
            // If not empty
            if (Object.keys(this.props.backfillData[partition]).length > 0) {
                let data = [];
                let count = {}
                for (let cores in this.props.backfillData[partition]) {
                    let tMax = this.props.backfillData[partition][cores].tMax;
                    let tMin = this.props.backfillData[partition][cores].tMin;
                    if (tMax == null) {
                        tMax = this.state.tMaxRes
                    }
                    if (tMin == null) {
                        tMin = tMax
                    }

                    data.push({
                        cores: cores,
                        shortest: tMin,
                        longest: tMax,
                    })
                    count[cores] = this.props.backfillData[partition][cores].count
                }

                let unit = "-core"
                if (Object.keys(this.props.backfillData[partition]).length > 6) {
                    unit = ""
                }
                

                backfillCharts.push(
                    <div key={partition}>
                        {partition}
                        <ResponsiveContainer width="100%" height={100}>
                            <BarChart 
                                data={data} 
                                layout='horizontal'
                                barSize={20}
                                barGap={0}
                            >
                                <XAxis dataKey="cores" unit={unit} interval={0}/>
                                <YAxis hide={true} type="number" domain={[0, this.state.tMaxRes/(24*7)*8]} allowDataOverflow={true} />
                                <Tooltip
                                    labelFormatter={(cores) => cores + ' cores (' + count[cores] + ' slots)'}
                                    formatter={(value) => this.timeString(value/60)}
                                />
                                <Bar dataKey="shortest" fill='#8884d8' />
                                <Bar dataKey="longest" fill='#82ca9d' />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )
            }
        }


        return (
            <div className='main-item center-right'>
                <div className="heading">
                    Available Resources
                </div>
                <div className='instruction'>
                    Jobs times shorter than the longest slot (mouseover) may be able to start instantly, subject to memory constraints.
                    <br /> 
                    <br /> 
                </div>
                {backfillCharts}

            </div>
        )
    }
}