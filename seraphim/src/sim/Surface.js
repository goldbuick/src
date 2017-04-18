import React from 'react';
import Scene from './Scene';
import Screen from '../render/Screen';

export default class Surface extends React.Component {

    render() {
        return (
            <Scene>
                {this.props.children}
            </Scene>
        );
    }

}
