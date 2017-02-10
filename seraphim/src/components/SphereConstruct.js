import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereConstruct = (props) => {
    return <RenderObject {...props} 

        onRender3D={() => {
            const draft = new Draft();
            const dist = 256;

            switch (props.mode) {
                case 'A':
                    draft.drawHexPod({ radius: dist * 0.3, count: 3, step: dist * 0.07 });
                    break;
                case 'B':
                    draft.drawChevron({ y: dist * 0.45, radius: dist * 0.8, angle: Math.PI * 1.5 });
                    draft.drawChevron({ y: dist * 0.35, radius: dist * 0.8, angle: Math.PI * 1.5 });
                    draft.drawChevron({ y: dist * 0.25, radius: dist * 0.8, angle: Math.PI * 1.5 });
                    break;
                case 'C':
                    draft.drawDiamond({ x: 0, y: 0, w: dist, h: dist, filled: false });
                    break;
            }

            return draft.tessellate(16).build(Projection.sphere(props.sphereRadius, 1));
        }}

    />;
};

SphereConstruct.defaultProps = {
    sphereRadius: 512,
};

export default SphereConstruct;
