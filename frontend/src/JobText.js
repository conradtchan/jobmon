import React from "react";

export default class JobText extends React.Component {
    render () {
        let nameClass = 'job-name';
        if (this.props.warn) nameClass += ' warn';
        return (
            <div
                className={nameClass}
                onClick={() => this.props.onClick()}
            >
                {this.props.id}: {this.props.job.name} [{this.props.job.state}, {this.props.job.nCpus} core{(this.props.job.nCpus > 1) ? 's' : ''}]
            </div>
        )
    }
}
