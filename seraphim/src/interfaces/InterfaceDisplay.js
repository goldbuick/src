import React from 'react';
import Hammer from 'hammerjs';
import * as THREE from 'three';
import MouseWheel from './input/MouseWheel';
import RenderScene from 'render/RenderScene';
import RenderObject from 'render/RenderObject';

import '../render/postprocessing/EffectComposer';

import '../render/shaders/FilmShader';
import '../render/shaders/CopyShader';
import '../render/shaders/DigitalGlitch';
import '../render/shaders/ConvolutionShader';
import '../render/shaders/LuminosityHighPassShader';

import '../render/postprocessing/FilmPass';
import '../render/postprocessing/ShaderPass';
import '../render/postprocessing/GlitchPass';
import '../render/postprocessing/RenderPass';
import '../render/postprocessing/BloomBlendPass';
import '../render/postprocessing/SSAARenderPass';
import '../render/postprocessing/TAARenderPass';

export default class InterfaceDisplay extends React.PureComponent {

    input3D = {
        rayCoords: new THREE.Vector2(),
        rayCaster: new THREE.Raycaster(),
    };

    constructor(...args) {
        super(...args);

        this.mousewheel = new MouseWheel({
            onSwipeUp: this.handleWheelUp,
            onSwipeDown: this.handleWheelDown,
            onSwipeLeft: this.handleWheelLeft,
            onSwipeRight: this.handleWheelRight,
        });
    }


    handleCreate = (renderer, renderScene, width, height) => {
        renderer.autoClear = false;
        this.renderScene = renderScene;
        const { scene, camera } = renderScene;
        
        // camera.position.z = 1024;

        // let tilt = 32;
        // [ -tilt, tilt ].map(tilt => {
        //     let light = new THREE.DirectionalLight(0xffffff, 0.2);
        //     light.position.set(tilt, 0, 8);
        //     return light;
        // }).forEach(light => scene.add(light));

        this.composer = new THREE.EffectComposer(renderer);

        const rez = 1024;
        let passes = [
            new THREE.TAARenderPass(scene, camera),
            new THREE.BloomBlendPass(2, 1.2, new THREE.Vector2(rez, rez)),
            new THREE.FilmPass(0.25, 0.5, height * 2, false),
            // new THREE.GlitchPass(64),
        ];

        passes.forEach(pass => this.composer.addPass(pass));
        passes.pop().renderToScreen = true;
    }

    handleUpdate = (renderer, renderScene, delta) => {
        renderer.clear();
        this.composer.render(delta);
    }

    handleResize = (renderer, renderScene, width, height) => {
        this.composer.setSize(width, height);
    }

    handleInputEvent(e) {
        // common props event
        const { type, direction, center, velocityX, velocityY, isFinal } = e;

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
            case Hammer.DIRECTION_UP: event.direction = RenderObject.DIRECTION.UP; break;
            case Hammer.DIRECTION_DOWN: event.direction = RenderObject.DIRECTION.DOWN; break;
            case Hammer.DIRECTION_LEFT: event.direction = RenderObject.DIRECTION.LEFT; break;
            case Hammer.DIRECTION_RIGHT: event.direction = RenderObject.DIRECTION.RIGHT; break;
        }

        // send to target object
        let { target, tracking, rayCoords, rayCaster } = this.input3D;

        // no active target
        if (!target && !tracking && this.renderScene) {
            // translate 2d screen point into ray
            rayCoords.x = (center.x / RenderScene.SCREEN.width) * 2 - 1;
            rayCoords.y = -(center.y / RenderScene.SCREEN.height) * 2 + 1;
            rayCaster.setFromCamera(rayCoords, this.renderScene.camera);

            // find targets
            target = this.renderScene.performRayCheck3D(rayCaster);
            
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

    render() {
        return (
            <RenderScene
                onCreate={this.handleCreate}
                onUpdate={this.handleUpdate}
                onResize={this.handleResize}
                onTap={this.handleTap}
                onPan={this.handlePan}
                onPress={this.handlePress}
                onSwipe={this.handleSwipe}
                onDoubleTap={this.handleDoubleTap}
                onWheel={this.mousewheel.handleWheel}>
                {this.props.children}
            </RenderScene>
        );
    }

}
