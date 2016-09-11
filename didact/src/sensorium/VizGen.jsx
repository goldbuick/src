const THREE = require('three');
import VizFont from './VizFont';
import createGeometry from 'three-bmfont-text';

class VizGen {

    arc({ x=0, y=0, z=0, steps=8, radius=8, front=0, back=0, drift=0, bump=0 } = {}) {
        let points = [ ],
            step = (Math.PI * 2) / steps;

        steps -= front + back;

        let angle = (front * step) + bump;
        for (let i=0; i <= steps; ++i) {
            points.push({
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                z: z
            });
            angle += step;
            radius += drift;
        }

        return points;    
    }

    textRetry({ placeholder, 
        font, text, position, color,
        scale, flip, ax, ay, nudge, 
        mode, width, callback } = {}) {

        console.log('textRetry', { 
            placeholder, 
            font, text, position, color, 
            scale, flip, ax, ay, nudge,
            mode, width, callback
        });

        return () => {
            let mesh = Gen.text({ 
                placeholder,
                font, text, position, color, 
                scale, flip, ax, ay, nudge, 
                mode, width, callback, noPlaceholder: true });

            placeholder.add(mesh);
            if (callback) callback(placeholder, mesh);
        };
    }

    text ({ font='OCRA', text='', position=[0, 0, 0], 
        scale=1, flip=-1, ax=0.5, ay=0.5, nudge=0, color=new THREE.Color(1, 1, 1),
        mode, width, callback, noPlaceholder } = {}) {

        let placeholder = new THREE.Object3D(),
            _font = VizFont(font, () => {
                return Gen.textRetry({ 
                    placeholder, font, text, position, color,
                    scale, flip, ax, ay, nudge,
                    mode, width, callback
                });
            });

        if (_font === undefined) return placeholder;
        
        let fopts = { text, font: _font.config };
        if (mode !== undefined) fopts.mode = mode;
        if (width !== undefined) fopts.width = width;

        let geometry = createGeometry(fopts),
            shader = Gen.textShader({
                color: color,
                transparent: true,
                texture: _font.texture,
                side: THREE.DoubleSide,
            }),
            material = new THREE.RawShaderMaterial(shader),
            mesh = new THREE.Mesh(geometry, material);

        let _width = geometry.layout.width * scale,
            _height = geometry.layout.height * scale;

        mesh.scale.multiplyScalar(scale);
        mesh.scale.x *= flip;
        position[0] -= _width * ax * -flip;
        position[1] -= _height * ay;

        if (nudge) {
            for (let i=0; i < 3; ++i) position[i] += nudge[i];
        }

        mesh.position.set(position[0], position[1], position[2]);
        mesh.rotation.z = Math.PI;

        if (noPlaceholder) return mesh;

        placeholder.add(mesh);
        if (callback) callback(placeholder, mesh);

        return placeholder;
    }

    textShader({ color, texture, opacity=1, alphaTest=0.0001, precision='highp' } = {}) {
        let opts = arguments[0];
        
        // remove to satisfy r73
        delete opts.texture;
        delete opts.color;
        delete opts.precision;
        delete opts.opacity;

        return Object.assign({
            uniforms: {
              opacity: { type: 'f', value: opacity },
              map: { type: 't', value: texture || new THREE.Texture() },
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

let Gen = new VizGen();

export default Gen;

