import React from 'react';
import PropTypes from 'prop-types';
import UsagePie from './UsagePie';
import UserString from './UserString';
import config from './config';

export default class UserPiePlot extends React.Component {
  static whyDidYouRender = true
  constructor(props) {
    super(props);
    this.state = {
      usagePieActiveIndex: null,
      usagePieSelectedIndex: null,
      activeSectorSize: 'small',
      nameSort: 'alpha',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
      timestamp,
      warnedUsers,
      systemUsage,
      userFilter,
    } = this.props;

    const {
      usagePieActiveIndex,
      usagePieSelectedIndex,
      activeSectorSize,
      nameSort,
    } = this.state

    if (nextProps.timestamp !== timestamp) {
      return true
    } if (nextProps.warnedUsers !== warnedUsers) {
      return true
    } if (nextProps.systemUsage !== systemUsage) {
      return true
    } if (nextProps.userFilter !== userFilter) {
      return true
    } if (nextState.usagePieActiveIndex !== usagePieActiveIndex) {
      return true
    } if (nextState.usagePieSelectedIndex !== usagePieSelectedIndex) {
      return true
    } if (nextState.activeSectorSize !== activeSectorSize) {
      return true
    } if (nextState.nameSort !== nameSort) {
      return true
    }

    return false
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
      const { usagePieSelectedIndex } = this.state;
      this.setState({ usagePieActiveIndex: usagePieSelectedIndex });
      this.setState({ activeSectorSize: 'small' });
    }

    updateSelectedUsername(index, name) {
      const { updateUsername } = this.props;
      updateUsername(name);
      this.setState({ usagePieSelectedIndex: index });
    }

    render() {
      const {
        runningData,
        runningCores,
        availCores,
        warnedUsers,
        badness,
        userFilter,
        defaultUserFilter,
        updateUserFilter,
      } = this.props;

      const {
        usagePieActiveIndex,
        activeSectorSize,
        nameSort,
      } = this.state;

      const userStrings = [];
      let maxBadness = 0;
      for (let i = 0; i < runningData.length; i += 1) {
        const user = runningData[i];
        if (user.username === userFilter || userFilter === '') {
          userStrings.push(
            <UserString
              key={user.username}
              user={user}
              availCores={availCores}
              hoveredIndex={usagePieActiveIndex}
              mouseEnter={() => this.updateActive(user.index)}
              mouseLeave={() => this.restoreSelected()}
              onClick={() => this.updateSelectedUsername(user.index, user.username)}
              warning={warnedUsers.includes(user.username)}
              badness={badness[user.username]}
              nameSort={nameSort}
            />,
          );
          maxBadness = Math.max(maxBadness, badness[user.username]);
        }

      }

      if (nameSort === 'alpha') {
        userStrings.sort(
          (a, b) => {
            if (a.props.user.username < b.props.user.username) {
              return -1;
            } if (a.props.user.username > b.props.user.username) {
              return 1;
            }
            return 0;
          },
        );
      } else if (nameSort === 'badness') {
        userStrings.sort((a, b) => b.props.badness - a.props.badness);
      }

      const mainBox = document.getElementById('main-box');
      let mainBoxWidth = 0;
      if (mainBox) mainBoxWidth = mainBox.offsetWidth;

      let userStringsBlock;
      if (mainBoxWidth > 1024) {
        const userStringsLeft = [];
        const userStringsRight = [];
        for (let i = 0; i < userStrings.length; i += 1) {
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

          <div className="input-box">
            <input
              type="text"
              placeholder="Filter by username"
              maxlength="6"
              defaultValue={defaultUserFilter}
              onChange={({ target: { value } }) => updateUserFilter(value)}
            />
          </div>

          <UsagePie
            runningData={runningData}
            runningCores={runningCores}
            availCores={availCores}
            onPieClick={(data, index) => this.updateSelectedUsername(index, data.name)}
            onMouseEnter={(data, index) => this.updateActive(index)}
            onMouseLeave={() => this.restoreSelected()}
            activeIndex={usagePieActiveIndex}
            activeSectorSize={activeSectorSize}
          />
          {(maxBadness > config.terribleThreshold && nameSort === 'badness')
                    && (
                    <div className="terrible-job">
                      Highlighted users are severely underutilizing resources
                      and impacting other users
                    </div>
                    )}
          <br />
          <div className="heading">
            Running
          </div>
          <div className="sort-selector">
            <label htmlFor="alpha">
              <input type="radio" id="alpha" name="nameSort" value="alpha" onChange={() => this.setState({ nameSort: 'alpha' })} checked={nameSort === 'alpha'} />
              Alphabetical &nbsp;&nbsp;
            </label>
            <label htmlFor="badness">
              <input type="radio" id="badness" name="nameSort" value="badness" onChange={() => this.setState({ nameSort: 'badness' })} checked={nameSort === 'badness'} />
              Inefficiency
            </label>
          </div>
          {userStringsBlock}
        </div>
      );
    }
}

UserPiePlot.propTypes = {
  runningData: PropTypes.arrayOf(
    PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  ).isRequired,
  runningCores: PropTypes.number.isRequired,
  availCores: PropTypes.number.isRequired,
  updateUsername: PropTypes.func.isRequired,
  warnedUsers: PropTypes.arrayOf(PropTypes.string).isRequired,
  badness: PropTypes.objectOf(PropTypes.number).isRequired,
};
