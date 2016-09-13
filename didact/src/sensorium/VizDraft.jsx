const THREE = require('three');

import VizGen from './VizGen';
import VizEtch from './VizEtch';

class VizDraft extends VizEtch {

    drawHexPod({ x, y, z, radius, count, step, color } = {}) {
        for (let i=0; i < count; ++i) {
            this.drawLoop({ x, y, z, steps: 6, radius, color });
            radius += step;
        }
    }

    drawFeatherArc({ x, y, z, radius, count, r, width, depth, drift, color, alpha } = {}) {
        for (let i=0; i < count; ++i) {
            let _z = z + (i * -depth),
                twist = Math.floor((r() - 0.5) * 32),
                arc = 45 + Math.floor(r() * 20);
            this.drawSwipe({
                x, y, _z, steps: 128, radius, width, 
                front: arc - twist, back: arc + twist, 
                drift: -drift, color, alpha });
            radius += width + 2;
        }
    }

    drawChevron({ x, y, z, radius, angle, spread, color } = {}) {
        this.drawLine(VizGen.chevron({ x, y, z, radius, angle, spread, color }));
    }

    drawLinesWith({ ipoints, opoints, color }) {
        for (let i=0; i < ipoints.length; ++i) {
            this.drawLine([ipoints[i], opoints[i]], color);
        }
    }

}

export default VizDraft;

/* more complex structures 

diamond gridded backgrounds
gridded backgrounds
cross hatching fields 
dot fields ( each dot can be scalable )
hex fields ( each hex can be scalable )

linear auto-rigging for skeleton animation

map contours ??

sphere shells - wtf do I mean here ?

identi glyphs !!!

*/