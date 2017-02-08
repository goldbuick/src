import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereConstruct = (props) => {
    return <RenderObject {...props} 

        onRender3D={() => {
            const draft = new Draft();

            draft.drawRange({ from: -3, to: 3, fn: (draft, v) => {
                const dist = 256;
                draft.drawHexPod({ y: v * dist, radius: dist * 0.3, count: 3, step: dist * 0.07 });
                if (v !== 0) draft.drawHexPod({ x: v * dist, y: dist, radius: dist * 0.3, count: 3, step: dist * 0.07 });
            }});

            return draft.tessellate(16).build(Projection.sphere(props.sphereRadius, 1));
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.y += delta * 0.5;
        }}

    />;
};

SphereConstruct.defaultProps = {
    sphereRadius: 512,
};

export default SphereConstruct;
