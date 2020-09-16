import React from 'react';

export default class QueueString extends React.Component {
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
