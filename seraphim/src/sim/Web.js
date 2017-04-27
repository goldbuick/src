import React from 'react';
import WebScene from './WebScene';
import WebScreen from './WebScreen';
import RenderObject from '../render/RenderObject';

export default class Web extends React.PureComponent {

    handleOnInputEvent = (e) => {
        // console.log(e);
    }

    handleAnimate3D = (object3D, animateState, delta) => {
        const ids = object3D.children.map((child) => child.uuid);
        const layoutHash = ids.join('-');
        // console.log(layoutHash);
        // console.log(object3D.children.map(child => child.uuid));
    }

    render() {
        return (
            <WebScene onInputEvent={this.handleOnInputEvent}>
                <RenderObject
                    onChildren3D={this.handleChildren3D}
                    onAnimate3D={this.handleAnimate3D}>
                    {this.props.children}
                </RenderObject>
            </WebScene>
        );
    }

}
