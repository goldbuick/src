import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereConstruct = (props) => {
    return <RenderObject {...props} 

        onRender3D={() => {
            const draft = new Draft();

            if (props.onConstruct) {
                props.onConstruct(draft);
            } else {
                const radius = 256;
                draft.drawHexPod({ radius: radius, count: 3, step: radius * 0.1 });
            }

            return draft.tessellate(16).build(Projection.sphere(props.sphereRadius, 1));
        }}

    />;
};

SphereConstruct.defaultProps = {
    sphereRadius: 512,
};

export default SphereConstruct;
