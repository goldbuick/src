
class GenFaces {

    createFromGeometry({ x=0, y=0, z=0, geometry } = {}) {
        return geometry.faces.map(face => {
            const a = geometry.vertices[face.a];
            const b = geometry.vertices[face.b];
            const c = geometry.vertices[face.c];
            const mid = a.clone().add(b).add(c).divideScalar(3);
            // console.log(mid, a, b, c); 
            return { 
                mid,
                points: [ a, b, c ]
            };
        });
    }

    createFromTriSphere({ x=0, y=0, z=0, radius, detail } = {}) {
        let geometry = new THREE.IcosahedronGeometry(radius, detail);
        return this.createFromGeometry({ x, y, z, geometry });
    }

}

export default new GenFaces();
