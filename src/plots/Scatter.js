import React, { Component } from 'react';
import {ResponsiveXYFrame} from 'semiotic'

export class ScatterPlot extends Component {
    render() {
        const data = this.data
        const points = data.map(d => {return {x: d.daysSinceMinDate, y: d.reading}})
        const lines = data.map(d => {return {x: d.daysSinceMinDate, y: d.smooth}})
        return (
            <div>
                <ResponsiveXYFrame points={points} xAccessor={'x'} yAccessor={'y'}
                    dataVersion={this.dataVersion}
                    responsiveWidth={true}
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
    get data() {
        return this.props.data
    }
    get dataVersion() {
        return this.props.dataVersion
    }
}
export default ScatterPlot;