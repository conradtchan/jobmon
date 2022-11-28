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
        <div className="heading">
          Queue
        </div>
        <div className="label">
          {queueTotal.size}
          {" "}
          job
          {(queueTotal.size !== 1) ? "s" : ""}
          {" "}
          for
          {" "}
          {queueTotal.cpuHours.toFixed(0)}
          {" "}
          cpu-h
        </div>
        <div className="label">
          (
          {(queueTotal.cpuHours / availCores).toFixed(0)}
          {" "}
          machine-h)
          <br />
        </div>
        <div className="queue-strings">
          {queueStrings}
        </div>
      </div>
    );
  }
}
