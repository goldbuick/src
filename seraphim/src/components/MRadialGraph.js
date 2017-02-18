import GenAlgo from '../viz/GenAlgo';
import { range } from '../util/UtilArray';

export default function MRadialGraph(props, draft) {
    const PI2 = Math.PI * 2;
    const radius = props.radius * 0.12;
    const rng = GenAlgo.rng({ seed: props.uuid });

    draft.drawSwipe({ radius, steps: 64, width: 2 });
    draft.drawFeatherArc({ radius, z: 8, count: 8, r: rng, width: 1, drift: 0.3, depth: 0.5 });

    const data = range(0, 120).map(v => rng() * 200);

    const dataRange = radius * 0.8;
    const dataAngle = PI2 / data.length;
    const dataMax = Math.max.apply(Math, data);
    const vec = (v, i) => ({ x: Math.cos(i * dataAngle) * v, y: Math.sin(i * dataAngle) * v, z: 0 });

    const r1 = radius + 8;
    const rdata = data.map(v => Math.round((v / dataMax) * dataRange));
    const ipoints = rdata.map((v, i) => vec(r1, i));
    const opoints = rdata.map((v, i) => vec(r1 + v, i));

    draft.drawLinesWith({ ipoints, opoints });

    return 'MRadialGraph';
}
