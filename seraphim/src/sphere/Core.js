import React from 'react';
import TWEEN from 'tween.js';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import { pick } from '../util/UtilObject';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

import Mantle from './Mantle';
import Barrier from './Barrier';
import MantleGem from './MantleGem';
import SubStrate from './SubStrate';
import BarrierGem from './BarrierGem';

const Sphere = (props) => {
    const smallScale = 0.00001;

    return <RenderObject {...props}
        name="Sphere"
        
        onChildren3D={(children) => {
            const childProps1 = pick(props, 
                'radius',
                'tweenDelay',
                'tweenDuration1',
                'tweenDuration2',
                'tweenAlgo1',
                'tweenAlgo2');
            const childProps2 = {...childProps1, radius: childProps1.radius + 200};

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

            const barriers = RenderObject.byType(object3D.children, Barrier);
            RenderObject.animate(barriers, animateState, (barrier, anim, index) => {
                if (anim.scale === undefined) {
                    anim.scale = smallScale;
                    anim.position = -300;
                    const targetPosition = 100;
                    new TWEEN.Tween(anim).to({ scale: 1 }, props.tweenDuration1)
                        .easing(props.tweenAlgo1).delay(props.tweenDelay).start();
                    new TWEEN.Tween(anim).to({ position: targetPosition }, props.tweenDuration2)
                        .easing(props.tweenAlgo2).delay(props.tweenDelay).start();                    
                }
                barrier.scale.setScalar(anim.scale);
                barrier.position.y = -anim.position;
            });

            const substrates = RenderObject.byType(object3D.children, SubStrate);
            RenderObject.animate(substrates, animateState, (substrate, anim, index) => {
                if (anim.scale === undefined) {
                    anim.scale = smallScale;
                    anim.position = 400;
                    const targetPosition = props.radius + props.substrateDist - (index * props.substrateStep);
                    new TWEEN.Tween(anim).to({ scale: 1 }, props.tweenDuration1)
                        .easing(props.tweenAlgo1).delay(props.tweenDelay).start();
                    new TWEEN.Tween(anim).to({ position: targetPosition }, props.tweenDuration2)
                        .easing(props.tweenAlgo2).delay(props.tweenDelay).start();                    
                }
                substrate.rotation.x = Math.PI * -0.5;
                substrate.scale.setScalar(anim.scale);
                substrate.position.y = -anim.position;
            });
            
        }}
    />;
};

Sphere.defaultProps = {
    radius: 512,
    substrateDist: 64,
    substrateStep: 32,
    // anim props
    tweenDelay: 256,
    tweenDuration1: 400,
    tweenDuration2: 1400,
    tweenAlgo1: TWEEN.Easing.Back.Out,
    tweenAlgo2: TWEEN.Easing.Elastic.Out,
};

export default Sphere;
