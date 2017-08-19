import Font from './Font';
import * as THREE from 'three';
import createGeometry from 'three-bmfont-text';
import SDFShader from 'three-bmfont-text/shaders/sdf';
import { convertToGeometry, convertToBufferGeometry } from '../gen/Convert';

const fragmentShader = `
precision highp float;
uniform float opacity;
uniform vec3 color;
uniform sampler2D map;
varying vec2 vUv;

float aastep(float value) {
    float afwidth = (1.0 / 3.0);
    return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
}

void main() {
    vec4 texColor = texture2D(map, vUv);
    float alpha = aastep(texColor.a);
    if (alpha > 0.5) {
        alpha = 0.0;
    }
    gl_FragColor = vec4(color, opacity * alpha);
    if (gl_FragColor.a < 0.00001) discard;
}
`;

export default function({ 
    text,
    font,
    color,
    // extra ops
    mode,
    width,
    align,
    // sizing, centering ops
    scale = 1,
    ax = 0.5,
    ay = 0.5,
    // glow fx
    glow = false,
}) {
    const anchor = new THREE.Object3D();
    anchor.userData.hasPendingMesh = true;

    Font(font).then(fontData => {

        const shader = SDFShader({
            color: color,
            transparent: false,
            map: fontData.texture,
            side: glow ? THREE.FrontSide : THREE.DoubleSide,
        });

        const geometry = createGeometry({
            text,
            mode,
            align,
            width,
            font: fontData.config,
            flipY: fontData.texture.flipY,
        });
        const material = new THREE.RawShaderMaterial(shader);
        const mesh = new THREE.Mesh(geometry, material);

        // anchoring position
        const { layout } = geometry;
        const layoutScale = fontData.scale * scale;
        const layoutWidth = layout.width * layoutScale;
        const layoutHeight = (layout.height - (layout.descender + fontData.descender)) * layoutScale;
        mesh.geometry = convertToGeometry(mesh.geometry);
        mesh.geometry.scale(layoutScale, layoutScale, 1);
        mesh.geometry = convertToBufferGeometry(mesh.geometry);
        mesh.position.set(-(layoutWidth * ax), -(layoutHeight * ay), 0);

        // z-flip
        mesh.scale.x *= -1;
        mesh.rotation.z = Math.PI;

        // create outline
        if (glow) {
            const outline = SDFShader({
                fragmentShader,
                color: color,
                transparent: true,
                map: fontData.texture,
            });
            const mesh2 = mesh.clone();
            mesh2.material = new THREE.RawShaderMaterial(outline);
            anchor.add(mesh2);
        }

        // add to anchor
        anchor.add(mesh);

        // wait for projection
        anchor.userData.hasPendingMesh = false;
    });

    return anchor;
}
