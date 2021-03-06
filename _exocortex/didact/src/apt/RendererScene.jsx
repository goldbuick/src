import React from 'react';
import RendererFX from './RendererFX';
import RendererObject from './RendererObject';

const THREE = require('three');

export default class RendererScene extends React.Component {
    
    static defaultProps = {
        onCreate: () => { },
        onUpdate: () => { },
        onResize: () => { },
    }

    animate3D = [ ]

    get scene() {
        return (this._scene = this._scene || new THREE.Scene());
    }

    handleCreate = (renderer, composer, width, height) => {
        this.camera = new THREE.PerspectiveCamera(60, 4 / 3, 0.1, 20000);

        return this.props.onCreate(renderer, composer, 
            this.scene, this.camera, width, height);
    }

    handleUpdate = (renderer, composer, delta) => {
        this.animate3D.forEach(item => item.animate3D(delta));
        this.props.onUpdate(renderer, composer, 
            this.scene, this.camera, delta);
    }

    handleResize = (renderer, composer, width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.props.onResize(renderer, composer, 
            this.scene, this.camera, width, height);
    }

    handleRender3D = () => {
        return this.scene;
    }

    startAnimate3D(obj) {
        if (obj.animate3D && obj.props && obj.props.onAnimate3D) {
            this.stopAnimate3D(obj);
            this.animate3D.push(obj);
        }
    }

    stopAnimate3D(obj) {
        this.animate3D = this.animate3D.filter(item => item !== obj);
    }

    render() {
        return <RendererFX 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}>
            <RendererObject
                parent={this}
                onRender3D={this.handleRender3D}>
                {this.props.children}</RendererObject>
        </RendererFX>;
    }

}
