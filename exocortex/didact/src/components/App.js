import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import RenderDevice from './render/RenderDevice';
import RenderObject from './render/RenderObject';
import registerServiceWorker from '../registerServiceWorker';
import Text from '../gen/Text';

const App = () => (
    <RenderDevice>
        <RenderObject
        	name="TextTest"
        	onRender3D={() => {
        		const obj = Text({
        			text: 'Hello',
        			font: 'SCPLIGHT',
        			color: new THREE.Color('rgb(125,163,192)'),
        		});

        		obj.position.z = -3;

        		return obj;
        	}}
        />
    </RenderDevice>
);

export default () => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
};
