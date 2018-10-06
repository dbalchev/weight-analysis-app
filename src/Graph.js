import React, { Component } from 'react';

class Graph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gapi: window.gapi,
            data: []
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
            <div>{this.state.data}</div>
        </div>)
    }
    async loadData() {
        const response = await this.state.gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: this.spreadsheetId,
            range: 'A1:B'})
        this.setState({
            data: response.result.values,
        })
        console.log(response)
    }
}

export default Graph;