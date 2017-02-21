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
            let draft;
            const tessellate = 32;
            const base = new THREE.Object3D();
            const rng = GenAlgo.rng({ seed: uuid });
            const noise = GenAlgo.noise({ seed: uuid });

            draft = new Draft();
            const dist = props.radius * Math.PI;
            draft.drawLine([{ x: 0, y: 0, z: 0 },{ x: dist, y: 0, z: 0 }])
            base.add(draft.
                tessellate(tessellate).
                build(Projection.column(props.radius, 1)));

            draft = new Draft();
            const tsize = 1.5;
            const tangle = Math.PI * 0.5;
            const tpoints = GenPoints.triangle({ radius: tsize, angle: tangle });
            const twidth = tpoints[2].x - tpoints[1].x;
            const theight = tpoints[1].y - tpoints[0].y;
            const thw = twidth * 0.5;
            const thh = theight * 0.5;
            const nx = 0.01;
            const ny = 0.21;
            const nplink = 0.3;
            const nsparce = 0.5;
            const tangle2 = Math.PI * -0.5;
            for (let i=0; i < Math.round(dist / twidth); ++i) {
                const a = noise.noise2D(i * nx, 0 * ny) < 0 && rng() < nsparce;
                const b = noise.noise2D(i * nx, 1 * ny) < 0 && rng() < nsparce;
                const c = noise.noise2D(i * nx, 2 * ny) < 0 && rng() < nsparce;
                const d = noise.noise2D(i * nx, 3 * ny) < 0 && rng() < nsparce;
                if (a) draft.drawTriangle({ x: i * twidth + thw, y: thh *  3, radius: tsize, angle: tangle2, filled: rng() < nplink });
                if (b) draft.drawTriangle({ x: i * twidth,       y: thh *  1, radius: tsize, angle: tangle2, filled: rng() < nplink });
                if (c) draft.drawTriangle({ x: i * twidth + thw, y: thh * -1, radius: tsize, angle: tangle,  filled: rng() < nplink });
                if (d) draft.drawTriangle({ x: i * twidth,       y: thh * -3, radius: tsize, angle: tangle,  filled: rng() < nplink });
            }
            base.add(draft.
                tessellate(tessellate).
                build(Projection.column(props.radius, 1)));

            return base;
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
