import React from 'react';
import PropTypes from 'prop-types';
import { timeConvert } from './timeFunctions';

export default class JobText extends React.PureComponent {
  getClass() {
    const { warn } = this.props;
    let nameClass = 'job-name';
    if (warn) nameClass += ' warn';
    return nameClass;
  }

  render() {
    const { id, job } = this.props;

    const startTime = new Date(job.startTime * 1000 + job.timeLimit * 60 * 1000)
    let eta = startTime.toLocaleString('default', { month: 'long' })
    eta += ' ' + startTime.getDate()
    eta += ', ' + startTime.getHours().toString().padStart(2, '0')
    eta += ':' + startTime.getMinutes().toString().padStart(2, '0')

    return (
      <div className={this.getClass()}>
        <div className="job-name-title">
          <div className="job-name-title-item-l">
            {id}
          </div>
          <div className="job-name-title-item-c">
            {timeConvert(job.runTime)}
            {' '}
            /
            {timeConvert(job.timeLimit)}
          </div>
          <div className="job-name-title-item-r">
            {job.nCpus}
            {' '}
            core
            {(job.nCpus > 1) ? 's' : ''}
          </div>
        </div>
        <div>
          {job.name}
          {' '}
          {(job.nGpus > 0) ? '(GPU)' : ''}
        </div>
        <div>
          ETA: {eta}
        </div>
      </div>
    );
  }
}

JobText.propTypes = {
  warn: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
  job: PropTypes.objectOf(PropTypes.oneOfType(
    [
      PropTypes.number,
      PropTypes.string,
      PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
      PropTypes.objectOf(PropTypes.number),
      PropTypes.bool,
    ],
  )).isRequired,
};
