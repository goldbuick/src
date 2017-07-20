import GenAlgo from 'viz/GenAlgo';
import GenPoints from 'viz/GenPoints';

export default function BJunkGraph(props, draft) {
      const rng = GenAlgo.rng({ seed: props.uuid });

      const count = 5;
      const depth = 5;
      draft.drawFeatherArc({ z: count * depth * 0.5, arc: 10, bump: Math.PI * 1.5, radius: 32, count, r: rng, width: 1, drift: 0.15, depth });
      
      const ptstep = 32;
      const ptangle = Math.PI * 0.25;
      const pt1 = GenPoints.vec({ radius: ptstep,     angle: ptangle });
      const pt2 = GenPoints.vec({ radius: ptstep * 2, angle: ptangle });
      const pt3 = {...pt2, x: pt2.x + ptstep * 0.5};
      draft.drawLine([pt1, pt2, pt3]);
      draft.drawSwipe({ x: pt3.x, y: pt3.y, z: pt3.z, steps: 6, radius: 4, width: 2 });

    return 'b-junk-graph';
}
