import React, { Component } from 'react';
import { authorize } from './googleutils';

class NotLoggedApp extends Component {
    constructor(props) {
        super(props)
        this.state = {
            gapi: null,
            disabled: true,
            files: [],
        }
        authorize().then((gapi)=> {
            this.setState({
                disabled: false,
                gapi
            })
        })
    }
    signIn() {
        console.log('sign in')
        this.state.gapi.auth2.getAuthInstance().signIn();
    }
    listFiles() {
        this.state.gapi.client.drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: "nextPageToken, files(id, name)",
        }).then(listResults => {
            this.setState({
                files: listResults.result.files
            })
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
                    {this.state.files.map(file => <li key={file.id}>{file.name + ' ' + file.id}</li>)}
                </ul>
            </div>
        )
    }
}

export default NotLoggedApp;