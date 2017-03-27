import React from 'react';
import * as THREE from 'three';
import Draft from '../viz/Draft';
import intro from '../anim/intro';
import GenAlgo from '../viz/GenAlgo';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SubStrate = (props) => {    
    return <RenderObject {...props}
        name="SubStrate"

        onRender3D={(uuid) => {
            const base = new THREE.Object3D();
            const draft = new Draft();
            const rng = GenAlgo.rng({ seed: uuid });

            if (props.onSubStrate) {
                props.onSubStrate(draft);
            } else {
                const thick = 4;
                const radius = 128 + props.verta * 100;
                draft.drawSwipe({ radius, steps: 64, width: 32, alpha: true });
                draft.drawCircle({ z: 0, radius, steps: 64, filled: false });
                draft.drawCircle({ z: thick, radius, steps: 64, filled: false });
                draft.drawCircle({ z: -thick, radius, steps: 64, filled: false });
                draft.drawFeatherArc({ radius, count: 8, r: rng, width: 2, drift: 1 });
            }

            const substrate = draft.build(Projection.plane(1));
            substrate.rotation.x = Math.PI * -0.5;
            base.add(substrate);

            return base;
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            intro.primary(animateState, 'scale', intro.CONST.smallScale, 1);
            intro.setScale(animateState, object3D);
        }}
    />;
};

SubStrate.defaultProps = {
    radius: 512,
};

export default SubStrate;
