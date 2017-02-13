
class GenFaces {

    createFromGeometry({ x=0, y=0, z=0, geometry } = {}) {
        const center = new THREE.Vector3(x, y, z);
        return geometry.faces.map(face => {
            const a = geometry.vertices[face.a].clone();
            const b = geometry.vertices[face.b].clone();
            const c = geometry.vertices[face.c].clone();
            const mid = a.clone().add(b).add(c).divideScalar(3);
            [ mid, a, b, c ].forEach(pt => pt.add(center));
            return { 
                mid,
                points: [ a, b, c ]
            };
        });
    }

    createFromIcosahedron({ x=0, y=0, z=0, radius, detail } = {}) {
        let geometry = new THREE.IcosahedronGeometry(radius, detail);
        return this.createFromGeometry({ x, y, z, geometry });
    }

    createFromOctahedron({ x=0, y=0, z=0, radius, detail } = {}) {
        let geometry = new THREE.OctahedronGeometry(radius, detail);
        return this.createFromGeometry({ x, y, z, geometry });        
    }

}

export default new GenFaces();
