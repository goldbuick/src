import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import GenAlgo from '../viz/GenAlgo';
import GenPoints from '../viz/GenPoints';
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
                const dist = props.radius * Math.PI;
                const ipoints = [{ x: 0.5, y: -thick, z: 0, },{ x: dist, y: -thick, z: 0, }];
                const opoints = [{ x: 0.5, y:  thick, z: 0, },{ x: dist, y:  thick, z: 0, }];
                draft.drawSwipeWith({ ipoints, opoints, alpha: true });

                const tsize = 1.5;
                const tangle = Math.PI * 0.5;
                const tpoints = GenPoints.triangle({ radius: tsize, angle: tangle });
                const twidth = tpoints[2].x - tpoints[1].x;
                const theight = tpoints[1].y - tpoints[0].y;
                const thw = twidth * 0.5;
                const thh = theight * 0.5;
                for (let i=0; i < Math.round(dist / twidth); ++i) {
                    if (rng() < 0.4) draft.drawTriangle({ x: i * twidth + thw, y: thh *  3, radius: tsize, angle: tangle, filled: rng() < 0.2 });
                    if (rng() < 0.4) draft.drawTriangle({ x: i * twidth,       y: thh *  1, radius: tsize, angle: tangle, filled: rng() < 0.2 });
                    if (rng() < 0.4) draft.drawTriangle({ x: i * twidth + thw, y: thh * -1, radius: tsize, angle: tangle, filled: rng() < 0.2 });
                    if (rng() < 0.4) draft.drawTriangle({ x: i * twidth,       y: thh * -3, radius: tsize, angle: tangle, filled: rng() < 0.2 });
                }
            }

            return draft.tessellate(16).build(Projection.column(props.radius, 1));
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.y += delta * 0.1;
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
