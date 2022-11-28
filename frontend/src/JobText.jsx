import React from "react";
import { timeConvert } from "./timeFunctions";

export default class JobText extends React.PureComponent {
  getClass() {
    const { warn } = this.props;
    let nameClass = "job-name";
    if (warn) nameClass += " warn";
    return nameClass;
  }

  render() {
    const { id, job } = this.props;

    return (
      <div className={this.getClass()}>
        <div className="job-name-title">
          <div className="job-name-title-item-l">
            {id}
          </div>
          <div className="job-name-title-item-c">
            {timeConvert(job.runTime)}
            {" "}
            /
            {timeConvert(job.timeLimit)}
          </div>
          <div className="job-name-title-item-r">
            {job.nCpus}
            {" "}
            core
            {(job.nCpus > 1) ? "s" : ""}
          </div>
        </div>
        <div>
          {job.name}
          {" "}
          {(job.nGpus > 0) ? "(GPU)" : ""}
        </div>
      </div>
    );
  }
}
