const THREE = require('three');

import Alea from 'alea';
import PF from 'pathfinding';
import SimplexNoise from 'simplex-noise';
import createGeometry from 'three-bmfont-text';

import VizFont from './VizFont';

class _VizGen {

    textRetry({ placeholder, 
        font, text, position, color,
        scale, flip, ax, ay, nudge, 
        mode, width, callback } = {}) {

        return () => {
            let mesh = VizGen.text({ 
                placeholder,
                font, text, position, color, 
                scale, flip, ax, ay, nudge, 
                mode, width, callback, noPlaceholder: true });

            placeholder.add(mesh);
            if (callback) callback(placeholder, mesh);
        };
    }

    text ({ font='TECH', text='', position=[0, 0, 0], 
        scale=1, flip=-1, ax=0.5, ay=0.5, nudge=0, color=new THREE.Color(1, 1, 1),
        mode, width, callback, noPlaceholder } = {}) {

        let placeholder = new THREE.Object3D(),
            _font = VizFont(font, () => {
                return VizGen.textRetry({ 
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
            shader = VizGen.textShader({
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

    value(v) {
        return () => v;
    }

    translate({ x=0, y=0, z=0 } = {}) {
        return pt => {
            return {
                x: pt.x + x,
                y: pt.y + y,
                z: pt.z + z
            };
        };
    }

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

    noise({ seed } = {}) {
        let r = new Alea(seed);
        return new SimplexNoise(r);
    }

    filterPoints({ points, seed, scale, fn } = {}) {
        let r = VizGen.noise({ seed });
        return points.filter(pt => {
            let v = r.noise3D(
                pt.x * scale,
                pt.y * scale,
                pt.z * scale);
            return fn(v, pt.x, pt.y, pt.z);
        });
    }

    mapPoints({ points, fn } = {}) {
        let result = [ ],
            count = points.length-1;
        for (let i=0; i < points.length; ++i) {
            result.push(fn(points[i], i, count, points));
        }
        return result;
    }

    splitPointsByY({ points } = {}) {
        let groups = { };
        for (let i=0; i < points.length; ++i) {
            let pt = points[i];
            if (groups[pt.y] === undefined) groups[pt.y] = [];
            groups[pt.y].push(pt);
        }
        return Object.keys(groups)
            .map(key => groups[key])
            .filter(group => group.length > 1);
    }

    points({ x=0, y=0, z=0, count=1, looped, fn } = {}) {
        let points = [];
        for (let i=0; i <= count; ++i) {
            points.push(fn(x, y, z, i, count));
        }
        if (looped) points.push(points[0]);
        return points;
    }

    edge({ points, fn } = {}) {
        let last1,
            last2,
            radius,
            edge = [ ],
            count = points.length-1,
            a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            turn = new THREE.Vector3(),
            flip = new THREE.Vector3(),
            spin = (v1, v2) => {
                if (v1.y * v2.x > v1.x * v2.y) {
                    return -1;
                }
                return 1;
            },
            project = (v1, v2, v3, value) => {
                a.subVectors(v1, v2).normalize();
                b.subVectors(v3, v2).normalize();
                turn.addVectors(a, b).normalize();
                if (turn.length() === 0) {
                    turn.set(a.y, -a.x, a.z);
                } else {
                    value = Math.abs(value);
                    if (spin(a, b) > 0) value = -value;
                    if (radius < 0) value = -value;
                }
                turn.multiplyScalar(value);
                return {
                    x: v2.x + turn.x,
                    y: v2.y + turn.y,
                    z: v2.z + turn.z                    
                };
            };

        if (points.length) {
            a.set(points[0].x, points[0].y, points[0].z);
            b.set(points[points.length-1].x, points[points.length-1].y, points[points.length-1].z);
            let closed = a.distanceToSquared(b) < 0.0001;

            radius = -fn(0, count);
            if (closed) {
                edge.push(project(points[points.length-2], points[0], points[1], radius));
            } else {
                flip.subVectors(points[0], points[1]).add(points[0]);
                edge.push(project(flip, points[0], points[1], radius));
            }

            for (let i=1; i < points.length-1; ++i) {
                radius = -fn(i, count);
                edge.push(project(points[i-1], points[i], points[i+1], radius));
            }

            radius = -fn(closed ? 0 : count, count);
            last1 = points[points.length-1];
            last2 = points[points.length-2];
            if (closed) {
                edge.push(project(last2, last1, points[1], radius));
            } else {
                flip.subVectors(last1, last2).add(last1);
                edge.push(project(last2, last1, flip, radius));
            }
        }
        return edge;
    }

    chevron({ x=0, y=0, z=0, radius=32, angle=0, spread=1.57 } = {}) {
        let points = [ ];
        // left
        points.push({
            x: x + Math.cos(angle - spread) * radius,
            y: y + Math.sin(angle - spread) * radius,
            z: z
        });
        // center
        points.push({ x: x, y: y, z: z });
        // left
        points.push({
            x: x + Math.cos(angle + spread) * radius,
            y: y + Math.sin(angle + spread) * radius,
            z: z
        });
        return points;        
    }

    circle({ x, y, z, count, fn } = {}) {
        return VizGen.points({ 
            x, y, z, count, looped: true, fn: (x, y, z, i, count) => {
            let angle = (i / count) * Math.PI * 2,
                radius = fn(angle, i, count);
            return {
                x: x + Math.cos(angle) * radius,
                y: y + Math.sin(angle) * radius,
                z: z
            };
        }});
    }

    sphere({ x=0, y=0, z=0, radius, widthSegments, heightSegments } = {}) {
        let used = { },
            geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        return geometry.vertices.map(pt => {
            return { x: pt.x + x, y: pt.y + y, z: pt.z + z };
        }).filter(pt => {
            let key = `${pt.x}|${pt.y}|${pt.z}`,
                skip = used[key];
            used[key] = true;
            return !skip;
        });
    }

    angles({ points } = {}) {
        let result = [],
            a = new THREE.Vector3(),
            b = new THREE.Vector3(),
            c = new THREE.Vector3();

        let lastAngle;
        for (let i=0; i < points.length-1; ++i) {
            a.set(points[i].x, points[i].y, points[i].z);
            b.set(points[i+1].x, points[i+1].y, points[i+1].z);
            c.subVectors(b, a);
            lastAngle = Math.atan2(c.y, c.x);
            result.push({
                x: points[i].x,
                y: points[i].y,
                z: points[i].z,
                angle: lastAngle
            });
        }

        a.set(points[0].x, points[0].y, points[0].z);
        b.set(points[points.length-1].x, points[points.length-1].y, points[points.length-1].z);
        // closed
        if (a.distanceToSquared(b) < 0.0001) {
            let last1 = points[points.length-2],
                last2 = points[0];
            a.set(last1.x, last1.y, last1.z);
            b.set(last2.x, last2.y, last2.z);
            c.subVectors(b, a);
            lastAngle = Math.atan2(c.y, c.x); 
        }

        result.push({
            x: points[points.length-1].x,
            y: points[points.length-1].y,
            z: points[points.length-1].z,
            angle: lastAngle
        });

        return result;
    }

    spaces({ x=0, y=0, z=0, wx=256, wy=256, fn } = {}) {
        let points = [],
            build = (count, left, top, right, bottom) => {
                let cx = left + (right - left) * 0.5,
                    cy = top + (bottom - top) * 0.5;

                points.push({ x: left,  y: top,    z: z});
                points.push({ x: right, y: top,    z: z});
                points.push({ x: left,  y: bottom, z: z});
                points.push({ x: right, y: bottom, z: z});

                // top left
                if (fn(count, left, top)) build(count + 1, left, top, cx, cy);
                // top right
                if (fn(count, right, top)) build(count + 1, cx, top, right, cy);
                // bottom left
                if (fn(count, left, bottom)) build(count + 1, left, cy, cx, bottom);
                // bottom right
                if (fn(count, right, bottom)) build(count + 1, cx, cy, right, bottom);
            };

        build(0, x - wx, y - wy, x + wx, y + wy);
        return points;
    }

    grid({ x=0, y=0, z=0, cx=4, cy=4, cz=4, step=32 } = {}) {
        let points = [],
            sx = x - ((cx - 1) * step * 0.5),
            sy = y - ((cy - 1) * step * 0.5),
            pz = z - ((cz - 1) * step * 0.5);

        for (let iz=0; iz < cz; ++iz) {
            let py = sy;
            for (let iy=0; iy < cy; ++iy) {
                let px = sx;
                for (let ix=0; ix < cx; ++ix) {
                    points.push({ x: px, y: py, z: pz });
                    px += step; 
                }
                py += step; 
            }
            pz += step; 
        }

        return points;
    }

    triGrid({ x=0, y=0, z=0, cx=4, cy=4, cz=4, step=32 } = {}) {
        let points = [],
            hstep = step * 0.5,
            sx = x - ((cx - 1) * step * 0.5),
            sy = y - ((cy - 1) * step * 0.5),
            pz = z - ((cz - 1) * step * 0.5);

        for (let iz=0; iz < cz; ++iz) {
            let py = sy;
            for (let iy=0; iy < cy; ++iy) {
                let px = sx;
                for (let ix=0; ix < cx; ++ix) {
                    points.push({
                        x: px,
                        y: py + (ix % 2 === 0 ? 0 : hstep),
                        z: pz + (cz < 2 || ix % 2 === 0 ? 0 : hstep),
                    });
                    px += step; 
                }
                py += step; 
            }
            pz += step; 
        }

        return points;
    }

    tracers({ points, cols, rows } = {}) {
        let paths = [],
            goals = Array.prototype.slice.call(arguments, 3),
            finder = new PF.AStarFinder({
                heuristic: PF.Heuristic.chebyshev,
                diagonalMovement: PF.DiagonalMovement.IfAtMostOneObstacle
            });

        let grid = new PF.Grid(cols, rows);
        return goals.map(coords => {
            let result = [ ];

            let a, b = [ coords.shift(), coords.shift() ];
            do {
                a = b,
                b = [ coords.shift(), coords.shift() ];
                let path = finder.findPath(a[0], a[1], b[0], b[1], grid);
                paths.push(path);
                if (result.length) path.shift();
                result = result.concat(path);

                // gen grid for next path
                grid = new PF.Grid(cols, rows);
                paths.forEach(pts => {
                    pts.forEach(pt => {
                        grid.setWalkableAt(pt[0], pt[1], false);
                    });
                });
            } while (coords.length);

            return result.map(pt => {
                let offset = pt[0] + pt[1] * cols;
                return {
                    x: points[offset].x,
                    y: points[offset].y,
                    z: points[offset].z
                };
            });
        });
    }

    flow({ noise, x=0, y=0, z=0, velocity=1, steps=32, toffset=0.123 } = {}) {
        let points = [{ x: x, y: y, z: z }];

        let pscale = 0.002;
        let tscale = 0.003;
        toffset = toffset || 0;
        for (let i=0; i < steps; ++i) {
            x += velocity * noise.noise4D(x * pscale, y * pscale, z * pscale + toffset, i * tscale);
            y += velocity * noise.noise4D(y * pscale, x * pscale, z * pscale + toffset, i * tscale);
            z += velocity * noise.noise4D(z * pscale, y * pscale, x * pscale + toffset, i * tscale);
            points.push({ x: x, y: y, z: z });
        }

        return points;
    }

}

let VizGen = new _VizGen();
export default VizGen;
