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
            <div className='card'>
                <p>
                    These are your Google Sheet files. Click on the file you want to visualize.
                </p>
                <p>
                    Currently we only support sheets where the A column is the date
                    and the B column is the weight (where A1 and B1 are headers)
                </p>
                <div className='smallCardContainer'>
                    {this.state.files.map(file => (
                        <Link key={file.id} to={`graph/${file.id}`}>
                            <div  className='smallCard'>
                                {file.name}
                            </div>
                        </Link>)
                    )}
                </div>
            </div>
        )
    }
}

export default SheetList;