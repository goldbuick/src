import React from 'react';
import TWEEN from 'tween.js';
import RenderScene from '../render/RenderScene';

import '../threejs/shaders/FilmShader';
import '../threejs/shaders/CopyShader';
import '../threejs/shaders/BokehShader';
import '../threejs/shaders/DigitalGlitch';
import '../threejs/shaders/ConvolutionShader';
import '../threejs/postprocessing/EffectComposer';
import '../threejs/postprocessing/MaskPass';
import '../threejs/postprocessing/BokehPass';
import '../threejs/postprocessing/FilmPass';
import '../threejs/postprocessing/BloomPass';
import '../threejs/postprocessing/ShaderPass';
import '../threejs/postprocessing/GlitchPass';
import '../threejs/postprocessing/RenderPass';

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
            // strength, kernelSize, sigma, resolution
            new THREE.BloomPass(1.5, 25, 4, 256),
            new THREE.ShaderPass(THREE.CopyShader),
            new THREE.FilmPass(0.25, 0.5, height * 2, false),
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
