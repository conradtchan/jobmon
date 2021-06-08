import React from "react";
import PropTypes from "prop-types";
import config from "./config";

export default class UserString extends React.Component {
  shouldComponentUpdate(nextProps) {
    const {
      user,
      availCores,
      hoveredIndex,
      warning,
      badness,
    } = this.props;
    if (nextProps.user.username !== user.username) {
      return true;
    } if (nextProps.user.index !== user.index) {
      return true;
    } if (nextProps.user.cpus !== user.cpus) {
      return true;
    } if (nextProps.user.jobs !== user.jobs) {
      return true;
    } if (nextProps.availCores !== availCores) {
      return true;
    } if (nextProps.hoveredIndex !== hoveredIndex) {
      return true;
    } if (nextProps.warning !== warning) {
      return true;
    } if (nextProps.badness !== badness) {
      return true;
    }
    return false;
  }

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
      nameSort,
    } = this.props;

    let nameClass = "user-string";
    if (warning) {
      if (badness > config.terribleThreshold && nameSort === "badness") {
        nameClass += " terrible";
      } else {
        nameClass += " warn";
      }
    }
    if (user.index === hoveredIndex) {
      nameClass += " hovered";
    }

    // Check for badness param
    const windowUrl = window.location.search;
    const params = new URLSearchParams(windowUrl);

    const userDescription = [];
    if (params.has("golf")) {
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
          {" "}
          job
          {(user.jobs > 1) ? "s" : ""}
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
  user: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  availCores: PropTypes.number.isRequired,
  hoveredIndex: PropTypes.number,
  mouseEnter: PropTypes.func.isRequired,
  mouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  warning: PropTypes.bool.isRequired,
  badness: PropTypes.number.isRequired,
  nameSort: PropTypes.string.isRequired,
};

UserString.defaultProps = {
  hoveredIndex: null,
};
