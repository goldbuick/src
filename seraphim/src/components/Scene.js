import React from 'react';
import TWEEN from 'tween.js';
import * as THREE from 'three';
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

export default class Scene extends React.Component {

    static defaultProps = { 
        onWheel: () => { },
        onCreate: () => { },
        onUpdate: () => { },
        onResize: () => { },
    }

    handleCreate = (renderer, composer, scene, camera, width, height) => {
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
        TWEEN.update();
        this.props.onUpdate(renderer, composer, scene, camera, delta);
    }

    handleResize = (renderer, composer, scene, camera, width, height) => {
        // const dpr = window.devicePixelRatio || 1;
        this.props.onResize(renderer, composer, scene, camera, width, height);
    }

    render() {
        return <RenderScene 
            {...this.props}
            onWheel={this.props.onWheel}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}>{this.props.children}</RenderScene>;
    }

}
