import * as THREE from 'three';

const shellMaterial = new THREE.MeshBasicMaterial();

class Shell {

    mesh(geometry) {
        const mesh = new THREE.Mesh(geometry, shellMaterial);
        mesh.isShell = true;
        mesh.visible = false;
        return mesh;
    }

    plane(width, height) {
        return this.mesh(new THREE.PlaneBufferGeometry(width, height));
    }

    sphere(radius) {
        return this.mesh(new THREE.SphereBufferGeometry(radius, 10, 8));
    }

    box(width, height, depth) {
        return this.mesh(new THREE.BoxBufferGeometry(width, height, depth));
    }

}

export default new Shell();