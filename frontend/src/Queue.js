import React from 'react';

export default class Queue extends React.Component {
  render() {
    const queueStrings = [];
    for (const user of this.props.queueData) {
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
        <div>
          {this.props.queueTotal.size}
          {' '}
          job
          {(this.props.queueTotal.size !== 1) ? 's' : ''}
          {' '}
          for
          {this.props.queueTotal.cpuHours.toFixed(0)}
          {' '}
          cpu-h (
          {(this.props.queueTotal.cpuHours / this.props.availCores).toFixed(0)}
          {' '}
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

class QueueString extends React.Component {
  render() {
    return (
      <div
        className="queue-string"
      >
        <div className="queue-string-username">
          {this.props.user.username}
        </div>
        <div className="queue-string-hours">
          {this.props.user.hours.toFixed(0)}
          {' '}
          cpu-h
        </div>
        <div className="queue-string-jobs">
          (
          {this.props.user.jobs}
          {' '}
          job
          {(this.props.user.jobs > 1) ? 's' : ''}
          )
        </div>
      </div>
    );
  }
}
