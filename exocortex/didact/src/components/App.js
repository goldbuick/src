import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import RenderDevice from './render/RenderDevice';
import registerServiceWorker from '../registerServiceWorker';

const App = () => (
    <RenderDevice>
    </RenderDevice>
);

export default () => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
};
