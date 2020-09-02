import React from 'react';

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Sector,
  Cell,
  Label,
} from 'recharts';

export default class UserPiePlot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      usagePieActiveIndex: null,
      usagePieSelectedIndex: null,
      activeSectorSize: 'small',
      nameSort: 'alpha',
      terribleThreshold: 1000,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

    handleResize = () => {
      this.forceUpdate();
    };

    updateActive(index) {
      this.setState({ usagePieActiveIndex: index });
      this.setState({ activeSectorSize: 'big' });
    }

    restoreSelected() {
      this.setState({ usagePieActiveIndex: this.state.usagePieSelectedIndex });
      this.setState({ activeSectorSize: 'small' });
    }

    updateUsername(index, name) {
      this.props.updateUsername(name);
      this.setState({ usagePieSelectedIndex: index });
    }

    render() {
      const userStrings = [];
      let maxBadness = 0;
      for (const user of this.props.runningData) {
        userStrings.push(
          <UserString
            key={user.username}
            user={user}
            availCores={this.props.availCores}
            hoveredIndex={this.state.usagePieActiveIndex}
            mouseEnter={() => this.updateActive(user.index)}
            mouseLeave={() => this.restoreSelected()}
            onClick={() => this.updateUsername(user.index, user.username)}
            warning={this.props.warnedUsers.includes(user.username)}
            badness={this.props.badness[user.username]}
            terribleThreshold={this.state.terribleThreshold}
            nameSort={this.state.nameSort}
          />,
        );
        maxBadness = Math.max(maxBadness, this.props.badness[user.username]);
      }

      if (this.state.nameSort === 'alpha') {
        userStrings.sort((a, b) => ((a.props.user.username < b.props.user.username) ? -1 : (a.props.user.username > b.props.user.username) ? 1 : 0));
      } else if (this.state.nameSort === 'badness') {
        userStrings.sort((a, b) => b.props.badness - a.props.badness);
      }

      const mainBox = document.getElementById('main-box');
      let mainBoxWidth = 0;
      if (mainBox) mainBoxWidth = mainBox.offsetWidth;

      let userStringsBlock;
      if (mainBoxWidth > 1024) {
        const userStringsLeft = [];
        const userStringsRight = [];
        for (let i = 0; i < userStrings.length; i++) {
          if (i < userStrings.length / 2) {
            userStringsLeft.push(userStrings[i]);
          } else {
            userStringsRight.push(userStrings[i]);
          }
        }

        userStringsBlock = (
          <div className="user-strings">
            <div className="user-strings-halfcol-left">
              {userStringsLeft}
            </div>
            <div className="user-strings-halfcol-right">
              {userStringsRight}
            </div>
          </div>
        );
      } else {
        userStringsBlock = (
          <div className="user-strings">
            <div className="user-strings-col">
              {userStrings}
            </div>
          </div>
        );
      }

      return (
        <div className="main-item left">
          <UsagePie
            runningData={this.props.runningData}
            runningCores={this.props.runningCores}
            availCores={this.props.availCores}
            onPieClick={(data, index) => this.updateUsername(index, data.name)}
            onMouseEnter={(data, index) => this.updateActive(index)}
            onMouseLeave={(data, index) => this.restoreSelected()}
            activeIndex={this.state.usagePieActiveIndex}
            activeSectorSize={this.state.activeSectorSize}
          />
          {(maxBadness > this.state.terribleThreshold && this.state.nameSort === 'badness')
                    && (
                    <div className="terrible-job">
                      Highlighted users are severely underutilizing resources and impacting other users
                    </div>
                    )}
          <br />
          <div className="heading">
            Running
          </div>
          <div>
            <input type="radio" id="alpha" name="nameSort" value="alpha" onChange={() => this.setState({ nameSort: 'alpha' })} checked={this.state.nameSort === 'alpha'} />
            <label> Alphabetical &nbsp;&nbsp;</label>
            <input type="radio" id="badness" name="nameSort" value="badness" onChange={() => this.setState({ nameSort: 'badness' })} checked={this.state.nameSort === 'badness'} />
            <label> Inefficiency </label>
          </div>
          {userStringsBlock}
        </div>
      );
    }
}

