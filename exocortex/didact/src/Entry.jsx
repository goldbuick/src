
import './App.less';
import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux-immutable';

import Page from './system/Page';
import Store from './system/Store';

const Entry = () => (
    <Provider store={Store}>
        <Page />
    </Provider>
);

ReactDOM.render(<Entry />, document.getElementById('nexus'));
