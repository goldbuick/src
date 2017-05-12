import GenAlgo from '../viz/GenAlgo';

export default function MRadialGraph(props, draft) {
    const PI2 = Math.PI * 2;
    const radius = props.radius * 0.12;
    const rng = GenAlgo.rng({ seed: props.uuid });

    draft.drawSwipe({ radius, steps: 64, width: 2 });
    draft.drawFeatherArc({ radius, z: 8, count: 8, r: rng, width: 1, drift: 0.3, depth: 0.5 });

    const lsize = 200;
    let level = rng() * lsize;
    const data = GenAlgo.range({ from: 0, to: 144 }).map(v => {
        level += 20 - rng() * 40;
        if (level < 0) level = 0;
        if (level > lsize) level = lsize;
        return level;
    });

    const dataRange = radius * 0.8;
    let dataAngle = PI2 / data.length;
    const dataMax = Math.max.apply(Math, data);
    const vec = (v, a, z=0) => ({ x: Math.cos(a) * v, y: Math.sin(a) * v, z });

    const rgap = 8;
    const r1 = radius + rgap;
    const rdata = data.map(v => Math.round((v / dataMax) * dataRange));
    const ipoints = rdata.map((v, i) => vec(r1, i * dataAngle));
    const opoints = rdata.map((v, i) => vec(r1 + v, i * dataAngle));

    draft.drawLinesWith({ ipoints, opoints });

    // notches
    const nt = 24;
    const depth = -10;
    const r2 = radius - rgap * 2;
    const r3 = radius - rgap;
    const r4 = r1 + dataRange + rgap * 2;
    
    let x, y, z;
    dataAngle = PI2 / nt;
    for (let i=0; i < nt; ++i) {
        draft.drawLine([ vec(r2, i * dataAngle, depth), vec(r3, i * dataAngle, depth) ]);
        ({x, y, z} = vec(r2 - rgap, i * dataAngle, depth));
        if (rng() < 0.12) draft.drawTriangle({ x, y, z, radius: 3, angle: i * dataAngle });
    }

    // start arm
    const pointer = 0.2;
    ({x, y, z} = vec(r4, pointer, depth));
    draft.drawLine([ vec(r2, 0, depth), vec(r4, 0, depth), {x, y, z} ]);
    draft.drawSwipe({ x, y, z, steps: 6, radius: 6, width: 3 });

    // mid arm
    ({x, y, z} = vec(r4, Math.PI, depth));
    draft.drawLine([ vec(r2, Math.PI, depth), {x, y, z} ]);
    draft.drawSwipe({ x, y, z, steps: 6, radius: 6, width: 3 });

    return 'm-radial-graph';
}
