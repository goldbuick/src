import React from 'react';
import TWEEN from 'tween.js';
import RenderScene from '../render/RenderScene';
import '../threejs/postprocessing/EffectComposer';

import '../threejs/shaders/FilmShader';
import '../threejs/shaders/CopyShader';
import '../threejs/shaders/SMAAShader';
import '../threejs/shaders/FXAAShader';
import '../threejs/shaders/DigitalGlitch';
import '../threejs/shaders/ConvolutionShader';
import '../threejs/shaders/LuminosityHighPassShader';

import '../threejs/postprocessing/MaskPass';
import '../threejs/postprocessing/FilmPass';
import '../threejs/postprocessing/SMAAPass';
import '../threejs/postprocessing/ShaderPass';
import '../threejs/postprocessing/GlitchPass';
import '../threejs/postprocessing/RenderPass';
import '../threejs/postprocessing/BloomBlendPass';
import '../threejs/postprocessing/UnrealBloomPass';

export default class Scene extends React.Component {

    static defaultProps = { 
        onWheel: () => { },
        onCreate: () => { },
        onUpdate: () => { },
        onResize: () => { },
    }

    handleCreate = (renderer, composer, scene, camera, width, height) => {
        this.props.onCreate(renderer, composer, scene, camera, width, height);

        // default lights
        let tilt = 32;
        [ -tilt, tilt ].map(tilt => {
            let light = new THREE.DirectionalLight(0xffffff, 0.2);
            light.position.set(tilt, 0, 8);
            return light;
        }).forEach(light => scene.add(light));

        // default camera position
        camera.position.z = 1024;

        const rez = 1024;
        this.fxaaShader = new THREE.ShaderPass(THREE.FXAAShader);
        return [
            new THREE.RenderPass(scene, camera),
            new THREE.SMAAPass(width, height),
            new THREE.BloomBlendPass(2, 1.2, new THREE.Vector2(rez, rez)),
            new THREE.FilmPass(0.25, 0.5, height * 2, false),
            // new THREE.GlitchPass(64),
            // this.fxaaShader,
        ];
    }

    handleUpdate = (renderer, composer, scene, camera, delta) => {
        TWEEN.update();
        this.props.onUpdate(renderer, composer, scene, camera, delta);
    }

    handleResize = (renderer, composer, scene, camera, width, height) => {
        const dpr = window.devicePixelRatio || 1;
        this.fxaaShader.uniforms.resolution.value = new THREE.Vector2(1 / (width * dpr), 1 / (height * dpr));
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
