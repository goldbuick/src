import * as THREE from 'three';
import TI from '../ThreeImports';

const PI2 = Math.PI * 2;
const PISCALE = Math.PI * 0.58;

export function convertToGeometry(geometry) {
    if (geometry.isBufferGeometry) {
        return new THREE.Geometry().fromBufferGeometry(geometry);
    }
    return geometry;
}

export function convertToBufferGeometry(geometry) {
    if (geometry.isGeometry) {
        return new THREE.BufferGeometry().fromGeometry(geometry);
    }
    return geometry;
}

export function tessellate(edgeLength, iterations, geometry) {
    const tessellateModifier = new TI.TessellateModifier(8);
    for (const i=0; i < iterations; ++i) {
        tessellateModifier.modify(geometry);
    }
    return geometry;
}

export function applyToGeometry(fn, root) {
    root.traverse((object) => {
        if (object.isMesh) {
            console.log(object);
        }
    });
}

const cylindrical = new THREE.Cylindrical();
export function column(radius, scale, object) {
    const range = radius * Math.PI;
    return (vec3) => {        
        vec3.x *= scale;
        vec3.y *= scale;
        // vec3.y *= PISCALE;
        cylindrical.radius = radius + vec3.z;
        cylindrical.theta = (vec3.x / range) * PI2;
        cylindrical.y = vec3.y;
        vec3.setFromCylindrical(cylindrical);
        return vec3;
    };
}

const spherical = new THREE.Spherical();
export function sphere(radius, scale, object) {
    // const start = Math.PI * 0.5;
    const range = radius * Math.PI;
    return (vec3) => {
        vec3.x *= scale;
        vec3.y *= scale;
        spherical.radius = radius + vec3.z;
        spherical.phi = (vec3.y / range) * PI2;
        spherical.theta = (vec3.x / range) * PI2;
        vec3.setFromSpherical(spherical);
        return vec3;
    };
}

export function projectToColumn(object, { edgeLength = 16, iterations = 4, radius = 256, scale = 1 } = {}) {
    
}

export function projectToSphere(object, { edgeLength = 16, iterations = 4, radius = 256, scale = 1 } = {}) {
    
}
