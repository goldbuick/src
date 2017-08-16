import React from 'react';
import TWEEN from '@tweenjs/tween.js';
import Hammer from 'hammerjs';
import * as THREE from 'three';
import PropTypes from 'prop-types';
import debounce from 'lodash.debounce';
import HammerComponent from 'react-hammerjs';
import ViveControllerSpec from '../../media/vive-controller/onepointfive_spec.png';
import ViveControllerTexture from '../../media/vive-controller/onepointfive_texture.png';
import ViveControllerModel from '../../media/vive-controller/vr_controller_vive_1_5.obj';

import * as TI from '../../ThreeImports';
import MouseWheel from '../../input/MouseWheel';

class RenderScreen {
    ratioX = 1;
    ratioY = 1;
    pixWidth = 1;
    pixHeight = 1;
    pixHalfWidth = 1;
    pixHalfHeight = 1;
    
    get width() {
        return (this.pixHalfWidth * 2) * this.ratioX;
    }
    
    get height() {
        return (this.pixHalfHeight * 2) * this.ratioY;
    }
    
    left(coord) {
        return (-this.pixHalfWidth + coord) * this.ratioX;
    }

    right(coord) { 
        return (this.pixHalfWidth - coord) * this.ratioX;
    }

    top(coord) { 
        return (-this.pixHalfHeight + coord) * this.ratioY;
    }

    bottom(coord) { 
        return (this.pixHalfHeight - coord) * this.ratioY;
    }
}

class RenderDevice extends React.Component {

    static SCREEN = new RenderScreen();

    static DIRECTION = {
        UP: 'up',
        DOWN: 'down',
        LEFT: 'left',
        RIGHT: 'right',
    };

    static childContextTypes = {
        device: PropTypes.object,
    };

    getChildContext() {
        return { device: this };
    }
    
    constructor(...args) {
        super(...args);

        this.mousewheel = new MouseWheel({
            onSwipeUp: this.handleWheelUp,
            onSwipeDown: this.handleWheelDown,
            onSwipeLeft: this.handleWheelLeft,
            onSwipeRight: this.handleWheelRight,
        });
    }

    animationObjects = [];
    inputEventObjects = [];
    scene = new THREE.Scene();
    input3D = { rayCoords: new THREE.Vector2(), rayCaster: new THREE.Raycaster() };

    startAnimation(component) {
        if (component.animate && component.props && component.props.onAnimate) {        
            this.stopAnimation(component);
            this.animationObjects.push(component);
        }
    }

    stopAnimation(component) {
        this.animationObjects = this.animationObjects.filter(item => item !== component);
    }

    runAnimation(delta) {
        this.animationObjects.forEach(item => item.runAnimation(delta));
    }

    startInputEvent(object3D) {
        if (object3D && object3D.userData && object3D.userData.onInputEvent) {
            this.stopInputEvent(object3D);
            this.inputEventObjects.push(object3D);
        }
    }

    stopInputEvent(object3D) {
        this.inputEventObjects = this.inputEventObjects.filter(item => item !== object3D);
    }

    performInputCheck(rayCaster) {
        this.inputEventObjects.forEach(object3D => object3D.visible = true);
        const intersects = rayCaster.intersectObjects(this.inputEventObjects, false);
        this.inputEventObjects.forEach(object3D => object3D.visible = false);
        return intersects[0];
    }

    componentDidMount() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer({ antialias: true});
        this.renderer.setSize(width, height);
        // this.renderer.setClearColor(new THREE.Color('skyblue'));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);

        this.renderer.vr.enabled = true;

