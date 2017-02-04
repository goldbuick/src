import React from 'react';
import RenderFX from './RenderFX';
import RenderObject from './RenderObject';

export default class RenderScene extends React.Component {
    
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
        this.camera = new THREE.PerspectiveCamera(60, width / height, 1, 16000);

        // mouse & touch input
        this.mousePressed = false;
        this.lastPointerObject = { };
        this.ray = new THREE.Raycaster();
        this.rayCoords = new THREE.Vector2();

        return this.props.onCreate(renderer, composer, 
            this.scene, this.camera, width, height);
    }

    handleUpdate = (renderer, composer, delta) => {
        this.animate3D.forEach(item => item.animate3D(delta));
        this.props.onUpdate(renderer, composer, 
            this.scene, this.camera, delta);
    }

    handleResize = (renderer, composer, width, height) => {
        this.size = { width, height };
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

    handleWheel = (e) => {
        e.preventDefault();
        this.props.onWheel(e.deltaX, e.deltaY);
    }

    handlePointer(id, pressed, x, y) {
        if (!this.scene) return;
        const last = this.lastPointerObject[id];

        let current;
        if (pressed !== undefined) {
            this.rayCoords.x = (x / this.size.width) * 2 - 1;
            this.rayCoords.y = -(y / this.size.height) * 2 + 1;
            this.ray.setFromCamera(this.rayCoords, this.camera);

            let intersects = this.ray.intersectObjects(this.scene.children, true);
            for (let i=0; i<intersects.length; ++i) {
                let obj = intersects[i].object;
                if (obj && obj.userData && obj.userData.onPointer) {
                    current = intersects[i];
                    break;
                }
            }
        }

        if (last && (!current || last !== current.object)) {
            last.userData.onPointer(id);
            delete this.lastPointerObject[id];
        }

        if (current) {
            this.lastPointerObject[id] = current.object;
            current.object.userData.onPointer(id, pressed, current.point);
        }

        if (pressed && (
            current === undefined || 
            current.object.userData.hasFocusInput === undefined)) {
            document.activeElement.blur();
        }
    }

    handleTouchStart = (e) => {
        e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(touch.identifier, true, touch.clientX, touch.clientY);
        }
    }

    handleTouchMove = (e) => {
        e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(touch.identifier, true, touch.clientX, touch.clientY);
        }
    }

    handleTouchEnd = (e) => {
        e.preventDefault();
        for (let i=0; i<e.changedTouches.length; ++i) {
            let touch = e.changedTouches[i];
            this.handlePointer(touch.identifier, false, touch.clientX, touch.clientY);
            this.handlePointer(touch.identifier);
        }
    }

    handleMouseDown = (e) => {
        e.preventDefault();
        this.mousePressed = true;
        this.handlePointer(-1, true, e.clientX, e.clientY);
    }

    handleMouseMove = (e) => {
        e.preventDefault();
        if (this.mousePressed) this.handlePointer(-1, this.mousePressed, e.clientX, e.clientY);
    }

    handleMouseUp = (e) => {
        e.preventDefault();
        this.mousePressed = false;
        this.handlePointer(-1, false, e.clientX, e.clientY);
    }

    render() {
        return <RenderFX 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}
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
