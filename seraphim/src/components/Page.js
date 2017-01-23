import React from 'react';
import Scene from './Scene';
import TestRender from './TestRender';

export default class Page extends React.Component {

    render() {
        return <Scene><TestRender/></Scene>;
    }

}
