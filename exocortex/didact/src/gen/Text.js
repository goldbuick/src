import Font from './Font';
import * as THREE from 'three';
import createGeometry from 'three-bmfont-text';
import SDFShader from 'three-bmfont-text/shaders/sdf';

export default function({ text, font, color }) {
    const anchor = new THREE.Object3D();

    Font(font).then(fontData => {
        const shader = SDFShader({
            color: color,
            transparent: true,
            map: fontData.texture,
            side: THREE.DoubleSide,
        });

        const geometry = createGeometry({
            text,
            font: fontData.config,
        });
        const material = new THREE.RawShaderMaterial(shader);
        const mesh = new THREE.Mesh(geometry, material);

        console.log(mesh);

        anchor.add(mesh);
    });

    return anchor;
}

// class Text {

//     retry({ 
//         placeholder, 
//         font,
//         text,
//         position,
//         color,
//         scale,
//         flip,
//         ax,
//         ay,
//         nudge, 
//         mode,
//         width,
//         callback 
//     } = {}) {
//         return () => {
//             let mesh = this.create({ 
//                 placeholder,
//                 font,
//                 text,
//                 position,
//                 color,
//                 scale,
//                 flip,
//                 ax,
//                 ay,
//                 nudge,
//                 mode,
//                 width,
//                 callback,
//                 noPlaceholder: true
//             });
//             placeholder.add(mesh);
//             if (callback) callback(placeholder, mesh);
//         };
//     }

//     create({ 
//         font = 'TECH',
//         text = '',
//         position = new THREE.Vector3(0, 0, 0), 
//         scale = 1,
//         flip = -1,
//         ax = 0.5,
//         ay = 0.5,
//         nudge, 
//         color = RenderColor.color,
//         mode, 
//         width, 
//         callback, 
//         noPlaceholder
//     } = {}) {
//         const placeholder = new THREE.Object3D();
//         const _font = Font(font, () => {
//             return this.retry({ 
//                 placeholder,
//                 font,
//                 text,
//                 position,
//                 color,
//                 scale,
//                 flip,
//                 ax,
//                 ay,
//                 nudge,
//                 mode,
//                 width,
//                 callback
//             });
//         });

//         if (_font === undefined) return placeholder;
        
//         let fopts = { text, font: _font.config };
//         if (mode !== undefined) fopts.mode = mode;
//         if (width !== undefined) fopts.width = width;

//         //
//         const shader = SDFShader({
//             color: color,
//             transparent: true,
//             map: _font.texture,
//             side: THREE.DoubleSide,
//         });
//         /*/
//         const shader = this.shader({
//             color: color,
//             transparent: true,
//             map: _font.texture,
//             side: THREE.DoubleSide,
//         });
//         //*/

//         const geometry = createGeometry(fopts);
//         const material = new THREE.RawShaderMaterial(shader);
//         const mesh = new THREE.Mesh(geometry, material);

//         let _width = geometry.layout.width * scale,
//             _height = geometry.layout.height * scale;

//         mesh.scale.multiplyScalar(scale);
//         mesh.scale.x *= flip;
//         position.x -= _width * ax * -flip;
//         position.y -= _height * ay;

//         if (nudge) {
//             position.x += nudge.x;
//             position.y += nudge.y;
//             position.z += nudge.z;
//         }

//         mesh.position.copy(position);
//         mesh.rotation.z = Math.PI;

//         if (noPlaceholder) return mesh;

//         placeholder.add(mesh);
//         if (callback) callback(placeholder, mesh);

//         return placeholder;
//     }

// }
