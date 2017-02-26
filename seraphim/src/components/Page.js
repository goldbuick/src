import React from 'react';
import Scene from './Scene';
import MouseWheel from '../util/MouseWheel';

import Sphere from '../sphere/Core';
import SphereBarrier from '../sphere/Barrier';
import SphereMantleGem from '../sphere/MantleGem';
import SphereSubStrate from '../sphere/SubStrate';
import SphereBarrierGem from '../sphere/BarrierGem';

import GenAlgo from '../viz/GenAlgo';
import BJunkGraph from '../graphs/BJunkGraph';
import MRadialGraph from '../graphs/MRadialGraph';

export default class Page extends React.Component {

    constructor(...args) {
        super(...args);
        this.pointers = {};
        this.view = {
            layer: 1,
            spin: { x: 0, y: 0 }
        };
        this.mousewheel = new MouseWheel({
            onSwipeUp: () => this.changeShowLayer(-1),
            onSwipeDown: () => this.changeShowLayer(1)
        });
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
        const { dx, dy } = this.pointerDelta(id, pressed, x, y);
        if (this.view.layer <= 1) {
            if (pressed && !this.view.pressed) {
                this.view.spin.x = 0;
                this.view.spin.y = 0;
            }
            this.view.spin.x += dx;
            this.view.spin.y += dy;
            this.view.pressed = pressed;
        }
    }

    render() {
        const radius = 512;
        const sphereMantleGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereMantleGem key={v} onMantleGem={MRadialGraph}/>);
        const sphereSubStrate = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereSubStrate key={v} verta={v*v*0.3}/>);
        const sphereBarrierGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereBarrierGem key={v} onBarrierGem={BJunkGraph}/>);

        return (
            <Scene onWheel={this.mousewheel.onWheel} onPointer={this.handlePointer}>
                <Sphere radius={radius} view={this.view}>
                    {sphereMantleGem(8)}
                    {sphereSubStrate(4)}
                    {sphereBarrierGem(5)}
                </Sphere>
            </Scene>
        );
    }

}
