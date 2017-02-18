import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import GenAlgo from '../viz/GenAlgo';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

import BarrierGem from './BarrierGem';

const Barrier = (props) => {
    return <RenderObject {...props}
        name="Barrier"

        onRender3D={(uuid) => {
            const columnScale = 3;
            const draft = new Draft();
            const rng = GenAlgo.rng({ seed: uuid });

            if (props.onBarrier) {
                props.onBarrier(draft);
            } else {
                const thick = 2;
                const thick2 = thick * 2;
                const dist = props.radius * Math.PI;
                const ipoints = [{ x: 0, y: -thick, z: 0, },{ x: dist, y: -thick, z: 0, }];
                const opoints = [{ x: 0, y:  thick, z: 0, },{ x: dist, y:  thick, z: 0, }];
                draft.drawSwipeWith({ ipoints, opoints, alpha: true });
                for (let i=0; i < 5; ++i) {
                    const y = thick - rng() * thick2;
                    const points = [{ x: rng() * dist, y, z: 0 },{ x: rng() * dist, y, z: 0 }];
                    draft.drawLine(points);
                }
            }

            return draft.tessellate(16).build(Projection.column(props.radius, 1));
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.y += delta * 0.2;
            object3D.position.y = -64;

            const barrierGems = RenderObject.byType(object3D.children, BarrierGem);
            RenderObject.animate(barrierGems, animateState, (barrierGem, anim, index) => {
                barrierGem.rotation.y = (index / barrierGems.length) * Math.PI * 2;
            });
        }}

    />;
};

Barrier.defaultProps = {
    radius: 512,
};

export default Barrier;
