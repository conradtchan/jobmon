import React from 'react';

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
      showTimeMachine: false,
      firstLoad: true,
      selected: false,
      period: 'present',
    };
  }

  componentDidMount() {
    this.getTimeAgo();
  }

  timeString(time) {
    if (time < 60) {
      return `${time.toFixed(0)} seconds`;
    } if (time < 120) {
      return `${(time / 60).toFixed(0)} minute`;
    } if (time < 3600) {
      return `${(time / 60).toFixed(0)} minutes`;
    } if (time < 7200) {
      return `${(time / 3600).toFixed(0)} hour`;
    } if (time < 86400) {
      return `${(time / 3600).toFixed(0)} hours`;
    }
    return `${(time / 86400).toFixed(0)} days`;
  }

  getTimeAgo() {
    this.setState({
      timeAgo: ((new Date() - this.props.snapshotTime) / 1000).toFixed(0),
    });
    setTimeout(() => { this.getTimeAgo(); }, 1000);
  }

  viewPresent() {
    this.hideTimeMachine();
    this.props.viewPresent();
  }

  viewPast() {
    this.showTimeMachine();
    this.props.viewPast();
  }

  viewFuture() {
    this.hideTimeMachine();
    this.props.viewFuture();
  }

  showTimeMachine() {
    this.setState({ showTimeMachine: true });
  }

  hideTimeMachine() {
    this.setState({ showTimeMachine: false });
  }

  historyBar() {
    const data = [];
    let i = 0;
    const nBars = 200;
    const historyLength = Object.keys(this.props.history).length;
    let nSkip = 1;
    if (historyLength > nBars) {
      nSkip = parseInt((historyLength / nBars).toFixed(0), 10);
    }
    for (const time in this.props.history) {
      if (i % nSkip === 0) {
        const d = new Date(time * 1000);
        data.push({
          time,
          timeString: `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`,
          running: this.props.history[time].running,
          free: this.props.history[time].avail - this.props.history[time].running,
        });
      }
      i++;
    }

    return (
      <div>
        <div>
          <div>
            Showing data from
          </div>
          <div id="clock">
            {this.props.snapshotTime.toTimeString()}
          </div>
          <div>
            (
            {this.timeString(parseInt(this.state.timeAgo, 10))}
            {' '}
            ago)
          </div>
        </div>
        <div id="timeline">
          <ResponsiveContainer width="100%" height={100}>
            <ComposedChart
              data={data}
              barCategoryGap={0}
              barGap={0}
            >
              <XAxis dataKey="timeString" />
              {/* <Line type='monotone' dataKey='avail' stroke='#82ca9d' fill='#EEEEEE' /> */}
              <Bar
                dataKey="running"
                fill="#8884d8"
                stackId="a"
                onClick={(obj, index) => this.props.clickLoadTime(data[index].time)}
                cursor="pointer"
              />
              <Bar
                dataKey="free"
                fill="#82ca9d"
                stackId="a"
                onClick={(obj, index) => this.props.clickLoadTime(data[index].time)}
                cursor="pointer"
              />
              <Tooltip />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="instruction">
          View the previous state of OzSTAR by selecting a time
        </div>
      </div>
    );
  }

  getSelector(period) {
    const style = getComputedStyle(document.documentElement);
    const switchWidth = style.getPropertyValue('--switch-width');

    const divStyle = {};
    let text;
    if (period === 'past') {
      divStyle.left = 0;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue('--piecycle-1');
      text = 'Past';
    } else if (period === 'present') {
      divStyle.left = `${switchWidth}px`;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue('--piecycle-2');
      text = 'Present';
    } else {
      divStyle.left = `${2 * switchWidth + 1}px`;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue('--piecycle-3');
      text = 'Future';
    }

    return (
      <div
        id="selector"
        className="selector"
        style={divStyle}
      >
        {text}
      </div>
    );
  }

  changeSwitch(period) {
    this.setState({ period });

    if (period === 'past') {
      this.viewPast();
    } else if (period === 'present') {
      this.viewPresent();
    } else {
      this.viewFuture();
    }
  }

  render() {
    if (this.props.history === null || this.props.timeAgo === 0) {
      return (
        <div id="time-machine">
          <div className="loader" />
        </div>
      );
    }

    return (
      <div>
        <div className="switch-parent">
          <div className="switch3ways">
            <div id="past" className="switch past" onClick={() => this.changeSwitch('past')}>Past</div>
            <div id="present" className="switch present" onClick={() => this.changeSwitch('present')}>Present</div>
            <div id="future" className="switch future" onClick={() => this.changeSwitch('future')}>Future</div>
            {this.getSelector(this.state.period)}
          </div>
        </div>
        {this.state.showTimeMachine
                && (
                <div id="time-machine">
                  {this.historyBar()}
                </div>
                )}
      </div>
    );
  }
}
