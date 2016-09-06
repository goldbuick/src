import React from 'react';
import TWEEN from 'tween.js';
import RendererScene from '../sensorium/RendererScene';

const THREE = require('three');
import '../sensorium/threejs/shaders/FilmShader';
import '../sensorium/threejs/shaders/CopyShader';
import '../sensorium/threejs/shaders/DigitalGlitch';
import '../sensorium/threejs/shaders/ConvolutionShader';
import '../sensorium/threejs/postprocessing/EffectComposer';
import '../sensorium/threejs/postprocessing/MaskPass';
import '../sensorium/threejs/postprocessing/FilmPass';
import '../sensorium/threejs/postprocessing/BloomPass';
import '../sensorium/threejs/postprocessing/ShaderPass';
import '../sensorium/threejs/postprocessing/GlitchPass';
import '../sensorium/threejs/postprocessing/RenderPass';

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
        camera.position.z = 1000;

        return [
            new THREE.RenderPass(scene, camera),
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
        return <RendererScene 
            {...this.props}
            onCreate={this.handleCreate}
            onUpdate={this.handleUpdate}
            onResize={this.handleResize}>{this.props.children}</RendererScene>;
    }

}
