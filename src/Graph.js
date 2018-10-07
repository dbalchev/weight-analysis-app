import React, { Component } from 'react';
import {ScatterPlot} from './plots/Scatter'
import * as moment from 'moment';


function serialNumberToMoment(serialNumber) {
    return moment('1899-12-30').add(serialNumber, 'days')
}

function preprocessData(data){
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
            minDate: null
        }
        this.loadData()
    }
    get spreadsheetId() {
        return this.props.match.params.spreadsheetId
    }
    render() {
        return (
            <div>
                this is the graph for {this.spreadsheetId}
                <br/>
                <ScatterPlot data={this.state.data} minDate={this.state.minDate}/>
            </div>)
    }
    async loadData() {
        const response = await this.props.google.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: 'A1:B',
            valueRenderOption: 'UNFORMATTED_VALUE',
            dateTimeRenderOption: 'SERIAL_NUMBER'})
        const {minDate, data} = preprocessData(response.result.values.slice(1))
        this.setState({
            data, minDate
        })
    }
}

export default Graph;