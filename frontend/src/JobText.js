import React from "react";

export default class JobText extends React.Component {
    getClass() {
        let nameClass = 'job-name';
        if (this.props.warn) nameClass += ' warn';
        return nameClass
    }

    render () {

        return (
            <div
                className={this.getClass()}
            >
                <div className='job-name-id'>
                    {this.props.id} ({this.props.job.nCpus} core{(this.props.job.nCpus > 1) ? 's' : ''})
                </div>
                <div>
                {this.props.job.name} 
                </div>          
            </div>
        )
    }
}