import polylineNormals from 'polyline-normals';

let pointMaterial = new THREE.PointsMaterial({
    size: 1,
    sizeAttenuation: false,
    vertexColors: THREE.VertexColors
});

let fillMaterialBack = new THREE.MeshBasicMaterial({
    side: THREE.BackSide,
    vertexColors: THREE.VertexColors
});

let fillMaterialFront = new THREE.MeshBasicMaterial({
    side: THREE.FrontSide,
    vertexColors: THREE.VertexColors
});

let alphaFillMaterialBack = new THREE.MeshBasicMaterial({
    opacity: 0.08,
    transparent: true,
    side: THREE.BackSide,
    vertexColors: THREE.VertexColors
});

let alphaFillMaterialFront = new THREE.MeshBasicMaterial({
    opacity: 0.08,
    transparent: true,
    side: THREE.FrontSide,
    vertexColors: THREE.VertexColors
});

class Glyph {

    constructor() {
        this.count = 0;
        this.colors = [ ];
        this.positions = [ ];
        this.points = [ ];
        this.lines = [ ];
        this.fills = [ ];
        this.alphaFills = [ ];
    }

    addVert(x, y, z, color) {
        this.colors.push(color.r, color.g, color.b);
        this.positions.push(x, y, z);
        return this.count++;
    }

    addPoint(v1) {
        this.points.push(v1);
    }

    addLine(v1, v2) {
        this.lines.push(v1, v2);
    }

    addFill(v1, v2, v3, alpha) {
        if (alpha) {
            this.alphaFills.push(v1, v2, v3);
        } else {
            this.fills.push(v1, v2, v3);
        }
    }

    getColor(index, color) {
        index *= 3;
        color.setRGB(this.colors[index], this.colors[index+1], this.colors[index+2]);
    }

    getPosition(index, vec) {
        index *= 3;
        vec.set(this.positions[index], this.positions[index+1], this.positions[index+2]);
    }

    tessellateLines(step) {
        let done = true,
            lines = [ ];

        let len,
            index,
            dist = new THREE.Vector3(),
            v1 = new THREE.Vector3(),
            v2 = new THREE.Vector3(),
            v3 = new THREE.Vector3(),
            clr = new THREE.Color();

        for (let i=0; i < this.lines.length; i += 2) {
            this.getColor(this.lines[i], clr);
            this.getPosition(this.lines[i], v1);
            this.getPosition(this.lines[i+1], v2);
            dist.subVectors(v2, v1);
            len = dist.length();
            if (len > step) {
                dist.multiplyScalar(0.5);
                v3.addVectors(v1, dist);
                index = this.addVert(v3.x, v3.y, v3.z, clr);
                lines.push(this.lines[i], index);
                lines.push(index, this.lines[i+1]);
                done = false;
            } else {
                lines.push(this.lines[i], this.lines[i+1]);
            }
        }

        this.lines = lines;
        return !done;
    }

