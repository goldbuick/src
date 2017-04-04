import React from 'react';
import Scene from './Scene';
import Gesture from '../input/Gesture';

import TestSphere from './TestSphere';

export default class Page extends React.Component {

    state = {
        view: {
            spin: 0,
            holding: 0,
            pointers: {},
            layer: TestSphere.defaultProps.view.layer,
        }
    };

    gesture = new Gesture({
        onVelocity: this.spinView,
        onSwipeLeft: this.logSwipeLeft,
        onSwipeRight: this.logSwipeRight,
        onSwipeUp: () => this.changeShowLayer(-1),
        onSwipeDown: () => this.changeShowLayer(1),
    });

    changeShowLayer(delta) {
        const { view } = this.state;
        view.layer = Math.max(0, Math.min(TestSphere.TOTAL_LAYERS, view.layer + delta));
    }

    logSwipeLeft = () => {
        console.log('logSwipeLeft');
    }

    logSwipeRight = () => {
        console.log('logSwipeLeft');
    }

    spinView = (dx, dy) => {
        console.log(dx, dy);
    }

    // pointerDelta(id, pressed, x, y) {
    //     const { view } = this.state;

    //     let pointer = view.pointers[id];
    //     if (pointer === undefined) {
    //         pointer = { x, y };
    //         view.pointers[id] = pointer;
    //     }
        
    //     const dx = pointer.x - x;
    //     const dy = pointer.y - y;
    //     pointer.x = x;
    //     pointer.y = y;
    //     if (pressed === false) {
    //         delete view.pointers[id];
    //     }

    //     return { dx, dy };
    // }

    // handlePointer = (e, id, pressed, x, y) => {
    //     e.preventDefault();

    //     const { view } = this.state;
    //     const { dx, dy } = this.pointerDelta(id, pressed, x, y);

    //     if (pressed && !view.pressed) view.holding = 1;
    //     if (!pressed || dx > 3 || dy > 3) view.holding = 0;
        
    //     view.spin = dx;
    //     view.pressed = pressed;
    // }

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
