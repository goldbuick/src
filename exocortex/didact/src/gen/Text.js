import Font from './Font';
import * as THREE from 'three';
import createGeometry from 'three-bmfont-text';
import SDFShader from 'three-bmfont-text/shaders/sdf';
import { convertToGeometry, convertToBufferGeometry } from '../gen/Convert';

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
}) {
    const anchor = new THREE.Object3D();
    anchor.userData.hasPendingMesh = true;

    Font(font).then(fontData => {
        const shader = SDFShader({
            color: color,
            transparent: true,
            map: fontData.texture,
            side: THREE.DoubleSide,
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

        // add to anchor
        anchor.add(mesh);
        anchor.userData.hasPendingMesh = false;
    });

    return anchor;
}
