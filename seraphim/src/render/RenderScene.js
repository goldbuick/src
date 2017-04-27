import React from 'react';
import * as THREE from 'three';
import RenderFX from './RenderFX';
import RenderObject from './RenderObject';

export default class RenderScene extends React.PureComponent {
    
    static defaultProps = {
        onComponent: () => {},
        onCreate: () => {},
        onUpdate: () => {},
        onResize: () => {},
        onWheel: () => {},
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

    handleCreate = (renderer, composer, width, height) => { 
        this.props.onComponent(this);
        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 16000);
        return this.props.onCreate(renderer, composer, this.scene, this.camera, width, height);
    }

    handleUpdate = (renderer, composer, delta) => {
        this.props.onUpdate(renderer, composer, this.scene, this.camera, delta);
    }

    handleResize = (renderer, composer, width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.props.onResize(renderer, composer, this.scene, this.camera, width, height);
    }

    handlePreRender = (delta) => {
        this.animate3D.forEach(item => item.animate3D(delta));
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

    // rayCoords.x = (point.x / Screen.width) * 2 - 1;
    // rayCoords.y = -(point.y / Screen.height) * 2 + 1;
    // rayCaster.setFromCamera(rayCoords, this.camera);
    performRayCheck3D(rayCaster) {
        this.rayCheck3D.forEach(obj => obj.visible = true);
        const intersects = rayCaster.intersectObjects(this.rayCheck3D, false);
        this.rayCheck3D.forEach(obj => obj.visible = false);
        return intersects[0];
    }

    handleWheel = (e) => {
        e.preventDefault();
        console.log(e.deltaX, e.deltaY);
        this.props.onWheel(e.deltaX, e.deltaY);
    }

    // handleInputEvent(e) {
    //     // hack in our direction enums
    //     switch (e.direction) {
    //         default: break;
    //         case Hammer.DIRECTION_UP: e.direction = RenderObject.DIRECTION.UP; break;
    //         case Hammer.DIRECTION_DOWN: e.direction = RenderObject.DIRECTION.DOWN; break;
    //         case Hammer.DIRECTION_LEFT: e.direction = RenderObject.DIRECTION.LEFT; break;
    //         case Hammer.DIRECTION_RIGHT: e.direction = RenderObject.DIRECTION.RIGHT; break;
    //     }

    //     // common props event
    //     const { type, center, isFinal } = e;

    //     // see if delegate handles input
    //     if (!this.input3D.tracking && this.props.onInputEvent(e) === true) {
    //         if (type === 'pan') {
    //             this.input3D.target = undefined;
    //             this.input3D.tracking = !isFinal;
    //         }
    //         return;
    //     }

    //     // send to target object
    //     let { target, tracking } = this.input3D;

    //     if (!target && !tracking) {
    //         target = this.performRayCheck3D(center);
    //         if (type === 'pan') {
    //             this.input3D.target = target;
    //             this.input3D.tracking = true;
    //         }
    //     }

    //     // have a target
    //     if (target) {
    //         target.object.userData.onInputEvent(e, target.point);
    //     }

    //     // blur input element
    //     if ((document.activeElement) &&
    //         (!target || !target.object.userData.hasInputElement)) {
    //         document.activeElement.blur();
    //     }

    //     // if final make sure to clear tracking
    //     if (type === 'pan' && isFinal) {
    //         this.input3D.tracking = false;
    //         this.input3D.target = undefined;
    //     }
    // }

    handleRender3D = () => this.scene

    render() {
        return <RenderFX 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}
            onPreRender={this.handlePreRender}
            onWheel={this.handleWheel}>
            <RenderObject
                name="Root"
                onRender3D={this.handleRender3D}>
                {this.props.children}</RenderObject>
        </RenderFX>;
    }

}

