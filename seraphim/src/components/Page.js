import React from 'react';
import Scene from './Scene';

import TestSphere from './TestSphere';

export default class Page extends React.Component {

    render() {
        return (
            <Scene>
                <TestSphere />
            </Scene>
        );
    }

}
