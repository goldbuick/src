
class GenTransform {

    // process a set of points

    map({ points, fn } = {}) {
        const count = points.length - 1;
        return points.map((pt, i) => {
            return fn(pt, i, count, points);
        });
    }

    filter({ points, fn } = {}) {
        const count = points.length - 1;
        return points.filter((pt, i) => {
            return fn(pt, i, count, points);
        });
    }

    // Functions for map & filter

    pass(value) {
        return () => value;
    }

    scale({ scale = 1, fn } = {}) {
        return (pt, i, count, points) => {
            const _scale = fn ? fn(pt, i, count, points) : scale;
            return { 
                x: pt.x * scale,
                y: pt.y * scale,
                z: pt.z * scale
            };
        };
    }

    translate({ x=0, y=0, z=0, fn } = {}) {
        const delta = { x, y, z };
        return (pt, i, count, points) => {
            const _delta = fn ? fn(pt, i, count, points) : delta;
            return { 
                x: pt.x + delta.x,
                y: pt.y + delta.y,
                z: pt.z + delta.z
            };
        };
    }

    radialTranslate({ x=0, y=0, z=0, radius=1, fn } = {}) {
        const center = new THREE.Vector3(x, y, z);
        return (pt, i, count, points) => {
            const edge = new THREE.Vector3(pt.x, pt.y, pt.z);
            const _radius = fn ? fn(pt, i, count, points) : radius;
            const delta = new THREE.Vector3().subVectors(edge, center).normalize().multiplyScalar(_radius);
            return { 
                x: pt.x + delta.x,
                y: pt.y + delta.y,
                z: pt.z + delta.z
            };
        };
    }

    // sort points into groups

    splitByFunc({ points, fn } = {}) {
        let groups = { };
        points.forEach(pt => {
            const hash = fn(pt);
            if (groups[hash] === undefined) groups[hash] = [];
            groups[hash].push(pt);
        });
        return Object.keys(groups).map(key => groups[key]);
    }

    // functions used to sort

    splitByX({ points } = {}) {
        return this.splitByFunc({ points, fn: (pt) => pt.y });
    }

    splitByY({ points } = {}) {
        return this.splitByFunc({ points, fn: (pt) => pt.y });
    }

    splitByZ({ points } = {}) {
        return this.splitByFunc({ points, fn: (pt) => pt.z });
    }

}

export default new GenTransform();