import React from 'react';
import Screen from './Screen';
import Hammer from 'hammerjs';
import * as THREE from 'three';
import RenderFX from './RenderFX';
import RenderObject from './RenderObject';

export default class RenderScene extends React.Component {
    
    static defaultProps = {
        onCreate: () => {},
        onUpdate: () => {},
        onResize: () => {},
        onWheel: () => {},
        onInputEvent: () => {},
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
        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 16000);

        this.input3D = {
            tracking: false,
            ray: new THREE.Raycaster(),
            rayCoords: new THREE.Vector2(),
        };

        return this.props.onCreate(renderer, composer, this.scene, this.camera, width, height);
    }

    handleUpdate = (renderer, composer, delta) => {
        // this.animate3D.forEach(item => item.animate3D(delta));
        this.props.onUpdate(renderer, composer, this.scene, this.camera, delta);
    }

    handleResize = (renderer, composer, width, height) => {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        // global constants to help place objects in view
        Screen.width = width;
        Screen.height = height;
        Screen.halfWidth = width * 0.5;
        Screen.halfHeight = height * 0.5;

        const length = 100;
        const center = new THREE.Vector3(0, 0, 1).project(this.camera);
        const top = new THREE.Vector3(0, length, 1).project(this.camera);
        const left = new THREE.Vector3(length, 0, 1).project(this.camera);

        const leftX = left.x * Screen.halfWidth + Screen.halfWidth;
        const centerX = center.x * Screen.halfWidth + Screen.halfWidth;
        Screen.ratioX = length / (leftX - centerX);

        const topY = top.y * Screen.halfHeight + Screen.halfHeight;
        const centerY = center.y * Screen.halfHeight + Screen.halfHeight;
        Screen.ratioY = length / (topY - centerY);

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

    handleWheel = (e) => {
        e.preventDefault();
        this.props.onWheel(e.deltaX, e.deltaY);
        console.log(e.deltaX, e.deltaY);
    }

    performRayCheck3D(point) {
        const { ray, rayCoords } = this.input3D;
        rayCoords.x = (point.x / Screen.width) * 2 - 1;
        rayCoords.y = -(point.y / Screen.height) * 2 + 1;
        ray.setFromCamera(rayCoords, this.camera);
        this.rayCheck3D.forEach(obj => obj.visible = true);
        const intersects = ray.intersectObjects(this.rayCheck3D, false);
        this.rayCheck3D.forEach(obj => obj.visible = false);
        return intersects[0];
    }

    handleInputEvent(e) {
        // hack in our direction enums
        switch (e.direction) {
            default: break;
            case Hammer.DIRECTION_UP: e.direction = RenderObject.DIRECTION.UP; break;
            case Hammer.DIRECTION_DOWN: e.direction = RenderObject.DIRECTION.DOWN; break;
            case Hammer.DIRECTION_LEFT: e.direction = RenderObject.DIRECTION.LEFT; break;
            case Hammer.DIRECTION_RIGHT: e.direction = RenderObject.DIRECTION.RIGHT; break;
        }

        // see if delegate handles input
        if (this.props.onInputEvent(e) === true) return;

        // send to target object
        const { type, center, isFinal } = e;
        let { target, tracking } = this.input3D;

        if (!target && !tracking) {
            target = this.performRayCheck3D(center);
            if (type === 'pan') {
                this.input3D.target = target;
                this.input3D.tracking = true;
            }
        }

        // have a target
        if (target) {
            target.object.userData.onInputEvent(e, target.point);
        }

        // blur input element
        if ((document.activeElement) &&
            (!target || !target.object.userData.hasInputElement)) {
            document.activeElement.blur();
        }

        // if final make sure to clear tracking
        if (type === 'pan' && isFinal) {
            this.input3D.tracking = false;
            this.input3D.target = undefined;
        }
    }

    handleTap = (e) => this.handleInputEvent(e)
    handlePan = (e) => this.handleInputEvent(e)
    handlePress = (e) => this.handleInputEvent(e)
    handleSwipe = (e) => this.handleInputEvent(e)
    handleDoubleTap = (e) => this.handleInputEvent(e)
    handleRender3D = () => this.scene

    render() {
        return <RenderFX 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}
            onPreRender={this.handlePreRender}
            onWheel={this.handleWheel}
            onTap={this.handleTap}
            onPan={this.handlePan}
            onPress={this.handlePress}
            onSwipe={this.handleSwipe}
            onDoubleTap={this.handleDoubleTap}>
            <RenderObject
                name="Root"
                onRender3D={this.handleRender3D}>
                {this.props.children}</RenderObject>
        </RenderFX>;
    }

}


    // handlePointer(e, id, pressed, x, y) {
    //     if (!this.scene) return;
    //     this.props.onPointer(e, id, pressed, x, y);
    //     const { ray, rayCoords, objectByPointer } = this.input;

    //     let current;
    //     if (pressed !== undefined) {
    //         rayCoords.x = (x / Screen.width) * 2 - 1;
    //         rayCoords.y = -(y / Screen.height) * 2 + 1;
    //         ray.setFromCamera(rayCoords, this.camera);

    //         let intersects = ray.intersectObjects(this.scene.children, true);
    //         for (let i=0; i<intersects.length; ++i) {
    //             let obj = intersects[i].object;
    //             if (obj && obj.userData && obj.userData.onPointer) {
    //                 current = intersects[i];
    //                 break;
    //             }
    //         }
    //     }

    //     const last = objectByPointer[id];
    //     if (last && (!current || last !== current.object)) {
    //         last.userData.onPointer(id);
    //         delete objectByPointer[id];
    //     }

    //     if (current) {
    //         objectByPointer[id] = current.object;
    //         current.object.userData.onPointer(e, id, pressed, current.point);
    //     }

    //     if (pressed && (
    //         current === undefined || 
    //         current.object.userData.hasInputElement === undefined)) {
    //         document.activeElement.blur();
    //     }
    // }

    // handleTouchStart = (e) => {
    //     // e.preventDefault();
    //     for (let i=0; i<e.changedTouches.length; ++i) {
    //         let touch = e.changedTouches[i];
    //         this.handlePointer(e, touch.identifier, true, touch.clientX, touch.clientY);
    //     }
    // }

    // handleTouchMove = (e) => {
    //     // e.preventDefault();
    //     for (let i=0; i<e.changedTouches.length; ++i) {
    //         let touch = e.changedTouches[i];
    //         this.handlePointer(e, touch.identifier, true, touch.clientX, touch.clientY);
    //     }
    // }

    // handleTouchEnd = (e) => {
    //     // e.preventDefault();
    //     for (let i=0; i<e.changedTouches.length; ++i) {
    //         let touch = e.changedTouches[i];
    //         this.handlePointer(e, touch.identifier, false, touch.clientX, touch.clientY);
    //     }
    // }

    // handleMouseDown = (e) => {
    //     // e.preventDefault();
    //     this.input.pressed = true;
    //     this.handlePointer(e, -1, true, e.clientX, e.clientY);
    // }

    // handleMouseMove = (e) => {
    //     // e.preventDefault();
    //     if (this.input.pressed) this.handlePointer(e, -1, this.input.pressed, e.clientX, e.clientY);
    // }

    // handleMouseUp = (e) => {
    //     // e.preventDefault();
    //     this.input.pressed = false;
    //     this.handlePointer(e, -1, false, e.clientX, e.clientY);
    // }