        this.clock = new THREE.Clock();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10000);

        window.maxAni = this.renderer.getMaxAnisotropy();
        window.addEventListener('resize', this.handleResize, true);

        this.renderer.animate(this.handleUpdate);

        // hook to kick over into webvr mode of didact
        TI.WEBVR.getVRDisplay(this.handleGetVRDisplay);

        // default scene lighting
        const tilt = 32;
        [ -tilt, tilt ].map(tilt => {
            const light = new THREE.DirectionalLight(0xffffff, 0.2);
            light.position.set(tilt, 0, 8);
            return light;
        }).forEach(light => this.scene.add(light));

        // const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        // const box = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff }));
        // box.position.z = -1;
        // this.scene.add(box);

        // const material = new THREE.LineBasicMaterial({ color: 0x0000ff });
        // const geometry = new THREE.Geometry();
        // geometry.vertices.push(
        //     new THREE.Vector3(-1000, 0, -100),
        //     new THREE.Vector3(1000, 0, -100),
        // );
        // this.scene.add(new THREE.Line(geometry, material));

        // next render cycle
        setTimeout(() => this.updateSCREEN(width, height), 0);
    }

    render() {
        return (
            <HammerComponent
                direction="DIRECTION_ALL"
                onTap={this.handleTap}
                onPan={this.handlePan}
                onPress={this.handlePress}
                onSwipe={this.handleSwipe}
                onDoubleTap={this.handleDoubleTap}>
                <div
                    className="renderer"
                    data-name="RenderDevice"
                    ref={this.handleRef}>
                    {this.props.children}
                </div>
            </HammerComponent>
        );
    }

    handleGetVRDisplay = (display) => {
        this.renderer.vr.setDevice(display);

        this.controllers = [0, 1].map(index => new TI.ViveController(index));
        this.controllers.forEach((controller, index) => {
            controller.standingMatrix = this.renderer.vr.getStandingMatrix();
            controller.addEventListener('axischanged', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('thumbpaddown', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('thumbpadup', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('triggerdown', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('triggerup', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('gripsdown', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('gripsup', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('menudown', event => this.handleVRControllerEvent(index, event));
            controller.addEventListener('menuup', event => this.handleVRControllerEvent(index, event));
            this.scene.add(controller);
        });

        const objLoader = new TI.OBJLoader();
        const textureLoader = new THREE.TextureLoader();

        objLoader.load(ViveControllerModel, (object) => {
            const mesh = object.children[0];
            mesh.material.map = textureLoader.load(ViveControllerTexture);
            mesh.material.specularMap = textureLoader.load(ViveControllerSpec);
            this.controllers.forEach(controller => controller.add(object.clone()));
        });
        
        document.body.appendChild(TI.WEBVR.getButton(display, this.renderer.domElement));
    }

    handleVRControllerEvent = (index, event) => {
        console.log(index, event);
    }

    handleRef = (el) => {
        this.container = el;
    }

    handleResize = debounce(() => this.updateSize(), 250)

    handleUpdate = () => {
        const delta = this.clock.getDelta();
        TWEEN.update();
        this.runAnimation(delta);
        this.renderer.render(this.scene, this.camera);
        (this.controllers || []).forEach(controller => controller.update());
    }

    updateSize() {
        let width = this.container.offsetWidth,
            height = this.container.offsetHeight;
        this.renderer.setSize(width, height);
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.updateSCREEN(width, height);
    }

    updateSCREEN(width, height) {
        // global constants to help place objects in view
        RenderDevice.SCREEN.pixWidth = width;
        RenderDevice.SCREEN.pixHeight = height;
        RenderDevice.SCREEN.pixHalfWidth = width * 0.5;
        RenderDevice.SCREEN.pixHalfHeight = height * 0.5;

        const length = 100;
        const center = new THREE.Vector3(0, 0, 1).project(this.camera);
        const top = new THREE.Vector3(0, length, 1).project(this.camera);
        const left = new THREE.Vector3(length, 0, 1).project(this.camera);

        const leftX = left.x * RenderDevice.SCREEN.pixHalfWidth + RenderDevice.SCREEN.pixHalfWidth;
        const centerX = center.x * RenderDevice.SCREEN.pixHalfWidth + RenderDevice.SCREEN.pixHalfWidth;
        RenderDevice.SCREEN.ratioX = length / (leftX - centerX);

        const topY = top.y * RenderDevice.SCREEN.pixHalfHeight + RenderDevice.SCREEN.pixHalfHeight;
        const centerY = center.y * RenderDevice.SCREEN.pixHalfHeight + RenderDevice.SCREEN.pixHalfHeight;
        RenderDevice.SCREEN.ratioY = length / (topY - centerY);
    }

    handleInputEvent(e) {
        // common props event
        const { type, direction, center, velocityX, velocityY, isFinal } = e;
        console.log('handleInputEvent', e);

        // common event structure
        const event = {
            type,
            center,
            isFinal,
            direction,
            velocityX,
            velocityY,
        };

        // hack in our direction enums
        switch (direction) {
            default: break;
            case Hammer.DIRECTION_UP: event.direction = RenderDevice.DIRECTION.UP; break;
            case Hammer.DIRECTION_DOWN: event.direction = RenderDevice.DIRECTION.DOWN; break;
            case Hammer.DIRECTION_LEFT: event.direction = RenderDevice.DIRECTION.LEFT; break;
            case Hammer.DIRECTION_RIGHT: event.direction = RenderDevice.DIRECTION.RIGHT; break;
        }

        // send to target object
        let { target, tracking, rayCoords, rayCaster } = this.input3D;

        // no active target
        if (!target && !tracking) {
            // translate 2d screen point into ray
            rayCoords.x = (center.x / RenderDevice.SCREEN.pixWidth) * 2 - 1;
            rayCoords.y = -(center.y / RenderDevice.SCREEN.pixHeight) * 2 + 1;
            rayCaster.setFromCamera(rayCoords, this.camera);

            // find targets
            target = this.performInputCheck(rayCaster);
            
            // only pan gesture tracks
            if (type === 'pan') {
                this.input3D.target = target;
                this.input3D.tracking = true;
            }
        }

        // have a target
        if (target) {
            target.object.userData.onInputEvent(event, target.point);
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

    handleWheelSwipe(direction, clientX, clientY) {
        this.handleInputEvent({
            direction,
            type: 'swipe',
            isFinal: true,
            velocityX: 0,
            velocityY: 0,
            center: { x: clientX, y: clientY },
        });
    }

    handleWheelUp = (clientX, clientY) => {
        this.handleWheelSwipe(Hammer.DIRECTION_UP, clientX, clientY);
    }

    handleWheelDown = (clientX, clientY) => {
        this.handleWheelSwipe(Hammer.DIRECTION_DOWN, clientX, clientY);
    }

    handleWheelLeft = (clientX, clientY) => {
        this.handleWheelSwipe(Hammer.DIRECTION_LEFT, clientX, clientY);
    }

    handleWheelRight = (clientX, clientY) => {
        this.handleWheelSwipe(Hammer.DIRECTION_RIGHT, clientX, clientY);
    }

}

export default RenderDevice;
