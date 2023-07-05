import React from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";
import moment from "moment";
import { timeString } from "./timeFunctions";
import config from "./config";

export default class TimeMachine extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeAgo: 0,
      showTimeMachine: false,
      period: "present",
    };
  }

  componentDidMount() {
    this.getTimeAgo();
    this.intervalClock = setInterval(() => this.getTimeAgo(), 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { snapshotTime, theme } = this.props;
    const { period, timeAgo } = this.state;

    if (nextProps.snapshotTime !== snapshotTime) {
      return true;
    } if (nextState.period !== period) {
      return true;
    } if (nextState.timeAgo !== timeAgo) {
      return true;
    } if (nextProps.theme !== theme) {
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    clearInterval(this.intervalClock);
  }

  getTimeAgo() {
    const { snapshotTime } = this.props;
    this.setState({
      timeAgo: ((new Date() - snapshotTime) / 1000).toFixed(0),
    });
  }

  getSelector() {
    const { period } = this.state;
    const style = getComputedStyle(document.documentElement);
    const switchWidth = style.getPropertyValue("--switch-width");

    const divStyle = {};
    let text;
    if (period === "past") {
      divStyle.left = 0;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue("--piecycle-1");
      text = "Past";
    } else if (period === "present") {
      divStyle.left = `${switchWidth}px`;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue("--piecycle-2");
      text = "Present";
    } else {
      divStyle.left = `${2 * switchWidth + 1}px`;
      divStyle.width = `${switchWidth}px`;
      divStyle.backgroundColor = style.getPropertyValue("--piecycle-3");
      text = "Future";
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

  historyBar() {
    const { timeAgo } = this.state;
    const {
      history,
      snapshotTime,
      clickLoadTime,
      userFilter,
    } = this.props;

    const data = [];
    const times = Object.keys(history);
    const historyLength = times.length;

    // Calculate time spanned
    const timeSpan = parseInt(times[historyLength - 1], 10) - parseInt(times[0], 10);

    // Target amount of time between bars, as integer
    const targetBarTimeStep = parseInt(timeSpan / config.timeMachineBars, 10);

    // Target time
    let targetTime = parseInt(times[0], 10);

    for (let i = 0; i < times.length; i += 1) {
      const time = parseInt(times[i], 10);
      // If the time is past the target time, add a bar
      if (time >= targetTime) {
        // Increment targetTime
        targetTime = time + targetBarTimeStep;
        let { running } = history[time];
        if (Object.keys(history[time].users).includes(userFilter)) {
          running = history[time].users[userFilter];
        } else if (userFilter !== "") {
          running = 0;
        }
        data.push({
          time,
          running,
          free: history[time].avail - history[time].running,
        });
      }
      i += 1;
    }

    // Generate hourly tick marks
    const hourlyTicks = [];
    let t = Math.ceil(parseInt(times[0], 10) / 3600) * 3600;
    while (t < parseInt(times[times.length - 1], 10)) {
      hourlyTicks.push(t);
      t += 3600;
    }

    const style = getComputedStyle(document.documentElement);
    const tickColor = style.getPropertyValue("--text-color");

    return (
      <div>
        <div className="label">
          <div>
            Showing data from
          </div>
          <div id="clock">
            {snapshotTime.toTimeString()}
          </div>
          <div>
            (
            {timeString(parseInt(timeAgo, 10))}
            {" "}
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
              <XAxis
                dataKey="time"
                tick={{ fill: tickColor }}
                tickFormatter={(unixTime) => moment.unix(unixTime).format("HH:mm")}
                ticks={hourlyTicks}
                interval={0}
                scale="time"
                type="number"
                domain={["auto", "auto"]}
              />
              <Bar
                dataKey="running"
                fill="#8884d8"
                stackId="a"
                onClick={(obj, index) => clickLoadTime(data[index].time)}
                cursor="pointer"
              />
              <Bar
                dataKey="free"
                fill="#82ca9d"
                stackId="a"
                onClick={(obj, index) => clickLoadTime(data[index].time)}
                cursor="pointer"
                hide={userFilter !== ""} // Hide free bar if users are being filtered
              />
              <Tooltip labelFormatter={(unixTime) => moment.unix(unixTime).format("HH:mm dddd")} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
        <div className="instruction">
          View a previous state of the system by selecting a time
        </div>
      </div>
    );
  }

  hideTimeMachine() {
    this.setState({ showTimeMachine: false });
  }

  changeSwitch(period) {
    this.setState({ period });

    if (period === "past") {
      this.viewPast();
    } else if (period === "present") {
      this.viewPresent();
    } else {
      this.viewFuture();
    }
  }

  showTimeMachine() {
    this.setState({ showTimeMachine: true });
  }

  viewPresent() {
    const { viewPresent } = this.props;
    this.hideTimeMachine();
    viewPresent();
  }

  viewPast() {
    const { viewPast } = this.props;
    this.showTimeMachine();
    viewPast();
  }

  viewFuture() {
    const { viewFuture } = this.props;
    this.hideTimeMachine();
    viewFuture();
  }

  render() {
    const {
      history,
      timeAgo,
    } = this.props;

    const { showTimeMachine } = this.state;

    if (history === null || timeAgo === 0) {
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
            <div
              id="past"
              className="switch past"
              onClick={() => this.changeSwitch("past")}
              onKeyDown={() => this.changeSwitch("past")}
              role="button"
              tabIndex={0}
            >
              Past
            </div>
            <div
              id="present"
              className="switch present"
              onClick={() => this.changeSwitch("present")}
              onKeyDown={() => this.changeSwitch("present")}
              role="button"
              tabIndex={0}
            >
              Present
            </div>
            <div
              id="future"
              className="switch future"
              onClick={() => this.changeSwitch("future")}
              onKeyDown={() => this.changeSwitch("future")}
              role="button"
              tabIndex={0}
            >
              Future
            </div>
            {this.getSelector()}
          </div>
        </div>
        {showTimeMachine
                && (
                <div id="time-machine">
                  {this.historyBar()}
                </div>
                )}
      </div>
    );
  }
}
