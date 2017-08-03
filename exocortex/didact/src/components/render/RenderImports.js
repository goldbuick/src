/* global THREE */
import 'three/examples/js/vr/ViveController';

import 'three/examples/js/postprocessing/EffectComposer';

import 'three/examples/js/shaders/FilmShader';
import 'three/examples/js/shaders/SMAAShader';
import 'three/examples/js/shaders/CopyShader';
import 'three/examples/js/shaders/DigitalGlitch';
import 'three/examples/js/shaders/ConvolutionShader';
import 'three/examples/js/shaders/LuminosityHighPassShader';

import './three/BloomBlendPass';
import 'three/examples/js/postprocessing/FilmPass';
import 'three/examples/js/postprocessing/SMAAPass';
import 'three/examples/js/postprocessing/ShaderPass';
import 'three/examples/js/postprocessing/GlitchPass';
import 'three/examples/js/postprocessing/RenderPass';

// eslint-disable-next-line
import WEBVR from 'exports-loader?WEBVR!three/examples/js/vr/WebVR';

const {
    ViveController,
    
    EffectComposer,

    BloomBlendPass,
    FilmPass,
    SMAAPass,
    ShaderPass,
    GlitchPass,
    RenderPass,
} = THREE;

export {
    WEBVR,
    ViveController,
    
    EffectComposer,

    BloomBlendPass,
    FilmPass,
    SMAAPass,
    ShaderPass,
    GlitchPass,
    RenderPass,
}
