import React from 'react';
import Render from './Render';
import * as THREE from 'three';
import RenderObject from './RenderObject';

export default class RenderScene extends React.PureComponent {

    static SCREEN = {
        ratioX: 1,
        ratioY: 1,
        width: 1,
        height: 1,
        halfWidth: 1,
        halfHeight: 1,
        left: coord => (-RenderScene.SCREEN.halfWidth + coord) * RenderScene.SCREEN.ratioX,
        right: coord => (RenderScene.SCREEN.halfWidth - coord) * RenderScene.SCREEN.ratioX,
        top: coord => (-RenderScene.SCREEN.halfHeight + coord) * RenderScene.SCREEN.ratioY,
        bottom: coord => (RenderScene.SCREEN.halfHeight - coord) * RenderScene.SCREEN.ratioY,        
    };
    
    static defaultProps = {
        onCreate: () => {},
        onUpdate: () => {},
        onResize: () => {},
        onWheel: () => {},
        onTap: () => {},
        onPan: () => {},
        onPress: () => {},
        onSwipe: () => {},
        onDoubleTap: () => {},
    };

    static childContextTypes = {
        root: React.PropTypes.object
    };

    getChildContext() {
        return { root: this };
    }

    animate3D = [];
    rayCheck3D = [];

    get scene() {
        return (this._scene = this._scene || new THREE.Scene());
    }

    handleCreate = (renderer, width, height) => { 
        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 16000);
        return this.props.onCreate(renderer, this, width, height);
    }

    handleUpdate = (renderer, delta) => {
        this.animate3D.forEach(item => item.animate3D(delta));
        this.props.onUpdate(renderer, this, delta);
    }

    handleResize = (renderer, width, height) => {
        // update camera
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // global constants to help place objects in view
        RenderScene.SCREEN.width = width;
        RenderScene.SCREEN.height = height;
        RenderScene.SCREEN.halfWidth = width * 0.5;
        RenderScene.SCREEN.halfHeight = height * 0.5;

        const length = 100;
        const center = new THREE.Vector3(0, 0, 1).project(this.camera);
        const top = new THREE.Vector3(0, length, 1).project(this.camera);
        const left = new THREE.Vector3(length, 0, 1).project(this.camera);

        const leftX = left.x * RenderScene.SCREEN.halfWidth + RenderScene.SCREEN.halfWidth;
        const centerX = center.x * RenderScene.SCREEN.halfWidth + RenderScene.SCREEN.halfWidth;
        RenderScene.SCREEN.ratioX = length / (leftX - centerX);

        const topY = top.y * RenderScene.SCREEN.halfHeight + RenderScene.SCREEN.halfHeight;
        const centerY = center.y * RenderScene.SCREEN.halfHeight + RenderScene.SCREEN.halfHeight;
        RenderScene.SCREEN.ratioY = length / (topY - centerY);

        this.props.onResize(renderer, this, width, height);
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

    startRayCheck3D(obj) {
        if (obj && obj.userData && obj.userData.onInputEvent) {
            this.stopRayCheck3D(obj);
            this.rayCheck3D.push(obj);
        }
    }

    stopRayCheck3D(obj) {
        this.rayCheck3D = this.rayCheck3D.filter(item => item !== obj);
    }

    performRayCheck3D(rayCaster) {
        this.rayCheck3D.forEach(obj => obj.visible = true);
        const intersects = rayCaster.intersectObjects(this.rayCheck3D, false);
        this.rayCheck3D.forEach(obj => obj.visible = false);
        return intersects[0];
    }

    handleRender3D = () => this.scene

    render() {
        return <Render 
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}
            onWheel={this.props.onWheel}
            onTap={this.props.onTap}
            onPan={this.props.onPan}
            onPress={this.props.onPress}
            onSwipe={this.props.onSwipe}
            onDoubleTap={this.props.onDoubleTap}>
            <RenderObject name="Root" onRender3D={this.handleRender3D}>
                {this.props.children}</RenderObject>
        </Render>;
    }

}

