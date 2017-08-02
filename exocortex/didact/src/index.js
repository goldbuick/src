import './index.css';
import * as THREE from 'three';
// global shim for three-bmfont-text
window.THREE = THREE;
import('./components/App').then(mod => mod.default());
