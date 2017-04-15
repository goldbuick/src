import React from 'react';
import TWEEN from 'tween.js';
import * as THREE from 'three';
import intro from '../anim/intro';
import { inertiaRotation } from '../anim/quat';
import RenderObject from '../render/RenderObject';

import Mantle from './Mantle';
import Barrier from './Barrier';
import MantleGem from './MantleGem';
import SubStrate from './SubStrate';
import BarrierGem from './BarrierGem';

const Sphere = RenderObject.Pure((props) => {

    const changeLayer = (layer, delta) => {
        return Math.max(0, Math.min(Sphere.TOTAL_LAYERS, layer + delta));
    };

    return <RenderObject {...props}
        name="Sphere"

        onShell3D={(shell) => shell.sphere(props.radius)}

        onInputEvent={({ type, event, animateState }) => {
            // console.log(type, animateState.view);
            animateState.holding = 0;
            switch (type) {
                default: break;
                case 'pan':
                    animateState.holding = event.isFinal ? 0 : 1;
                    animateState.view.spin = event.isFinal ? 0 : event.velocityX * -10;
                    break;

                case 'swipe':
                    switch (event.direction) {
                        default: break;
                        case RenderObject.DIRECTION.UP: 
                            animateState.view.layer = changeLayer(animateState.view.layer, 1); 
                            break;
                        case RenderObject.DIRECTION.DOWN:
                            animateState.view.layer = changeLayer(animateState.view.layer, -1); 
                            break;
                    }
                    break;
            }
        }}
        
        onChildren3D={(children) => {
            const childProps1 = { radius: props.radius };
            const childProps2 = { radius: props.radius + props.barrierGap };

            const mantleGems = RenderObject.byType(children, MantleGem, childProps1);
            const mantle = <Mantle>{mantleGems}</Mantle>;

            const barrierGems = RenderObject.byType(children, BarrierGem, childProps2);
            const barrier = <Barrier>{barrierGems}</Barrier>;

            return [
                RenderObject.byType([mantle], Mantle, childProps1),
                RenderObject.byType([barrier], Barrier, childProps2),
                RenderObject.byType(children, SubStrate, childProps1),
            ];
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            animateState.view = animateState.view || {
                spin: 0,
                layer: 2,
                holding: 0
            };

            let target = {};
            switch (animateState.view.layer) {
                case 0:
                    target.mantleY = 0;
                    target.barrierY = props.radius * -0.5;
                    target.substrateY = props.radius * -0.25;
                    target.mantleScale = 1.2;
                    target.mantleTilt = Mantle.TILT_AMOUNT;
                    break;
                case 1:
                    target.mantleY = 0;
                    target.barrierY = props.radius * -0.5;
                    target.substrateY = props.radius * -0.25;
                    target.mantleScale = 1.2;
                    target.mantleTilt = -Mantle.TILT_AMOUNT;
                    break;
                case 2:
                default:
                    target.mantleY = 0;
                    target.barrierY = 0;
                    target.substrateY = 0;
                    target.mantleScale = 1;
                    target.mantleTilt = 0;
                    break;
                case 3:
                    target.mantleY = props.radius * 1.5;
                    target.barrierY = props.barrierDist * 0.5;
                    target.substrateY = 0;
                    target.mantleScale = 1;
                    target.mantleTilt = 0;
                    break;
                case 4:
                    target.mantleY = props.radius * 2;
                    target.barrierY = props.barrierDist + 200;
                    target.substrateY = props.radius - props.barrierDist;
                    target.mantleScale = 1;
                    target.mantleTilt = 0;
                    break;
            }

            if (animateState.layer !== animateState.view.layer) {
                // only trigger tween when view.layer changes
                animateState.layer = animateState.view.layer;
                // make sure we have starting values
                ['mantleY', 'barrierY', 'substrateY', 'mantleScale', 'mantleTilt'].forEach(attr => {
                    if (animateState[attr] === undefined) animateState[attr] = target[attr];
                });
                // trigger tween
                new TWEEN
                    .Tween(animateState)
                    .to({
                        mantleY: target.mantleY,
                        barrierY: target.barrierY,
                        substrateY: target.substrateY,
                        mantleScale: target.mantleScale,
                        mantleTilt: target.mantleTilt,
                    }, 500)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }

            const mantle = RenderObject.byType(object3D.children, Mantle)[0];
            mantle.position.y = animateState.mantleY;
            mantle.scale.setScalar(animateState.mantleScale);

            if (animateState.view.holding) animateState.view.holding = Math.min(animateState.view.holding * 2, 512);

            const { spin, layer, holding } = animateState.view;
            const damp = holding * 0.01 + 1;

            animateState.mantle = inertiaRotation(animateState.mantle, 
                0, layer <= 2 ? spin : 0, 0, delta, damp, damp + 3);
            const mantleTilt = new THREE.Quaternion()
                .setFromEuler(new THREE.Euler(animateState.mantleTilt, 0, 0));
            const animRotation = new THREE.Quaternion()
                .multiplyQuaternions(mantleTilt, animateState.mantle.rotation);
            mantle.quaternion.copy(animRotation);

            const barriers = RenderObject.byType(object3D.children, Barrier);
            RenderObject.animate(barriers, animateState, (barrier, anim, index) => {
                intro.secondary(anim, 'position', 400, () => {
                    return props.barrierDist + (index * props.barrierStep);
                });
                barrier.position.y = -anim.position;
                barrier.position.y += animateState.barrierY;

                anim.barrier = inertiaRotation(anim.barrier, 
                    0, layer === 3 ? spin : 0, 0, delta, damp, damp + 3);
                barrier.quaternion.copy(anim.barrier.rotation);
            });

            const substrates = RenderObject.byType(object3D.children, SubStrate);
            RenderObject.animate(substrates, animateState, (substrate, anim, index) => {
                intro.secondary(anim, 'position', 400, () => {
                    return props.radius + props.substrateDist - (index * props.substrateStep);
                });
                substrate.position.y = -anim.position;
                substrate.position.y += animateState.substrateY;

                anim.substrate = inertiaRotation(anim.substrate, 
                    0, layer === 4 ? spin : 0, 0, delta, damp, damp + 3);
                substrate.quaternion.copy(anim.substrate.rotation);
            });            
        }}
    />;
});

Sphere.TOTAL_LAYERS = 4;

Sphere.defaultProps = {
    // view: {
    //     spin: 0,
    //     layer: 2,
    //     holding: 0
    // },
    radius: 512,
    barrierGap: 200,
    barrierStep: 64,
    barrierDist: 128,
    substrateDist: 64,
    substrateStep: 32,
};

export default Sphere;
