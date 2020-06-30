import React from "react";

import {
    ResponsiveContainer,
    Tooltip,
    AreaChart,
    Area,
    XAxis,
    YAxis,
} from 'recharts';

export default class PropChart extends React.Component {
    scaledData () {
        // Determine unit scaling
        let maxVal = 0;
        let dataMax = this.props.dataMax;

        if (dataMax === parseInt(dataMax, 10)) {
            maxVal = parseInt(dataMax, 10)
        } else {
            for (let i = 0; i < this.props.data.length; i++) {
                for (let key of this.props.dataKeys) {
                    if (this.props.data[i][key] > maxVal) {
                        maxVal = this.props.data[i][key]
                    }
                }
            }
        }
        let factor;
        let scale;
        let thresh = 1;
        if (maxVal > thresh * 1073741824) {
            factor =  1073741824;
            scale = 'G';
        } else if (maxVal > thresh * 1048576) {
            factor = 1048576;
            scale = 'M'
        } else if (maxVal > thresh * 1024) {
            factor = 1024;
            scale = 'K';
        } else {
            factor = 1;
            scale = '';
        }

        // Scale max
        if ((dataMax === parseInt(dataMax, 10)) && !(this.props.unit === '%')) {
            dataMax = Math.floor(dataMax / factor)
        }

        // Set number of digits
        let digits = 0;
        if (maxVal / factor < 10) {
            digits = 1;
        }

        // Scale all data
        let scaledData = [];
        for (let i = 0; i < this.props.data.length; i++) {
            scaledData.push({});
            for (let key of this.props.dataKeys) {
                scaledData[i][key] = (this.props.data[i][key] / factor).toFixed(digits)
            }
            // Time for X Axis
            scaledData[i]['time'] = this.props.data[i].time;
            scaledData[i]['timeString'] = this.props.data[i].timeString;
        }

        return {scaledData: scaledData, dataMax: dataMax, scale: scale}
    }

    getAreas (scale) {
        let items = [];

        // Make areas
        for (let i = 0; i < this.props.dataKeys.length; i++) {
            if (this.props.lineOnly[i]) {
                items.push(
                    <Area
                        key={this.props.dataKeys[i]}
                        type='monotone'
                        nameKey='time'
                        dataKey={this.props.dataKeys[i]}
                        stroke={this.props.colors[i]}
                        fillOpacity={0}
                        strokeDasharray="5 5"
                        stackId= {this.props.stacked ? "2" : i}
                        isAnimationActive={false}
                        unit={scale + this.props.unit}
                    />
                )
            } else {
                items.push(
                    <Area
                        key={this.props.dataKeys[i]}
                        type='monotone'
                        nameKey='time'
                        dataKey={this.props.dataKeys[i]}
                        stroke={this.props.colors[i]}
                        fill={this.props.colors[i]}
                        stackId= {this.props.stacked ? "1" : i}
                        isAnimationActive={false}
                        unit={scale + this.props.unit}
                    />
                )
            }
        }

        return items
    }

    render () {

        const d = this.scaledData();
        const areas = this.getAreas(d.scale);

        return (
            <div className="prop-chart-group">
                <div>
                    {this.props.name}
                </div>
                <div className="prop-chart">
                    <ResponsiveContainer>
                        <AreaChart
                            data={d.scaledData}
                        >
                            <XAxis
                                hide = {true}
                                label = 'time'
                                dataKey = 'timeString'
                            />
                            <YAxis
                                width={80}
                                orientation='right'
                                padding={{ top: 5, bottom: 5 }}
                                type="number"
                                domain={[0, d.dataMax]}
                                unit={d.scale + this.props.unit}
                                interval={0}
                            />
                            {areas}
                            <Tooltip/>
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        )
    }
}

export class PropChartMini extends PropChart {
    render () {

        const d = this.scaledData();
        const areas = this.getAreas(d.scale);

        return (
            <div className="prop-chart-mini">
                <ResponsiveContainer>
                    <AreaChart
                        data={d.scaledData}
                        cursor="pointer"
                    >
                        {areas}
                        <XAxis
                            hide = {true}
                            label = 'time'
                            dataKey = 'timeString'
                        />
                        <YAxis
                            hide = {true}
                            domain={[0, d.dataMax]}
                        />
                        <Tooltip/>
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )
    }
}