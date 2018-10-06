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
            google: null
        }
        this.initGoogle()
    }
    async initGoogle() {
        const google = await initGoogle()
        this.setState({google})
    }
    renderComponent(ComponentClass) {
        return props => (<ComponentClass {...props} google={this.state.google} />)
    }
    render() {
        if (this.state.google === null) {
            return (<div> Please, wait a bit untill Google loads</div>)
        }    
        return (
            <Switch>
                <Route exact path='/' render={this.renderComponent(NotLogged)}/>
                <Route exact path='/logged' render={this.renderComponent(Logged)}/>
                <Route exact path='/graph/:spreadsheetId' render={this.renderComponent(Graph)}/>
            </Switch>
        )
    }

}

ReactDOM.render(
    <BrowserRouter>
        <MainComponent/>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
