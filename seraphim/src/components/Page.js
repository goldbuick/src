import React from 'react';
import Scene from './Scene';
import { range } from '../util/UtilArray';

import Sphere from './Sphere';
import SphereBarrier from './SphereBarrier';
import SphereMantleGem from './SphereMantleGem';
import SphereSubStrate from './SphereSubStrate';
import SphereBarrierGem from './SphereBarrierGem';

const Page = (props) => {
    const radius = 512;
    const sphereMantleGem = (count) => range(1, count).map(v => <SphereMantleGem key={v} mode="A"/>);
    const sphereSubStrate = (count) => range(1, count).map(v => <SphereSubStrate key={v} verta={v}/>);
    const sphereBarrierGem = (count) => range(1, count).map(v => <SphereBarrierGem key={v} mode="A"/>);

    return (
        <Scene>
            <Sphere radius={radius}>
                {sphereMantleGem(5)}
                {sphereSubStrate(1)}
                {sphereBarrierGem(2)}
            </Sphere>
        </Scene>
    );
};

export default Page;

/*
            <Button name="TestButton"
                onRender3D={() => {
                    const base = new Draft().
                        drawRect({ x: 0, y: 0, w: 200, h: 200, color: Theme.color, alpha: true }).
                        drawRange(0, 10, (draft, v) => {
                            const r = 200 + v * 16;
                            draft.drawRect({ x: 0, y: 0, w: r, h: r, color: Theme.color, filled: false });
                        }).
                        build(Projection.plane(1));

                    const flegal = new Draft().
                        drawRange(0, 10, (draft, v) => {
                            const r = 200 + v * 64;
                            draft.drawDiamond({ x: 0, y: 0, w: r, h: r, z: v * -64, color: Theme.color, filled: false });
                        }).
                        build(Projection.plane(1));

                    base.add(flegal);
                    base.userData.flegal = flegal;
                    return base;
                }}

                onAnimate3D={(object3D, animateState, delta) => {
                    object3D.rotation.z = (animateState.angle || 0) * 0.2;
                    object3D.userData.flegal.position.z = (animateState.z || 0);
                    object3D.userData.flegal.rotation.z = (animateState.angle || 0);
                    object3D.userData.flegal.rotation.y = (animateState.angle || 0) * 0.04;
                }} 

                onButton={(object3D, animateState, button) => {
                    if (button === 'clicked') {
                        animateState.z = 0;
                        animateState.angle = 0;
                        let tweenA = new TWEEN.Tween(animateState).
                            to({ angle: Math.PI * 0.5, z: 512 }).
                            easing(TWEEN.Easing.Exponential.InOut);
                        let tweenB = new TWEEN.Tween(animateState).
                            to({ angle: animateState.z, z: animateState.angle }).
                            easing(TWEEN.Easing.Exponential.InOut);
                        tweenA.chain(tweenB);
                        tweenA.start();
                    }
                }}
            />

*/