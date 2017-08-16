/* global THREE */
import 'three/examples/js/vr/ViveController';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/modifiers/TessellateModifier';

// eslint-disable-next-line
import WEBVR from 'exports-loader?WEBVR!three/examples/js/vr/WebVR';

const {
    OBJLoader,
    ViveController,
    TessellateModifier,
} = THREE;

export {
    WEBVR,
    OBJLoader,
    ViveController,
    TessellateModifier,
}
