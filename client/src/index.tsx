import 'reflect-metadata';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-datepicker/dist/react-datepicker.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {initializeContainer} from './config/inversify.config';
import {ContainerContext} from './context/ContainerContext';
import {StoreConfigurator} from './redux/StoreConfigurator';
import {PrivateRoute} from './routes/PrivateRoute';
import {StoreProvider} from './services/Store/StoreProvider';
import {Modals} from './UI/Common/Modals/Modals';
import {PageFooter} from './UI/Common/PageFooter/PageFooter';
import {PageHeader} from './UI/Common/PageHeader/PageHeader';
import {AdminPage} from './UI/Scenes/AdminPage/AdminPage';
import {LoginPage} from './UI/Scenes/LoginPage/LoginPage';
import {RegisterPage} from './UI/Scenes/RegisterPage/RegisterPage';
import { HomePage } from './UI/Scenes/HomePage/HomePage';
import { TicTacToe } from './UI/Scenes/Games/TicTacToe/TicTacToePage';
import { ProfilePage } from './UI/Scenes/ProfilePage/ProfilePage';

const container = initializeContainer();
const store = container.get(StoreConfigurator).getConfiguredStore();
container.get(StoreProvider).setStore(store);

(window as any).store = store;

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <ContainerContext.Provider value={container}>
                <PageHeader/>
                <Switch>
                    <Route path='/register' component={RegisterPage}/>
                    <PrivateRoute path='/admin' component={AdminPage} role={'Admin'}/>
                    <PrivateRoute path='/tic_tac_toe' component={TicTacToe} role={'Client'}/>
                    <PrivateRoute path='/profile' component={ProfilePage} role={'Client'}/>
                    <Route path='/home' component={HomePage} />
                    <Route path='/login' component={LoginPage}/>
                    <Redirect to='/home'/>
                    <Redirect from='/' to='/home'/>
                </Switch>
                <PageFooter/>
                <Modals/>
            </ContainerContext.Provider>
        </Provider>
    </BrowserRouter>
    ,
    document.getElementById('root'),
);
