const THREE = require('three');
import VizGen from './VizGen';
import VizFont from './VizFont';
import VizGlyph from './VizGlyph';

const WHITE = new THREE.Color(1, 1, 1);

class VizEtch {
    
    glyph = new VizGlyph()

    tessellate(step) {
        return this.glyph.tessellate(step);
    }

    build(transform) {
        return this.glyph.build(transform);
    }

    drawPoints(points, color=WHITE) {
        let offset = this.glyph.count;
        points.forEach(vert => this.glyph.addVert(vert.x, vert.y, vert.z, color));
        for (let i=0; i < points.length; ++i) {
            this.glyph.addPoint(offset + i);
        }
    }

    drawLine(points, color=WHITE) {
        let offset = this.glyph.count;
        points.forEach(vert => this.glyph.addVert(vert.x, vert.y, vert.z, color));
        for (let i=0; i < points.length-1; ++i) {
            this.glyph.addLine(offset + i, offset + i + 1);
        }
    }

    drawLoop({ x, y, z, steps, radius, front, back, drift, bump, color, 
        skip, r, threshold } = {}) {

        if (skip) {
            let fn = (i => i % skip === 0);
            this.drawLoopFn({ x, y, z, steps, radius, front, back, drift, bump, color, fn });
            return;
        }

        if (threshold) {
            let fn = (r() < threshold);
            this.drawLoopFn({ x, y, z, steps, radius, front, back, drift, bump, color, fn });            
        }

        this.drawLine(VizGen.arc({ x, y, z, steps, radius, front, back, drift, bump}), color);
    }

    drawLoopFn({ x, y, z, steps, radius, front, back, drift, bump, color, fn } = {}) {
        let points = [ ],
            source = VizGen.arc({ x, y, z, steps, radius, front, back, drift, bump});

        let i = 0;
        while (source.length) {
            points.push(source.shift());
            if (points.length > 1) {
                this.drawLine(points, color);
                if (fn(i++)) {
                    points = [ ];
                } else {
                    points.shift();
                }
            }
        }
    }

    drawRect({ x, y, w, h, z=0, color, alpha=1 } = {}) {
        let offset = this.glyph.count,
            hw = w * 0.5,
            hh = h * 0.5;

        this.glyph.addVert(x - hw, y - hh, z, color);
        this.glyph.addVert(x + hw, y - hh, z, color);
        this.glyph.addVert(x - hw, y + hh, z, color);
        this.glyph.addVert(x + hw, y + hh, z, color);
        this.glyph.addFill(offset, offset + 1, offset + 2, alpha);
        this.glyph.addFill(offset + 2, offset + 1, offset + 3, alpha);
    }

    drawCircle({ x, y, z, steps, radius, front, back, drift, bump, color, alpha=1 } = {}) {
        let offset = this.glyph.count,
            points = VizGen.arc({ x, y, z, steps, radius, front, back, drift, bump}),
            center = offset,
            base = center + 1;

        this.glyph.addVert(x, y, z, color);
        for (let i=0; i < points.length; ++i) {
            this.glyph.addVert(points[i].x , points[i].y, points[i].z, color);
        }

        for (let i=0; i < points.length-1; ++i) {
            this.glyph.addFill(center, base + i + 1, base + i, alpha);
        }
    }

    drawSwipeWith({ ipoints, opoints, color, alpha=1 } = {}) {
        let offset = this.glyph.count;
        ipoints.forEach(vert => this.glyph.addVert(vert.x , vert.y, vert.z, color));
        opoints.forEach(vert => this.glyph.addVert(vert.x , vert.y, vert.z, color));

        let base, len = ipoints.length;
        for (let i=0; i < len-1; ++i) {
            base = offset + i;
            this.glyph.addFill(base, base + 1, base + len, alpha);
            this.glyph.addFill(base + len, base + 1, base + len + 1, alpha);
        }
    }

    drawSwipeLineWith({ ipoints, opoints, color }) {
        this.drawLine(ipoints, color);
        this.drawLine(opoints, color);        
    }

    drawSwipe({ x, y, z, steps, radius, width, front, back, drift, bump, color, alpha=1 } = {}) {
        let innerRadius = radius,
            outerRadius = radius + width,
            ipoints = VizGen.arc({ x, y, z, steps, radius: innerRadius, front, back, drift, bump }),
            opoints = VizGen.arc({ x, y, z, steps, radius: outerRadius, front, back, drift, bump });
        this.drawSwipeWith({ ipoints, opoints, color, alpha });
    }

    drawSwipeAlt({ x, y, z, steps, radius, width, front, back, drift, bump, color, alpha=1 } = {}) {
        let ipoints = VizGen.arc({ x, y, z, steps, radius, front, back, drift, bump }),
            opoints = VizGen.arc({ x, y: y + width, z, steps, radius, front, back, drift, bump });
        this.drawSwipeWith({ ipoints, opoints, color, alpha });
    }

    drawSwipeLine({ x, y, z, steps, radius, width, front, back, drift, bump, color }) {
        let innerRadius = radius,
            outerRadius = radius + width,
            ipoints = VizGen.arc({ x, y, z, steps, radius: innerRadius, front, back, drift, bump }),
            opoints = VizGen.arc({ x, y, z, steps, radius: outerRadius, front, back, drift, bump });
        this.drawSwipeLineWith({ ipoints, opoints, color });
    }

    drawSwipeLineAlt({ x, y, z, steps, radius, width, front, back, drift, bump }) {
        let ipoints = VizGen.arc({ x, y, z, steps, radius, front, back, drift, bump }),
            opoints = VizGen.arc({ x, y: y + width, z, steps, radius, front, back, drift, bump });
        this.drawSwipeLineWith({ ipoints, opoints, color });
    }

}

export default VizEtch;
