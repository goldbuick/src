import React from 'react';
import VizGen from '../sensorium/VizGen';
import RendererObject from '../sensorium/RendererObject';

const THREE = require('three');

const TestRenderer = (props) => {
    return <RendererObject {...props}
        name="TestRenderer"

        onRender3D={() => {
            return VizGen.text({ 
                scale: 3,
                text: 'testing'
            });

            // let geo = new THREE.SphereBufferGeometry(256, 16, 8),
            //     mat = new THREE.MeshNormalMaterial(),
            //     mesh = new THREE.Mesh(geo, mat);
            // return mesh;
        }}

        onAnimate3D={(obj, anim, delta) => {
            // obj.rotation.y += delta * props.spin;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

