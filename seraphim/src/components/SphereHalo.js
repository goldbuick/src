import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereHalo = (props) => {
    return <RenderObject {...props}

        onRender3D={() => {
            const draft = new Draft();

            if (props.onHalo) {
                props.onHalo(draft);
            } else {
                const radius = 128;
                draft.drawHexPod({ radius: radius, count: 4, step: radius * 0.1 });
            }

            return draft.tessellate(16).build(Projection.column(props.sphereRadius, 3));
        }}    
    />;
};

SphereHalo.defaultProps = {
    sphereRadius: 512,
};

export default SphereHalo;
