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

    drawDashesWith({ points, gap, color } = {}) {
        let pt, a, b, len, c = new THREE.Vector3();
        for (let i=0; i < points.length - 1; ++i) {
            pt = points[i];
            a = new THREE.Vector3(pt.x, pt.y, pt.z);
            pt = points[i + 1];
            b = new THREE.Vector3(pt.x, pt.y, pt.z);

            c.subVectors(b, a);
            c.normalize();

            a.addScaledVector(c, gap);
            b.addScaledVector(c, -gap);

            this.drawLine([ a, b ], color);
        }
    }

    drawLinesWith({ ipoints, opoints, color } = {}) {
        for (let i=0; i < ipoints.length; ++i) {
            this.drawLine([ipoints[i], opoints[i]], color);
        }
    }

    drawGridLines({ cx, cy, cz, points, color } = {}) {
        let offset, segment;
        for (let iz=0; iz < cz; ++iz) {
            // draw x lines
            if (cx > 1) {
                for (let iy=0; iy < cy; ++iy) {
                    segment = [ ];
                    for (let ix=0; ix < cx; ++ix) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawLine(segment, color);
                }
            }
            // draw y lines
            if (cy > 1) {
                for (let ix=0; ix < cx; ++ix) {
                    segment = [ ];
                    for (let iy=0; iy < cy; ++iy) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawLine(segment, color);
                }
            }
        }
        // draw z lines
        if (cz > 1) {
            for (let iy=0; iy < cy; ++iy) {
                for (let ix=0; ix < cx; ++ix) {
                    segment = [ ];
                    for (let iz=0; iz < cz; ++iz) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawLine(segment, color);
                }
            }
        }
    }

    drawGridDashes({ cx, cy, cz, gap, points, color } = {}) {
        let offset, segment;
        for (let iz=0; iz < cz; ++iz) {
            // draw x lines
            if (cx > 1) {
                for (let iy=0; iy < cy; ++iy) {
                    segment = [ ];
                    for (let ix=0; ix < cx; ++ix) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawDashesWith({ points: segment, gap, color });
                }
            }
            // draw y lines
            if (cy > 1) {
                for (let ix=0; ix < cx; ++ix) {
                    segment = [ ];
                    for (let iy=0; iy < cy; ++iy) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawDashesWith({ points: segment, gap, color });
                }
            }
        }
        // draw z lines
        if (cz > 1) {
            for (let iy=0; iy < cy; ++iy) {
                for (let ix=0; ix < cx; ++ix) {
                    segment = [ ];
                    for (let iz=0; iz < cz; ++iz) {
                        offset = ix + (iy * cx) + (iz * cx * cy);
                        segment.push(points[offset]);
                    }
                    this.drawDashesWith({ points: segment, gap, color });
                }
            }
        }
    }

    drawHatchLines({ points, length=32, color } = {}) {
        for (let i=0; i < points.length; ++i) {
            let pt = points[i];
            this.drawLine([{
                x: pt.x - length, y: pt.y, z: pt.z
            },{
                x: pt.x, y: pt.y + length, z: pt.z
            }], color);
            this.drawLine([{
                x: pt.x, y: pt.y, z: pt.z
            },{
                x: pt.x + length, y: pt.y - length, z: pt.z
            }], color);
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