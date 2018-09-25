import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Logged from './Logged';
import NotLogged from './NotLogged';
import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter, Switch, Route } from 'react-router-dom'


const MainComponent = () => (
    <Switch>
        <Route exact path='/' component={NotLogged}/>
        <Route exact path='/logged' component={Logged}/>
    </Switch>
)

ReactDOM.render(
    <BrowserRouter>
        <MainComponent/>
    </BrowserRouter>, document.getElementById('root'));
registerServiceWorker();
