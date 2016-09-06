import React from 'react';
import Scene from './Scene';
import TestMesh from './TestMesh';

const THREE = require('three');

export default class Page extends React.Component {

    render() {
        return <Scene>
            <TestMesh position-x={-512}/>
            <TestMesh position-x={512} spin={3}/>
        </Scene>;
    }

}
