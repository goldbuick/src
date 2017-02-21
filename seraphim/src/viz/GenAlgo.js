import Alea from 'alea';
import PF from 'pathfinding';
import SimplexNoise from 'simplex-noise';
import { range } from '../util/UtilArray';

class GenAlgo {

    range({ from = 0, to = 0 } = {}) {
        return range(from, to);
    }

    rng({ seed = '23904jasoifjo' } = {}) {
        return new Alea(seed);
    }

    noise({ seed } = {}) {
        return new SimplexNoise(this.rng({seed}));
    }

    rngRange({ min = 0, max = 16, rng }) {
        return Math.floor(rng() * (max - min + 1)) + min;
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

    tracers({ points, cols, rows, goals } = {}) {
        let paths = [],
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

    angles({ points } = {}) {
        let result = [];
        let a = new THREE.Vector3();
        let b = new THREE.Vector3();
        let c = new THREE.Vector3();

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
}

export default new GenAlgo();

