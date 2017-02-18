import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import GenAlgo from '../viz/GenAlgo';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SubStrate = (props) => {
    return <RenderObject {...props}
        name="SubStrate"

        onRender3D={(uuid) => {
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

            return draft.build(Projection.plane(1));
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.z += delta * 0.1;
        }}
    />;
};

SubStrate.defaultProps = {
    radius: 512,
};

export default SubStrate;
