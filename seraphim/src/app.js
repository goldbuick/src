console.log(NODE_ENV);

import './app.css';
import React from 'react';
import ReactDOM from 'react-dom';
import Page from './components/Page';

const Entry = () => <Page />;
ReactDOM.render(<Entry />, document.getElementById('exculta'));
