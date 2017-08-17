import * as THREE from 'three';
import { TessellateModifier } from '../ThreeImports';
import { convertToGeometry, convertToBufferGeometry } from './Convert';

const PI2 = Math.PI * 2;
const PISCALE = Math.PI * 0.6;

function tessellate(geometry, edgeLength, iterations) {
    const tessellateModifier = new TessellateModifier(8);
    for (let i=0; i < iterations; ++i) {
        tessellateModifier.modify(geometry);
    }
    return geometry;
}

function applyToGeometry(fn) {
    return (root) => {
        root.traverse((object) => {
            if (object.isMesh) {
                fn(object);
            }
        });
    };
}

function applyToVerts(geometry, fn) {
    geometry.vertices.forEach(fn);
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    geometry.normalsNeedUpdate = true;    
    geometry.verticesNeedUpdate = true;
}

function pollPendingMesh(root) {
    return new Promise(resolve => {
        const poll = () => {
            let hasPendingMesh = false;
            root.traverse((object) => {
                if (object.userData.hasPendingMesh) {
                    object.visible = false;
                    object.userData.resetVisible = true;
                    hasPendingMesh = true;
                }
            });
            if (hasPendingMesh) {
                setTimeout(poll, 128);
            } else {
                root.traverse((object) => {
                    if (object.userData.resetVisible) {
                        object.visible = true;
                    }
                });
                resolve(root);
            }
        };
        poll();
    });
}

const cylindrical = new THREE.Cylindrical();
function column(radius, scale) {
    const range = radius * Math.PI;
    return (vec3) => {        
        vec3.x *= scale;
        vec3.y *= scale;
        vec3.y *= PISCALE;
        cylindrical.radius = radius + vec3.z;
        cylindrical.theta = ((vec3.x / range) * PI2);
        cylindrical.y = vec3.y;
        vec3.setFromCylindrical(cylindrical);
        return vec3;
    };
}

const spherical = new THREE.Spherical();
function sphere(radius, scale) {
    const start = Math.PI * 0.5;
    const range = radius * Math.PI;
    return (vec3) => {
        vec3.x *= scale;
        vec3.y *= scale;
        spherical.radius = radius + vec3.z;
        spherical.phi = start - ((vec3.y / range) * PI2);
        spherical.theta = ((vec3.x / range) * PI2);
        vec3.setFromSpherical(spherical);
        return vec3;
    };
}

export function projectToColumn(object, { edgeLength = 16, iterations = 4, radius = 256, scale = 1 } = {}) {
    const applyColumn = column(radius, scale);
    pollPendingMesh(object).then(applyToGeometry(mesh => {
        mesh.geometry = convertToGeometry(mesh.geometry);
        mesh.geometry = tessellate(mesh.geometry, edgeLength, iterations);
        applyToVerts(mesh.geometry, applyColumn);
        mesh.geometry = convertToBufferGeometry(mesh.geometry);
    }));
}

export function projectToSphere(object, { edgeLength = 16, iterations = 4, radius = 256, scale = 1 } = {}) {
    const applySphere = sphere(radius, scale);
    pollPendingMesh(object).then(applyToGeometry(mesh => {
        mesh.geometry = convertToGeometry(mesh.geometry);
        mesh.geometry = tessellate(mesh.geometry, edgeLength, iterations);
        applyToVerts(mesh.geometry, applySphere);
        mesh.geometry = convertToBufferGeometry(mesh.geometry);
    }));
}
