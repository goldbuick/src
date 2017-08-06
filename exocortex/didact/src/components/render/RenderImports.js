/* global THREE */
import 'three/examples/js/vr/ViveController';
import 'three/examples/js/loaders/OBJLoader';

// eslint-disable-next-line
import WEBVR from 'exports-loader?WEBVR!three/examples/js/vr/WebVR';

const {
    OBJLoader,
    ViveController,
} = THREE;

export {
    WEBVR,
    OBJLoader,
    ViveController,
}
