import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class NotLoggedApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
        }
        console.log(this.props.google)
    }
    signIn() {
        console.log('sign in')
        this.props.google.authInstance.signIn();
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
        console.log(this.state.files)
        return (
            <div>
                You're *NOT* Logged
                <br/>
                <input type="button" value="sign in" disabled={this.state.disabled} onClick={() => this.signIn()}/>
                <input type="button" value="list files" onClick={() => this.listFiles()}/>
                <ul>
                    {this.state.files.map(file => (
                        <li key={file.id}><Link to={`graph/${file.id}`}> {file.name}</Link></li>)
                    )}
                </ul>
            </div>
        )
    }
}

export default NotLoggedApp;