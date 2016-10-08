import React from 'react';
import TWEEN from 'tween.js';
import RendererScene from '../apt/RendererScene';

const THREE = require('three');
import '../apt/threejs/shaders/FilmShader';
import '../apt/threejs/shaders/CopyShader';
import '../apt/threejs/shaders/BokehShader';
import '../apt/threejs/shaders/DigitalGlitch';
import '../apt/threejs/shaders/ConvolutionShader';
import '../apt/threejs/postprocessing/EffectComposer';
import '../apt/threejs/postprocessing/MaskPass';
import '../apt/threejs/postprocessing/BokehPass';
import '../apt/threejs/postprocessing/FilmPass';
import '../apt/threejs/postprocessing/BloomPass';
import '../apt/threejs/postprocessing/ShaderPass';
import '../apt/threejs/postprocessing/GlitchPass';
import '../apt/threejs/postprocessing/RenderPass';

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
            // new THREE.BokehPass(scene, camera, {
            //     focus: 0.25,
            //     aperture: 0.025,
            //     maxblur: 1,
            //     width,
            //     height,
            // }),
            new THREE.BloomPass(2.5, 25, 4, 256),
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
