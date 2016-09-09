import React from 'react';
import RendererObject from '../sensorium/RendererObject';

const THREE = require('three');

const TestMesh = (props) => {
    return <RendererObject {...props}
        name="TestMesh"

        onRender3D={() => {
            let geo = new THREE.SphereBufferGeometry(256, 16, 8),
                mat = new THREE.MeshNormalMaterial(),
                mesh = new THREE.Mesh(geo, mat);
            return mesh;
        }}

        onAnimate3D={(obj, anim, delta) => {
            obj.rotation.y += delta * props.spin;
        }} 
    />;
};

TestMesh.defaultProps = {
    spin: 1
};

export default TestMesh;

