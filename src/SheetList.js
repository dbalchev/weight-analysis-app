import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class SheetList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
        }
        this.listFiles();
    }
    async listFiles() {
        const listResults = await this.props.google.drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: "nextPageToken, files(id, name)",
        })
        this.setState({
            files: listResults.result.files
        })
    }
    render() {
        return (
            <div>
                These are your files. Click on one to visualize it
                <br/>
                <ul>
                    {this.state.files.map(file => (
                        <li key={file.id}><Link to={`graph/${file.id}`}> {file.name}</Link></li>)
                    )}
                </ul>
            </div>
        )
    }
}

export default SheetList;