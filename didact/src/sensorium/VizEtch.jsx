const THREE = require('three');
import VizGlyph from './VizGlyph';
import VizFont from './VizFont';

class Etch {
    
    glyph = new VizGlyph()

    tessellate(step) {
        return this.glyph.tessellate(step);
    }

    build(transform) {
        return this.glyph.build(transform);
    }

    drawPoints (points, color) {
        let offset = this.glyph.count;

        points.forEach(vert => {
            this.glyph.addVert(vert.x, vert.y, vert.z, color);
        });

        for (let i=0; i < points.length; ++i) {
            this.glyph.addPoint(offset + i);
        }
    }

    drawLine (points, color) {
        let offset = this.glyph.count;

        points.forEach(vert => {
            this.glyph.addVert(vert.x, vert.y, vert.z, color);
        });

        for (let i=0; i < points.length-1; ++i) {
            this.glyph.addLine(offset + i, offset + i + 1);
        }
    }

}

export default Etch;
