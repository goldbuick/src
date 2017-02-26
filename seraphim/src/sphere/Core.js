import React from 'react';
import TWEEN from 'tween.js';
import Draft from '../viz/Draft';
import intro from '../anim/intro';
import RenderObject from '../render/RenderObject';

import Mantle from './Mantle';
import Barrier from './Barrier';
import MantleGem from './MantleGem';
import SubStrate from './SubStrate';
import BarrierGem from './BarrierGem';

const Sphere = (props) => {

    return <RenderObject {...props}
        name="Sphere"
        
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
            let target = {};
            switch (props.view.layer) {
                case 0:
                    target.mantleY = 0;
                    target.barrierY = props.radius * -0.5;
                    target.substrateY = props.radius * -0.25;
                    target.mantleScale = 1.2;
                    break;
                case 1:
                    target.mantleY = 0;
                    target.barrierY = 0;
                    target.substrateY = 0;
                    target.mantleScale = 1;
                    break;
                case 2:
                    target.mantleY = props.radius * 1.5;
                    target.barrierY = props.barrierDist * 0.5;
                    target.substrateY = 0;
                    target.mantleScale = 1;
                    break;
                case 3:
                    target.mantleY = props.radius * 2;
                    target.barrierY = props.barrierDist + 200;
                    target.substrateY = props.radius - props.barrierDist;
                    target.mantleScale = 1;
                    break;
            }

            if (animateState.layer !== props.view.layer) {
                // only trigger tween when view.layer changes
                animateState.layer = props.view.layer;
                // make sure we have starting values
                ['mantleY', 'barrierY', 'substrateY', 'mantleScale'].forEach(attr => {
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
                    }, 400)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }

            const mantle = RenderObject.byType(object3D.children, Mantle)[0];
            mantle.position.y = animateState.mantleY;
            mantle.scale.setScalar(animateState.mantleScale);

            const spinScale = -0.0001;
            if (animateState.spin === undefined) {
                animateState.spin = new THREE.Quaternion();
            }
            if (props.view.spin.x) {
                const euler = new THREE.Euler(0, props.view.spin.x * spinScale, 0);
                animateState.spin = new THREE.Quaternion().multiplyQuaternions(
                    new THREE.Quaternion().setFromEuler(euler),
                    animateState.spin,
                );
            }
            if (props.view.spin.y) {
                const euler = new THREE.Euler(props.view.spin.y * spinScale, 0, 0);
                animateState.spin = new THREE.Quaternion().multiplyQuaternions(
                    new THREE.Quaternion().setFromEuler(euler),
                    animateState.spin,
                );
            }

            props.view.spin.x -= props.view.spin.x * delta;
            props.view.spin.y -= props.view.spin.y * delta;
            mantle.quaternion.copy(animateState.spin);

            const barriers = RenderObject.byType(object3D.children, Barrier);
            RenderObject.animate(barriers, animateState, (barrier, anim, index) => {
                intro.secondary(anim, 'position', 400, () => {
                    return props.barrierDist + (index * props.barrierStep);
                });
                barrier.position.y = -anim.position;
                barrier.position.y += animateState.barrierY;
            });

            const substrates = RenderObject.byType(object3D.children, SubStrate);
            RenderObject.animate(substrates, animateState, (substrate, anim, index) => {
                intro.secondary(anim, 'position', 400, () => {
                    return props.radius + props.substrateDist - (index * props.substrateStep);
                });
                substrate.position.y = -anim.position;
                substrate.position.y += animateState.substrateY;
            });            
        }}
    />;
};

Sphere.defaultProps = {
    view: {
        layer: 1,
        spin: { x: 0, y: 0 }
    },
    radius: 512,
    barrierGap: 200,
    barrierStep: 64,
    barrierDist: 128,
    substrateDist: 64,
    substrateStep: 32,
};

export default Sphere;
