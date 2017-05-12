import React from 'react';
import Web from './Web';
import WebVR from './WebVR';

export default class Driver extends React.PureComponent {

    state = {
        mode: 'web'
    };

    render() {
        if (this.state.mode === 'web') {
            return <Web>{this.props.children}</Web>;
        }
        return <WebVR>{this.props.children}</WebVR>;
    }

}
