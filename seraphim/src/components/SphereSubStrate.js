import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereSubStrate = (props) => {
    return <RenderObject {...props}

        onRender3D={() => {
            const draft = new Draft();

            if (props.onSubStrate) {
                props.onSubStrate(draft);
            } else {
                const radius = 256 + props.verta * 32;
                draft.drawHexPod({ radius: radius, count: 4, step: radius * 0.02 });
            }

            return draft.build(Projection.plane(1));
        }}

    />;
};

SphereSubStrate.defaultProps = {
    sphereRadius: 512,
};

export default SphereSubStrate;