    tessellateFills(step) {
        let done = true,
            fills = [ ];

        let len = [ 0, 0, 0 ],
            index = [ 0, 0, 0 ],
            dist = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3()
            ],
            vec = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3() 
            ],
            mid = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3() 
            ],
            clr = new THREE.Color();

        let v;
        for (let i=0; i < this.fills.length; i += 3) {
            this.getColor(this.fills[i], clr);
            for (v=0; v < 3; ++v)
                this.getPosition(this.fills[i+v], vec[v]);

            dist[0].subVectors(vec[1], vec[0]);
            dist[1].subVectors(vec[2], vec[1]);
            dist[2].subVectors(vec[2], vec[0]);
            for (v=0; v < 3; ++v) 
                len[v] = dist[v].length();

            if (len[0] > step ||
                len[1] > step ||
                len[2] > step) {
                for (v=0; v < 3; ++v)
                    dist[v].multiplyScalar(0.5);
                mid[0].addVectors(vec[0], dist[0]);
                mid[1].addVectors(vec[1], dist[1]);
                mid[2].addVectors(vec[0], dist[2]);
                for (v=0; v < 3; ++v)
                    index[v] = this.addVert(mid[v].x, mid[v].y, mid[v].z, clr);

                fills.push(this.fills[i], index[0], index[2]);
                fills.push(index[0], this.fills[i+1], index[1]);
                fills.push(index[1], this.fills[i+2], index[2]);
                fills.push(index[0], index[1], index[2]);

                done = false;
            } else {
                fills.push(this.fills[i], this.fills[i+1], this.fills[i+2]);
            }
        }

        this.fills = fills;
        return !done;
    }

    tessellateAlphaFills(step) {
        let done = true,
            alphaFills = [ ];

        let len = [ 0, 0, 0 ],
            index = [ 0, 0, 0 ],
            dist = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3()
            ],
            vec = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3() 
            ],
            mid = [
                new THREE.Vector3(),
                new THREE.Vector3(),
                new THREE.Vector3() 
            ],
            clr = new THREE.Color();

        let v;
        for (let i=0; i < this.alphaFills.length; i += 3) {
            this.getColor(this.alphaFills[i], clr);
            for (v=0; v < 3; ++v)
                this.getPosition(this.alphaFills[i+v], vec[v]);

            dist[0].subVectors(vec[1], vec[0]);
            dist[1].subVectors(vec[2], vec[1]);
            dist[2].subVectors(vec[2], vec[0]);
            for (v=0; v < 3; ++v) 
                len[v] = dist[v].length();

            if (len[0] > step ||
                len[1] > step ||
                len[2] > step) {
                for (v=0; v < 3; ++v)
                    dist[v].multiplyScalar(0.5);
                mid[0].addVectors(vec[0], dist[0]);
                mid[1].addVectors(vec[1], dist[1]);
                mid[2].addVectors(vec[0], dist[2]);
                for (v=0; v < 3; ++v)
                    index[v] = this.addVert(mid[v].x, mid[v].y, mid[v].z, clr);

                alphaFills.push(this.alphaFills[i], index[0], index[2]);
                alphaFills.push(index[0], this.alphaFills[i+1], index[1]);
                alphaFills.push(index[1], this.alphaFills[i+2], index[2]);
                alphaFills.push(index[0], index[1], index[2]);

                done = false;
            } else {
                alphaFills.push(this.alphaFills[i], this.alphaFills[i+1], this.alphaFills[i+2]);
            }
        }

        this.alphaFills = alphaFills;
        return !done;
    }

    tessellate(step) {
        while (this.tessellateLines(step));
        while (this.tessellateFills(step));
        while (this.tessellateAlphaFills(step));
    }

    build(transform) {
        let group = new THREE.Group();

        if (this.lines.length) {
            const verts = [];
            const colors = [];
            for (let i=0; i < this.lines.length; i+=2) {
                const a = this.lines[i] * 3;
                const b = this.lines[i+1] * 3;
                const v1 = [ 
                    this.positions[a], 
                    this.positions[a+1], 
                    this.positions[a+2]];
                const v2 = [ 
                    this.positions[b], 
                    this.positions[b+1], 
                    this.positions[b+2]];
                const c1 = { 
                    r: this.colors[a], 
                    g: this.colors[a+1], 
                    b: this.colors[a+2]};
    
                const lscale = 0.2;
                const normals = polylineNormals([ v1, v2 ]);
                const ipoints = [ v1, v2 ].map((v, i) => {
                    const n = normals[i][0];
                    let len = normals[i][1] * lscale;
                    return [ v[0] + n[0] * len, v[1] + n[1] * len, v[2] ];
                });
                const opoints = [ v1, v2 ].map((v, i) => {
                    const n = normals[i][0];
                    const len = normals[i][1] * lscale;
                    return [ v[0] + n[0] * -len, v[1] + n[1] * -len, v[2] ];
                });

                const offset = this.count;
                ipoints.forEach(v => this.addVert(v[0], v[1], v[2], c1));
                opoints.forEach(v => this.addVert(v[0], v[1], v[2], c1));

                let base, len = ipoints.length;
                for (let i=0; i < len-1; ++i) {
                    base = offset + i;
                    this.addFill(base + 1, base, base + len, false);
                    this.addFill(base + 1, base + len, base + len + 1, false);
                }
            }
        }

        let positions = [ ];
        for (let i=0; i<this.positions.length; i+=3) {
            let result = transform(
                this.positions[i], this.positions[i+1], this.positions[i+2]);
            positions.push(result[0], result[1], result[2]);
        }

        if (this.fills.length) {
            let fillGeometry = new THREE.BufferGeometry();
            fillGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(this.fills), 1));
                        
            let attrPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
            attrPositions.setDynamic(true);
            fillGeometry.addAttribute('position', attrPositions);

            fillGeometry.addAttribute('color',
                new THREE.BufferAttribute(new Float32Array(this.colors), 3));
            fillGeometry.computeBoundingSphere();

            let fillMeshFront = new THREE.Mesh(fillGeometry, fillMaterialFront);
            group.add(fillMeshFront);
        }

        if (this.alphaFills.length) {
            let alphaFillGeometry = new THREE.BufferGeometry();
            alphaFillGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(this.alphaFills), 1));
            
            let attrPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
            attrPositions.setDynamic(true);
            alphaFillGeometry.addAttribute('position', attrPositions);

            alphaFillGeometry.addAttribute('color',
                new THREE.BufferAttribute(new Float32Array(this.colors), 3));
            alphaFillGeometry.computeBoundingSphere();

            let alphaFillMeshBack = new THREE.Mesh(alphaFillGeometry, alphaFillMaterialBack);
            group.add(alphaFillMeshBack);

            let alphaFillMeshFront = new THREE.Mesh(alphaFillGeometry, alphaFillMaterialFront);
            group.add(alphaFillMeshFront);
        }

        if (this.points.length) {
            let pointGeometry = new THREE.BufferGeometry();
            pointGeometry.setIndex(new THREE.BufferAttribute(new Uint16Array(this.points), 1));

            let attrPositions = new THREE.BufferAttribute(new Float32Array(positions), 3);
            attrPositions.setDynamic(true);
            pointGeometry.addAttribute('position', attrPositions);

            pointGeometry.addAttribute('color',
                new THREE.BufferAttribute(new Float32Array(this.colors), 3));
            pointGeometry.computeBoundingSphere();

            let pointMesh = new THREE.Points(pointGeometry, pointMaterial);
            group.add(pointMesh);
        }

        return group;
    }
}

export default Glyph;
