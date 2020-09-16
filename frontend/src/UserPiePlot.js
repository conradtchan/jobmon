import React from 'react';
import UsagePie from './UsagePie'
import UserString from './UserString.jsx'

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
