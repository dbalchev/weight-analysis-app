import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Graph from './Graph';
import SheetList from './SheetList';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import {initGoogle} from './googleutils'


class MainComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            google: null,
            loggedIn: false,
        }
        this.initGoogle()
    }
    async initGoogle() {
        const google = await initGoogle()
        google.authInstance.isSignedIn.listen(loggedIn => this.setState({loggedIn}))
        this.setState({
            google,
            loggedIn: google.authInstance.isSignedIn.get()})
    }
    renderComponent(ComponentClass) {
        return props => (<ComponentClass {...props} google={this.state.google} />)
    }
    renderLoggedInComponents() {
        return (
            <BrowserRouter basename={process.env.PUBLIC_URL}>
                <Switch>
                    <Route path='/list' render={this.renderComponent(SheetList)}/>
                    <Route path='/graph/:spreadsheetId' render={this.renderComponent(Graph)}/>
                    <Redirect from="/" to="list" />
                </Switch>
            </BrowserRouter>
        )
    }
    render() {
        if (this.state.google === null) {
            return (
                <div className='card'> 
                    <p>
                        Please, wait a bit untill Google API loads. Thanks!
                    </p>
                    <p>
                        If this message lingers for too long check if your third party cookies are disabled.
                    </p>
                    <p>
                        TODO: make this app work without third party cookies
                    </p>
                </div>)
        }
        if (!this.state.loggedIn) {
            return (
                <div className='card'>
                    <p>
                        In order to use this app you'll need to log into your Google Account.
                    </p>
                    <p>
                        This app will need read-only access to your Google Drive (to list the sheets files) and
                        Google Sheets (to view the file with your weight history).
                    </p>
                    <br/>
                    <input type="button" value="Sign in into Google" disabled={this.state.disabled} 
                        onClick={() => this.state.google.authInstance.signIn()}/>
                </div>
            )
        }
        return (
            <div className='absoluteContainer'>
                <input type="button" value="Sign out of Google" disabled={this.state.disabled} 
                    className='moveToRight'
                    onClick={() => this.state.google.authInstance.signOut()}/>
                <br/>
                <div>
                </div>
                {this.renderLoggedInComponents()}
            </div>
        )
    }
}

ReactDOM.render(
    <MainComponent/>, document.getElementById('root'));
registerServiceWorker();
