import Font from './Font';
import Theme from '../render/Theme';
import createGeometry from 'three-bmfont-text';
import SDFShader from 'three-bmfont-text/shaders/sdf';

class Text {

    retry({ 
        placeholder, 
        font,
        text,
        position,
        color,
        scale,
        flip,
        ax,
        ay,
        nudge, 
        mode,
        width,
        callback 
    } = {}) {
        return () => {
            let mesh = this.create({ 
                placeholder,
                font,
                text,
                position,
                color,
                scale,
                flip,
                ax,
                ay,
                nudge,
                mode,
                width,
                callback,
                noPlaceholder: true
            });
            placeholder.add(mesh);
            if (callback) callback(placeholder, mesh);
        };
    }

    create({ 
        font = 'TECH',
        text = '',
        position = new THREE.Vector3(0, 0, 0), 
        scale = 1,
        flip = -1,
        ax = 0.5,
        ay = 0.5,
        nudge, 
        color = Theme.color,
        mode, 
        width, 
        callback, 
        noPlaceholder
    } = {}) {
        const placeholder = new THREE.Object3D();
        const _font = Font(font, () => {
            return this.retry({ 
                placeholder,
                font,
                text,
                position,
                color,
                scale,
                flip,
                ax,
                ay,
                nudge,
                mode,
                width,
                callback
            });
        });

        if (_font === undefined) return placeholder;
        
        let fopts = { text, font: _font.config };
        if (mode !== undefined) fopts.mode = mode;
        if (width !== undefined) fopts.width = width;

        //
        const shader = SDFShader({
            color: color,
            transparent: true,
            map: _font.texture,
            side: THREE.DoubleSide,
        });
        /*/
        const shader = this.shader({
            color: color,
            transparent: true,
            map: _font.texture,
            side: THREE.DoubleSide,
        });
        //*/

        const geometry = createGeometry(fopts);
        const material = new THREE.RawShaderMaterial(shader);
        const mesh = new THREE.Mesh(geometry, material);

        let _width = geometry.layout.width * scale,
            _height = geometry.layout.height * scale;

        mesh.scale.multiplyScalar(scale);
        mesh.scale.x *= flip;
        position.x -= _width * ax * -flip;
        position.y -= _height * ay;

        if (nudge) {
            position.x += nudge.x;
            position.y += nudge.y;
            position.z += nudge.z;
        }

        mesh.position.copy(position);
        mesh.rotation.z = Math.PI;

        if (noPlaceholder) return mesh;

        placeholder.add(mesh);
        if (callback) callback(placeholder, mesh);

        return placeholder;
    }

    shader({ color, map, opacity=1, alphaTest=0.0001, precision='highp' } = {}) {
        let opts = arguments[0];
        
        // remove to satisfy r73
        delete opts.map;
        delete opts.color;
        delete opts.precision;
        delete opts.opacity;

        return Object.assign({
            uniforms: {
              opacity: { type: 'f', value: opacity },
              map: { type: 't', value: map || new THREE.Texture() },
              color: { type: 'c', value: new THREE.Color(color) }
            },
            vertexShader: `
                attribute vec2 uv;
                attribute vec4 position;
                uniform mat4 projectionMatrix;
                uniform mat4 modelViewMatrix;
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * position;
                }
            `,
            fragmentShader: `
                #ifdef GL_OES_standard_derivatives
                    #extension GL_OES_standard_derivatives : enable
                #endif

                precision ${precision} float;
                uniform float opacity;
                uniform vec3 color;
                uniform sampler2D map;
                varying vec2 vUv;

                float aastep(float value) {
                    #ifdef GL_OES_standard_derivatives
                        float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
                    #else
                        float afwidth = (1.0 / 32.0) * (1.4142135623730951 / (2.0 * gl_FragCoord.w));
                    #endif
                    return smoothstep(0.5 - afwidth, 0.5 + afwidth, value);
                }

                void main() {
                    vec4 texColor = texture2D(map, vUv);
                    float alpha = aastep(texColor.a);
                    gl_FragColor = vec4(color, opacity * alpha);
                    #ifdef ALPHATEST
                        if ( gl_FragColor.a < ${alphaTest} ) discard;
                    #endif
                }
            `,
            defines: {
                'ALPHATEST': Number(alphaTest || 0).toFixed(1)
            }
        }, opts);
    }

}

export default new Text();
