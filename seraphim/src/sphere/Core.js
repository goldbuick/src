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
            // core should only manage basic position 

            let targetY = {};
            switch (props.showLayer) {
                case 0:
                    targetY.mantleY = 0;
                    targetY.barrierY = props.radius * -0.5;
                    targetY.substrateY = props.radius * -0.25;
                    break;
                case 1:
                    targetY.mantleY = 0;
                    targetY.barrierY = 0;
                    targetY.substrateY = 0;
                    break;
                case 2:
                    targetY.mantleY = props.radius * 1.5;
                    targetY.barrierY = props.barrierDist * 0.5;
                    targetY.substrateY = 0;
                    break;
                case 3:
                    targetY.mantleY = props.radius * 2;
                    targetY.barrierY = props.barrierDist + 200;
                    targetY.substrateY = props.radius - props.barrierDist;
                    break;
            }

            if (animateState.showLayer !== props.showLayer) {
                // only trigger tween when showLayer changes
                animateState.showLayer = props.showLayer;
                // make sure we have starting values
                ['mantleY', 'barrierY', 'substrateY'].forEach(attr => {
                    if (animateState[attr] === undefined) animateState[attr] = targetY[attr];
                });
                // trigger tween
                new TWEEN
                    .Tween(animateState)
                    .to({
                        mantleY: targetY.mantleY,
                        barrierY: targetY.barrierY,
                        substrateY: targetY.substrateY,
                    }, 400)
                    .easing(TWEEN.Easing.Exponential.InOut)
                    .start();
            }

            const mantle = RenderObject.byType(object3D.children, Mantle)[0];
            mantle.position.y = animateState.mantleY;

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
    radius: 512,
    showLayer: 0,
    barrierGap: 200,
    barrierStep: 64,
    barrierDist: 128,
    substrateDist: 64,
    substrateStep: 32,
};

export default Sphere;
