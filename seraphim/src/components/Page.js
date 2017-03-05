import React from 'react';
import Scene from './Scene';
import MouseWheel from '../util/MouseWheel';

import TestSphere from './TestSphere';

export default class Page extends React.Component {

    constructor(...args) {
        super(...args);
        this.pointers = {};
        this.view = {
            layer: 1,
            holding: 0,
            spin: { dx: 0, dy: 0, dz: 0 }
        };
        this.mousewheel = new MouseWheel({
            onSwipeUp: () => this.changeShowLayer(-1),
            onSwipeDown: () => this.changeShowLayer(1)
        });
    }

    handleResize = (renderer, composer, scene, camera, width, height) => {
        this.view.width = width;
        this.view.height = height;
    }

    changeShowLayer(delta) {
        this.view.layer = Math.max(0, Math.min(3, this.view.layer + delta));
    }

    pointerDelta(id, pressed, x, y) {
        let pointer = this.pointers[id];
        if (pointer === undefined) {
            pointer = { x, y };
            this.pointers[id] = pointer;
        }
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        pointer.x = x;
        pointer.y = y;
        if (pressed === false) {
            delete this.pointers[id];
        }        
        return { dx, dy };
    }

    handlePointer = (e, id, pressed, x, y) => {
        e.preventDefault();
        const { dx, dy } = this.pointerDelta(id, pressed, x, y);

        if (pressed && !this.view.pressed) {
            this.view.holding = 1;
            this.view.spin.dz = (x < this.view.width * 0.5) ? -1 : 1;
        }
        if (!pressed || dx > 3 || dy > 3) {
            this.view.holding = 0;
            this.view.spin.dz = 0;
        }
        
        this.view.spin.dx = dy;
        this.view.spin.dy = dx;
        this.view.pressed = pressed;
    }

    render() {
        const sceneProps = {
            onResize: this.handleResize,
            onPointer: this.handlePointer,
            onWheel: this.mousewheel.onWheel,
        };

        return (
            <Scene {...sceneProps}>
                <TestSphere view={this.view} />
            </Scene>
        );
    }

}
