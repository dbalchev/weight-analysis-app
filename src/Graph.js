import React, { Component } from 'react';
import {ScatterPlot} from './plots/Scatter'
import * as moment from 'moment';


function serialNumberToMoment(serialNumber) {
    return moment('1899-12-30T00:00:00Z').utc().add(serialNumber, 'days')
}

function addSmoothData(data, alpha) {
    const memory = []
    data.forEach(x => memory[x.daysSinceMinDate] = x)

    let smooth = memory[0].reading
    memory[0].smooth = smooth
    for (let i = 1; i < memory.length; ++i) {
        if (memory[i]) {
            smooth = (1 - alpha) * smooth + alpha * memory[i].reading
            memory[i].smooth = smooth
        }
    }
    return data
}


function preprocessData(data, smoothingAlpha){
    data = data.map(([serialNumber, value]) => [serialNumberToMoment(serialNumber), value])
    const {minDate, maxDate} = data.reduce(({minDate, maxDate}, [curDate, _]) => {
        if (minDate === null) {
            return {minDate: curDate, maxDate: curDate}
        }
        if (curDate.isBefore(minDate)){
            minDate = curDate
        }
        if (curDate.isAfter(maxDate)) {
            maxDate = curDate
        }
        return {minDate, maxDate}
    }, {minDate: null, maxDate: null})
    data = data.map(([curDate, value]) => {
        return {
            date: curDate,
            reading: value,
            daysSinceMinDate: moment.duration(curDate.diff(minDate)).asDays(),
        }
    })
    data = addSmoothData(data, smoothingAlpha)
    return {
        data,
        minDate,
        maxDate,
    }
}

class Graph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: [],
            smoothingAlpha: 0.33,
            loadedSheetId: 'null',
            lastNMeasurements: 0,
        }
        this.loadData()
    }
    get spreadsheetId() {
        return this.props.match.params.spreadsheetId
    }
    render() {
        const sliceStart = (
            this.state.lastNMeasurements > 0 ?
            -this.state.lastNMeasurements:
            0)
        let {minDate, data} = (
            (this.state.data.length > 0) ?
            preprocessData(
                this.state.data.slice(1), this.state.smoothingAlpha) : 
            {minDate: moment(), data: []})
        data = data.slice(sliceStart)
        return (
            <div className='card'>
                <ScatterPlot data={data} minDate={minDate} dataVersion={this.dataVersion}/>
                <div className='smallCardContainer'>
                    <div className='smallCard'>
                        <fieldset>
                            <label for='alpha'>Smoothing alpha</label>
                            <input type="range" name="alpha" min="0" max="1" step="0.01" 
                                value={this.state.smoothingAlpha} onChange={e => this.changeAlpha(e)}/>
                            <input value={this.state.smoothingAlpha}
                                onChange={e => this.changeAlpha(e)}/>
                        </fieldset>
                    </div>
                    <div className='smallCard'>
                        <fieldset>
                            <label for='lastNMeasurements'>Show data for # measurements (0 - show all)</label>
                            <input value={this.state.lastNMeasurements} name='lastNMeasurements'
                                onChange={e => this.setState({lastNMeasurements: parseInt(e.target.value)})}/>
                        </fieldset>
                    </div>
                </div>
            </div>)
    }
    async loadData() {
        const response = await this.props.google.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: 'A1:B',
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'SERIAL_NUMBER'})
        this.setState({
            data: response.result.values,
            loadedSheetId: this.spreadsheetId
        })
    }
    changeAlpha(event) {
        this.setState({
            smoothingAlpha: event.target.value,
        })
    }
    get dataVersion() {
        return `${this.state.loadedSheetId};${this.state.smoothingAlpha};${this.state.lastNMeasurements}`
    }
}

export default Graph;