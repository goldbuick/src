import React from 'react';
import WebScene from './WebScene';
// import WebScreen from './WebScreen';
import RenderObject from '../render/RenderObject';

export default class Web extends React.PureComponent {

    handleOnInputEvent = (e) => {
        // console.log(e);
    }

    handleAnimate3D = (object3D, animateState, delta) => {
        const ids = object3D.children.map((child) => child.uuid);
        const layoutHash = ids.join('-');

        if (animateState.layoutHash !== layoutHash) {
            animateState.positions = {};
            animateState.layoutHash = layoutHash;

            ids.forEach((id, index) => {
                animateState.positions[id] = {
                    x: 0,
                    y: index * -350
                };
            });
        }

        object3D.children.forEach(child => {
            const position = animateState.positions[child.uuid];
            if (position) {
                child.position.x = position.x;
                child.position.y = position.y;
            }
        })
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
