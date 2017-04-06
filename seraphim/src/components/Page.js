import React from 'react';
import Scene from './Scene';
import Gesture from '../input/Gesture';

import TestSphere from './TestSphere';

export default class Page extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            view: {
                spin: 0,
                holding: 0,
                pointers: {},
                layer: TestSphere.defaultProps.view.layer,
            }
        };

        this.gesture = new Gesture({
            onVelocity: this.spinView,
            onSwipeUp: () => this.changeShowLayer(-1),
            onSwipeDown: () => this.changeShowLayer(1),
        });
    }

    changeShowLayer(delta) {
        const { view } = this.state;
        view.layer = Math.max(0, Math.min(TestSphere.TOTAL_LAYERS, view.layer + delta));
    }

    spinView = (dx, dy, holding) => {
        const { view } = this.state;
        view.spin = dx * 1.5;
        view.holding = holding;
    }

    render() {
        const { view } = this.state;
        const sceneProps = {
            onWheel: this.gesture.onWheel,
            onPointer: this.gesture.onPointer,
        };
        return (
            <Scene {...sceneProps}>
                <TestSphere view={view} />
            </Scene>
        );
    }

}
