import React from 'react';
import TWEEN from 'tween.js';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import { pick } from '../util/UtilObject';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';
import { first, range, flatten } from '../util/UtilArray';

import SphereMantle from './SphereMantle';
import SphereBarrier from './SphereBarrier';
import SphereMantleGem from './SphereMantleGem';
import SphereSubStrate from './SphereSubStrate';
import SphereBarrierGem from './SphereBarrierGem';

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
            const childProps2 = {...childProps1, radius: childProps1.radius + 64};

            const mantleGems = RenderObject.byType(children, SphereMantleGem, childProps1);
            const mantle = <SphereMantle>{mantleGems}</SphereMantle>;

            const barrierGems = RenderObject.byType(children, SphereBarrierGem, childProps2);
            const barrier = <SphereBarrier>{barrierGems}</SphereBarrier>;

            return [
                RenderObject.byType([mantle], SphereMantle, childProps1),
                RenderObject.byType([barrier], SphereBarrier, childProps2),
                RenderObject.byType(children, SphereSubStrate, childProps1),
            ];
        }}

        onAnimate3D={(object3D, animateState, delta) => {

            const substrates = RenderObject.byType(object3D.children, SphereSubStrate);
            RenderObject.animate(substrates, animateState, (substrate, anim, index) => {
                substrate.rotation.x = Math.PI * 0.5;
                if (anim.scale === undefined) {
                    anim.scale = smallScale;
                    anim.position = 1024;
                    const targetPosition = props.radius + props.substrateDist + (index * props.substrateStep);
                    new TWEEN.Tween(anim).to({ scale: 1 }, props.tweenDuration1).easing(props.tweenAlgo1).delay(props.tweenDelay).start();
                    new TWEEN.Tween(anim).to({ position: targetPosition }, props.tweenDuration2).easing(props.tweenAlgo2).delay(props.tweenDelay).start();                    
                }
                substrate.scale.setScalar(anim.scale);
                substrate.position.y = -anim.position;
                substrate.rotation.z += delta * (index % 2 === 0 ? 0.1 : -0.1);
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
