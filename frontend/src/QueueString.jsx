import React from 'react';
import PropTypes from 'prop-types';

export default class QueueString extends React.PureComponent {
  render() {
    const { user } = this.props;
    return (
      <div
        className="queue-string"
      >
        <div className="queue-string-username">
          {user.username}
        </div>
        <div className="queue-string-hours">
          {user.hours.toFixed(0)}
          {' '}
          cpu-h
        </div>
        <div className="queue-string-jobs">
          (
          {user.jobs}
          {' '}
          job
          {(user.jobs > 1) ? 's' : ''}
          )
        </div>
      </div>
    );
  }
}

QueueString.propTypes = {
  user: PropTypes.objectOf(PropTypes.string).isRequired,
};
