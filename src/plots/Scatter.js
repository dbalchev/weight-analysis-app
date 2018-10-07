import React, { Component } from 'react';
import {XYFrame} from 'semiotic'

export class ScatterPlot extends Component {
    render() {
        const data = this.props.data
        if (data.length === 0) {
            //TODO fix refreshing when we change the data
            return (<div/>)
        }
        return (
            <div style={{ position: 'absolute' }}>

                <XYFrame points={data} xAccessor={'daysSinceMinDate'} yAccessor={'reading'} 
                    axes={[
                        { orient: 'left', key: 'yAxis'},
                        { orient: 'bottom', key: 'xAxis', tickFormat: d => this.formatDate(d),
                         tickSizeOuter: 12, ticks: 5}
                          ]}
                    margin={45} />
            </div>
        )
    }
    formatDate(d) {
        return this.props.minDate.clone().add(d, 'days').format('L')
    }
}
export default ScatterPlot;