import * as THREE from 'three';

export function applyRotation(quaternion, x, y, z) {
    const rotation = new THREE.Quaternion().setFromEuler(new THREE.Euler(x, y, z));
    return quaternion.premultiply(rotation);
}

export function inertiaRotation(anim, dx, dy, dz, delta, damp1, damp2) {
    if (anim === undefined) anim = {};

    anim.dx = (anim.dx || 0) + dx; 
    anim.dy = (anim.dy || 0) + dy;
    anim.dz = (anim.dz || 0) + dz * damp2;

    const rotationScale = -0.0001;
    anim.rotation = anim.rotation || new THREE.Quaternion();
    anim.rotation = applyRotation(anim.rotation, anim.dx * rotationScale, 0, 0);
    anim.rotation = applyRotation(anim.rotation, 0, anim.dy * rotationScale, 0);
    anim.rotation = applyRotation(anim.rotation, 0, 0, anim.dz * rotationScale);

    anim.dx -= anim.dx * delta * damp1;
    anim.dy -= anim.dy * delta * damp1;
    anim.dz -= anim.dz * delta * damp2;
    
    return anim;
}
