import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Logged from './Logged';
import Graph from './Graph';
import NotLogged from './NotLogged';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
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
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' render={this.renderComponent(NotLogged)}/>
                    <Route exact path='/logged' render={this.renderComponent(Logged)}/>
                    <Route exact path='/graph/:spreadsheetId' render={this.renderComponent(Graph)}/>
                </Switch>
            </BrowserRouter>
        )
    }
    render() {
        if (this.state.google === null) {
            return (<div> Please, wait a bit untill Google loads</div>)
        }
        if (!this.state.loggedIn) {
            return (
                <input type="button" value="sign in" disabled={this.state.disabled} 
                    onClick={() => this.state.google.authInstance.signIn()}/>
            )
        }
        return (
            <div>
                <div>
                <input type="button" value="sign out" disabled={this.state.disabled} 
                    onClick={() => this.state.google.authInstance.signOut()}/>
                </div>
                {this.renderLoggedInComponents()}
            </div>
        )
    }


}

ReactDOM.render(
    <MainComponent/>, document.getElementById('root'));
registerServiceWorker();
