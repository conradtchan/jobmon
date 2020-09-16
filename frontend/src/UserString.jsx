import React from 'react';
import PropTypes from 'prop-types';

export default class UserString extends React.PureComponent {
  render() {
    const {
      user,
      availCores,
      hoveredIndex,
      mouseEnter,
      mouseLeave,
      onClick,
      warning,
      badness,
      terribleThreshold,
      nameSort,
    } = this.props;

    let nameClass = 'user-string';
    if (warning) {
      if (badness > terribleThreshold && nameSort === 'badness') {
        nameClass += ' terrible';
      } else {
        nameClass += ' warn';
      }
    }
    if (user.index === hoveredIndex) {
      nameClass += ' hovered';
    }

    // Check for badness param
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const userDescription = [];
    if (params.has('golf')) {
      userDescription.push(
        <div className="user-string-percent" key="badness">
          {badness}
        </div>,
      );
    } else {
      userDescription.push(
        <div className="user-string-percent" key="percent">
          {((100 * user.cpus) / availCores).toFixed(1)}
          %
        </div>,
      );
      userDescription.push(
        <div className="user-string-jobs" key="nJobs">
          {user.jobs}
          {' '}
          job
          {(user.jobs > 1) ? 's' : ''}
        </div>,
      );
    }

    return (
      <button
        className={nameClass}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
        onClick={onClick}
        type="button"
      >
        <div className="user-string-username">
          {user.username}
        </div>

        {userDescription}

      </button>
    );
  }
}

UserString.propTypes = {
  user: PropTypes.objectOf(PropTypes.object).isRequired,
  availCores: PropTypes.number.isRequired,
  hoveredIndex: PropTypes.number,
  mouseEnter: PropTypes.func.isRequired,
  mouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
  badness: PropTypes.number.isRequired,
  terribleThreshold: PropTypes.number.isRequired,
  nameSort: PropTypes.string.isRequired,
};

UserString.defaultProps = {
  hoveredIndex: null,
};
