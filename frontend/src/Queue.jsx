import React from "react";
import QueueString from "./QueueString";

export default class Queue extends React.PureComponent {
  render() {
    const {
      queueData,
      queueTotal,
      availCores,
    } = this.props;
    const queueStrings = [];
    for (let i = 0; i < queueData.length; i += 1) {
      const user = queueData[i];
      queueStrings.push(
        <QueueString
          key={user.username}
          user={user}
        />,
      );
    }

    return (
      <div className="main-item left">
        <div className="queue-header">
          QUEUE
        </div>

        <div className="queue-summary">
          <div className="queue-summary-primary">
            <span className="queue-summary-number">{queueTotal.size}</span>
            <span className="queue-summary-label">
              job
              {(queueTotal.size !== 1) ? "s" : ""}
            </span>
          </div>
          <div className="queue-summary-secondary">
            <div className="queue-summary-detail">
              {queueTotal.cpuHours.toFixed(0)}
              {" "}
              cpu-h
            </div>
            <div className="queue-summary-detail">
              (
              {(queueTotal.cpuHours / availCores).toFixed(0)}
              {" "}
              machine-h)
            </div>
          </div>
        </div>

        {queueStrings.length > 0 && (
          <div className="queue-items">
            <div className="queue-items-header">
              <span className="queue-col-username">User</span>
              <span className="queue-col-hours">CPU Hours</span>
              <span className="queue-col-jobs">Jobs</span>
            </div>
            <div className="queue-strings">
              {queueStrings}
            </div>
          </div>
        )}
      </div>
    );
  }
}
