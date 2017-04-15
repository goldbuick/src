import React from 'react';
import Scene from './Scene';
import Screen from '../render/Screen';

import TestSphere from './TestSphere';

export default class Page extends React.Component {

    handleInputEvent = (e) => {
        if (e.center.y > Screen.halfHeight) return true;
    }

    render() {
        return (
            <Scene onInputEvent={this.handleInputEvent}>
                <TestSphere />
            </Scene>
        );
    }

}
