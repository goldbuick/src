import React from 'react';
import TWEEN from 'tween.js';
import RenderScene from '../render/RenderScene';
import '../threejs/postprocessing/EffectComposer';

import '../threejs/shaders/FilmShader';
import '../threejs/shaders/CopyShader';
import '../threejs/shaders/DigitalGlitch';
import '../threejs/shaders/ConvolutionShader';
import '../threejs/shaders/LuminosityHighPassShader';

import '../threejs/postprocessing/MaskPass';
import '../threejs/postprocessing/FilmPass';
import '../threejs/postprocessing/ShaderPass';
import '../threejs/postprocessing/GlitchPass';
import '../threejs/postprocessing/RenderPass';
import '../threejs/postprocessing/UnrealBloomPass';

export default class Scene extends React.Component {

    static defaultProps = { 
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

        return [
            new THREE.RenderPass(scene, camera),
            new THREE.FilmPass(0.25, 1.5, height * 2, false),
            // resolution, strength, radius, threshold
            new THREE.UnrealBloomPass(new THREE.Vector2(512, 512), 0.4, 1, 0.3),
            new THREE.ShaderPass(THREE.CopyShader),
            // new THREE.GlitchPass(64),
        ];
    }

    handleUpdate = (renderer, composer, scene, camera, delta) => {
        TWEEN.update();
        this.props.onUpdate(renderer, composer, scene, camera, delta);
    }

    handleResize = (renderer, composer, scene, camera, width, height) => {
        this.props.onResize(renderer, composer, scene, camera, width, height);
    }

    render() {
        return <RenderScene 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}>{this.props.children}</RenderScene>;
    }

}