class UserString extends React.Component {
  render() {
    let nameClass = 'user-string';
    if (this.props.warning) {
      if (this.props.badness > this.props.terribleThreshold && this.props.nameSort === 'badness') {
        nameClass += ' terrible';
      } else {
        nameClass += ' warn';
      }
    }
    if (this.props.user.index === this.props.hoveredIndex) {
      nameClass += ' hovered';
    }

    // Check for badness param
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const userDescription = [];
    if (params.has('golf')) {
      userDescription.push(
        <div className="user-string-percent" key="badness">
          {this.props.badness}
        </div>,
      );
    } else {
      userDescription.push(
        <div className="user-string-percent" key="percent">
          {(100 * this.props.user.cpus / this.props.availCores).toFixed(1)}
          %
        </div>,
      );
      userDescription.push(
        <div className="user-string-jobs" key="nJobs">
          {this.props.user.jobs}
          {' '}
          job
          {(this.props.user.jobs > 1) ? 's' : ''}
        </div>,
      );
    }

    return (
      <div
        className={nameClass}
        onMouseEnter={this.props.mouseEnter}
        onMouseLeave={this.props.mouseLeave}
        onClick={this.props.onClick}
      >
        <div className="user-string-username">
          {this.props.user.username}
        </div>

        {userDescription}

      </div>
    );
  }
}

class UsagePie extends React.Component {
  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

    handleResize = () => {
      this.forceUpdate();
    };

    renderActiveShape(props) {
      const {
        cx, cy, innerRadius, outerRadius, startAngle, endAngle,
        fill,
      } = props;

      let growth = 0.0;
      if (this.props.activeSectorSize === 'small') {
        growth = 0.02;
      } else {
        growth = 0.04;
      }

      return (
        <g>
          <Sector
            cx={cx}
            cy={cy}
            innerRadius={innerRadius * (1.0 - growth)}
            outerRadius={outerRadius * (1.0 + growth)}
            startAngle={startAngle}
            endAngle={endAngle}
            fill={fill}
            cursor="pointer"
          />
        </g>
      );
    }

    pieMouseEnter(data, index) {
      this.props.onMouseEnter(data, index);
    }

    pieMouseLeave(data, index) {
      this.props.onMouseLeave();
    }

    render() {
      const style = getComputedStyle(document.documentElement);
      const pieColors = [
        style.getPropertyValue('--piecycle-1'),
        style.getPropertyValue('--piecycle-2'),
        style.getPropertyValue('--piecycle-3'),
        style.getPropertyValue('--piecycle-4'),
      ];

      const pieDiv = document.getElementById('usage-pie');
      let pieWidth;
      if (pieDiv) {
        pieWidth = pieDiv.offsetWidth;
      } else {
        pieWidth = 300;
      }

      function PieLabel({
        viewBox, value1, value2, value3,
      }) {
        const { cx, cy } = viewBox;
        return (
          <text x={cx} y={cy} fill="#3d405c" className="recharts-text recharts-label" textAnchor="middle" dominantBaseline="central">
            <tspan alignmentBaseline="middle" x={cx} dy="-0.2em" fontSize={pieWidth / 6}>{value1}</tspan>
            <tspan alignmentBaseline="middle" x={cx} dy="1.7em" fontSize={pieWidth / 18}>{value2}</tspan>
            <tspan alignmentBaseline="middle" x={cx} dy="1.0em" fontSize={pieWidth / 21}>{value3}</tspan>
          </text>
        );
      }

      const pieData = [];
      for (const user of this.props.runningData) {
        pieData.push({
          username: user.username,
          cpus: user.cpus,
        });
      }

      return (
        <div id="usage-pie" style={{ height: pieWidth }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                activeIndex={this.props.activeIndex}
                activeShape={(props) => this.renderActiveShape(props)}
                data={pieData}
                nameKey="username"
                dataKey="cpus"
                labelLine={false}
                innerRadius="60%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={2}
                startAngle={90 + (360 * (1.0 - (this.props.runningCores / this.props.availCores)))}
                endAngle={450}
                onClick={(data, index) => this.props.onPieClick(data, index)}
                onMouseEnter={(data, index) => this.pieMouseEnter(data, index)}
                onMouseLeave={(data, index) => this.pieMouseLeave(data, index)}
              >
                {
                                this.props.runningData.map(
                                  (entry, index) => (
                                    <Cell
                                      key={index}
                                      fill={pieColors[index % pieColors.length]}
                                      cursor="pointer"
                                    />
                                  ),
                                )
                            }
                <Label
                                // width="50%"
                  position="center"
                  content={(
                    <PieLabel
                      value1={`${(this.props.runningCores / this.props.availCores * 100).toFixed(0)}%`}
                      value2={`(${this.props.runningCores} / ${this.props.availCores})`}
                      value3="core utilization"
                    />
)}
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      );
    }
}
