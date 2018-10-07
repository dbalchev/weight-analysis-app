import React, { Component } from 'react';
import {ResponsiveXYFrame} from 'semiotic'

export class ScatterPlot extends Component {
    render() {
        const data = this.props.data
        if (data.length === 0) {
            //TODO fix refreshing when we change the data
            return (<div/>)
        }
        const points = data.map(d => {return {x: d.daysSinceMinDate, y: d.reading}})
        const lines = data.map(d => {return {x: d.daysSinceMinDate, y: d.smooth}})
        return (
            <div style={{ position: 'absolute' }}>

                <ResponsiveXYFrame points={points} xAccessor={'x'} yAccessor={'y'} 
                    axes={[
                        { orient: 'left', key: 'yAxis'},
                        { orient: 'bottom', key: 'xAxis', tickFormat: d => this.formatDate(d),
                         tickSizeOuter: 12, ticks: 5}
                          ]}
                    margin={45}
                    lines={lines}
                    pointStyle={{fill: 'blue'}}
                    lineStyle={{stroke: 'red'}}
                    // lineDataAccessor={d => {return d}}
                     />
            </div>
        )
    }
    formatDate(d) {
        return this.props.minDate.clone().add(d, 'days').format('L')
    }
}
export default ScatterPlot;