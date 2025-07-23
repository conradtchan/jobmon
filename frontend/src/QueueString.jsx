import React from "react";

export default class QueueString extends React.PureComponent {
  render() {
    const { user } = this.props;
    return (
      <div className="queue-string">
        <div className="queue-string-username">
          {user.username}
        </div>
        <div className="queue-string-hours">
          <span className="queue-hours-value">{user.hours.toFixed(0)}</span>
          <span className="queue-hours-unit">cpu-h</span>
        </div>
        <div className="queue-string-jobs">
          <span className="queue-jobs-count">{user.jobs}</span>
          <span className="queue-jobs-label">
            job
            {(user.jobs > 1) ? "s" : ""}
          </span>
        </div>
      </div>
    );
  }
}
