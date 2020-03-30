import React from "react";

export default class JobText extends React.Component {
    getClass() {
        let nameClass = 'job-name';
        if (this.props.warn) nameClass += ' warn';
        return nameClass
    }

    time_convert(num) { 
        const hours = Math.floor(num / 60);  
        const minutes = num % 60;
        return `${hours}:${("0"+minutes).slice(-2)}`;         
    }

    render () {

        return (
            <div
                className={this.getClass()}
            >
                <div className='job-name-title'>
                    <div className='job-name-title-item-l'>
                        {this.props.id}
                    </div>
                    <div className='job-name-title-item-c'>
                        {this.time_convert(this.props.job.runTime)} / {this.time_convert(this.props.job.timeLimit)}
                    </div>
                    <div className='job-name-title-item-r'>
                        {this.props.job.nCpus} core{(this.props.job.nCpus > 1) ? 's' : ''}
                    </div>        
                </div>
                <div>
                    {this.props.job.name} {(this.props.job.nGpus > 0) ? '(GPU)' : ''}
                </div>      
            </div>
        )
    }
}