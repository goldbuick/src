import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import GenAlgo from '../viz/GenAlgo';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereSubStrate = (props) => {
    return <RenderObject {...props}
        name="SphereSubStrate"

        onRender3D={(uuid) => {
            const draft = new Draft();
            const rng = GenAlgo.rng({ seed: uuid });

            if (props.onSubStrate) {
                props.onSubStrate(draft);
            } else {
                const thick = 4;
                const radius = 256 + props.verta * 32;
                draft.drawCircle({ x: 0, y: 0, z: 0, radius, steps: 64, filled: false });
                draft.drawCircle({ x: 0, y: 0, z: thick, radius, steps: 64, filled: false });
                draft.drawCircle({ x: 0, y: 0, z: -thick, radius, steps: 64, filled: false });
                draft.drawFeatherArc({ x: 0, y: 0, z: 0, radius, count: 16, r: rng, width: 3, depth: 0, drift: 2 });
            }

            return draft.build(Projection.plane(1));
        }}

    />;
};

SphereSubStrate.defaultProps = {
    radius: 512,
};

export default SphereSubStrate;
