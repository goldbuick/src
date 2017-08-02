import React from 'react';
import ReactDOM from 'react-dom';
import RenderDevice from './render/RenderDevice';
import RenderObject from './render/RenderObject';
import registerServiceWorker from '../registerServiceWorker';

const App = () => (
    <RenderDevice>
        <RenderObject />
    </RenderDevice>
);

export default () => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
};
