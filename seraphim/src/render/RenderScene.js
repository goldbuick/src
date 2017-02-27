import React from 'react';
import Screen from './Screen';
import RenderFX from './RenderFX';
import { debounce } from '../util/timing';
import RenderObject from './RenderObject';

export default class RenderScene extends React.Component {
    
    static defaultProps = {
        onWheel: () => { },
        onCreate: () => { },
        onUpdate: () => { },
        onResize: () => { },
        onPointer: () => { },
    }

    animate3D = []

    get scene() {
        return (this._scene = this._scene || new THREE.Scene());
    }

    handleCreate = (renderer, composer, width, height) => { 
        this.camera = new THREE.PerspectiveCamera(70, width / height, 1, 16000);

        this.input = {
            pressed: false,
            objectByPointer: {},
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

    handleWheel = (e) => {
        e.preventDefault();
        this.props.onWheel(e.deltaX, e.deltaY);
    }

    handlePointer(e, id, pressed, x, y) {
        if (!this.scene) return;
        this.props.onPointer(e, id, pressed, x, y);
        const { ray, rayCoords, objectByPointer } = this.input;

        let current;
        if (pressed !== undefined) {
            rayCoords.x = (x / Screen.width) * 2 - 1;
            rayCoords.y = -(y / Screen.height) * 2 + 1;
            ray.setFromCamera(rayCoords, this.camera);

            let intersects = ray.intersectObjects(this.scene.children, true);
            for (let i=0; i<intersects.length; ++i) {
                let obj = intersects[i].object;
                if (obj && obj.userData && obj.userData.onPointer) {
                    current = intersects[i];
                    break;
                }
            }
        }

        const last = objectByPointer[id];
        if (last && (!current || last !== current.object)) {
            last.userData.onPointer(id);
            delete objectByPointer[id];
        }

        if (current) {
            objectByPointer[id] = current.object;
            current.object.userData.onPointer(e, id, pressed, current.point);
        }

        if (pressed && (
            current === undefined || 
            current.object.userData.hasInputElement === undefined)) {
            document.activeElement.blur();
        }
    }

    handleTouchStart = (e) => {
        // e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(e, touch.identifier, true, touch.clientX, touch.clientY);
        }
    }

    handleTouchMove = (e) => {
        // e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(e, touch.identifier, true, touch.clientX, touch.clientY);
        }
    }

    handleTouchEnd = (e) => {
        // e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(e, touch.identifier, false, touch.clientX, touch.clientY);
        }
    }

    handleMouseDown = (e) => {
        // e.preventDefault();
        this.input.pressed = true;
        this.handlePointer(e, -1, true, e.clientX, e.clientY);
    }

    handleMouseMove = (e) => {
        // e.preventDefault();
        if (this.input.pressed) this.handlePointer(e, -1, this.input.pressed, e.clientX, e.clientY);
    }

    handleMouseUp = (e) => {
        // e.preventDefault();
        this.input.pressed = false;
        this.handlePointer(e, -1, false, e.clientX, e.clientY);
    }

    handleRender3D = () => {
        return this.scene;
    }

    render() {
        return <RenderFX 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}
            onPreRender={this.handlePreRender}
            onWheel={this.handleWheel}
            onTouchStart={this.handleTouchStart}
            onTouchMove={this.handleTouchMove}
            onTouchEnd={this.handleTouchEnd}
            onMouseDown={this.handleMouseDown}
            onMouseMove={this.handleMouseMove}
            onMouseUp={this.handleMouseUp}>
            <RenderObject
                parent={this}
                onRender3D={this.handleRender3D}>
                {this.props.children}</RenderObject>
        </RenderFX>;
    }

}
