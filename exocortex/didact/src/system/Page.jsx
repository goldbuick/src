import React from 'react';
import Scene from './Scene';
import TestRenderer from '../paracord/TestRenderer';

const THREE = require('three');

export default class Page extends React.Component {

    render() {
        return <Scene><TestRenderer/></Scene>;
    }

}
