import React from "react";

export default class JobText extends React.Component {
    render () {
        let nameClass = 'job-name';
        if (this.props.warn) nameClass += ' warn';
        let onNameClick;
        if (this.props.job.state === 'RUNNING') {
            nameClass += ' clickable';
            onNameClick = () => this.props.onClick()
        }
        return (
            <div
                className={nameClass}
                onClick={onNameClick}
            >
                {this.props.id}: {this.props.job.name} ({this.props.job.nCpus} core{(this.props.job.nCpus > 1) ? 's' : ''})
            </div>
        )
    }
}
