import React from 'react';
import RendererObject from '../sensorium/RendererObject';

const THREE = require('three');

export default class TestMesh extends React.Component {

    static defaultProps = {
        spin: 1,
    }

    handleRender3D = () => {
        let geo = new THREE.SphereBufferGeometry(256, 16, 8),
            mat = new THREE.MeshNormalMaterial(),
            mesh = new THREE.Mesh(geo, mat);

        return mesh;        
    }

    handleAnimate3D = (obj, anim, delta) => {
        obj.rotation.y += delta * this.props.spin;
    }

    render() {
        return <RendererObject
            {...this.props}
            name={this.constructor.name}
            onRender3D={this.handleRender3D} 
            onAnimate3D={this.handleAnimate3D} />;
    }
}
