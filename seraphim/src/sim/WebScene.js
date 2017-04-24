import React from 'react';
import * as THREE from 'three';
import WebScreen from './WebScreen';
import HammerComponent from 'react-hammerjs';
import RenderScene from '../render/RenderScene';
import '../threejs/postprocessing/EffectComposer';

import '../threejs/shaders/FilmShader';
import '../threejs/shaders/CopyShader';
import '../threejs/shaders/DigitalGlitch';
import '../threejs/shaders/ConvolutionShader';
import '../threejs/shaders/LuminosityHighPassShader';

import '../threejs/postprocessing/FilmPass';
import '../threejs/postprocessing/ShaderPass';
import '../threejs/postprocessing/GlitchPass';
import '../threejs/postprocessing/RenderPass';
import '../threejs/postprocessing/BloomBlendPass';
import '../threejs/postprocessing/SSAARenderPass';
import '../threejs/postprocessing/TAARenderPass';

export default class Scene extends React.PureComponent {

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
    }

    handleCreate = (renderer, composer, scene, camera, width, height) => {
        this.scene = scene;
        this.props.onCreate(renderer, composer, scene, camera, width, height);

        camera.position.z = 1024;

        let tilt = 32;
        [ -tilt, tilt ].map(tilt => {
            let light = new THREE.DirectionalLight(0xffffff, 0.2);
            light.position.set(tilt, 0, 8);
            return light;
        }).forEach(light => scene.add(light));

        const rez = 1024;
        return [
            /*/
            new THREE.RenderPass(scene, camera),
            /*/
            new THREE.TAARenderPass(scene, camera),
            //*/
            new THREE.BloomBlendPass(2, 1.2, new THREE.Vector2(rez, rez)),
            new THREE.FilmPass(0.25, 0.5, height * 2, false),
            // new THREE.GlitchPass(64),
        ];
    }

    handleUpdate = (renderer, composer, scene, camera, delta) => {
        this.props.onUpdate(renderer, composer, scene, camera, delta);
    }

    handleResize = (renderer, composer, scene, camera, width, height) => {
        // global constants to help place objects in view
        WebScreen.width = width;
        WebScreen.height = height;
        WebScreen.halfWidth = width * 0.5;
        WebScreen.halfHeight = height * 0.5;

        const length = 100;
        const center = new THREE.Vector3(0, 0, 1).project(camera);
        const top = new THREE.Vector3(0, length, 1).project(camera);
        const left = new THREE.Vector3(length, 0, 1).project(camera);

        const leftX = left.x * WebScreen.halfWidth + WebScreen.halfWidth;
        const centerX = center.x * WebScreen.halfWidth + WebScreen.halfWidth;
        WebScreen.ratioX = length / (leftX - centerX);

        const topY = top.y * WebScreen.halfHeight + WebScreen.halfHeight;
        const centerY = center.y * WebScreen.halfHeight + WebScreen.halfHeight;
        WebScreen.ratioY = length / (topY - centerY);
        
        this.props.onResize(renderer, composer, scene, camera, width, height);
    }

    handleInputEvent(e) {
        console.log(e);
    }

    handleTap = (e) => this.handleInputEvent(e)
    handlePan = (e) => this.handleInputEvent(e)
    handlePress = (e) => this.handleInputEvent(e)
    handleSwipe = (e) => this.handleInputEvent(e)
    handleDoubleTap = (e) => this.handleInputEvent(e)

    render() {
        return (
            <HammerComponent
                direction="DIRECTION_ALL"
                onTap={this.handleTap}
                onPan={this.handlePan}
                onPress={this.handlePress}
                onSwipe={this.handleSwipe}
                onDoubleTap={this.handleDoubleTap}>
                <RenderScene 
                    onCreate={this.handleCreate}
                    onUpdate={this.handleUpdate}
                    onResize={this.handleResize}
                    onWheel={this.props.onWheel}>
                    {this.props.children}</RenderScene>
            </HammerComponent>
        );
    }

}

