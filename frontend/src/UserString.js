import React from 'react';

export default class UserString extends React.Component {
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
