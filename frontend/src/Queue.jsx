import React from 'react';
import PropTypes from 'prop-types';
import QueueString from './QueueString';

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
        <div>
          {queueTotal.size}
          {' '}
          job
          {(queueTotal.size !== 1) ? 's' : ''}
          {' '}
          for
          {queueTotal.cpuHours.toFixed(0)}
          {' '}
          cpu-h (
          {(queueTotal.cpuHours / availCores).toFixed(0)}
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

Queue.propTypes = {
  queueData: PropTypes.arrayOf(PropTypes.object).isRequired,
  queueTotal: PropTypes.objectOf(PropTypes.number).isRequired,
  availCores: PropTypes.number.isRequired,
};
