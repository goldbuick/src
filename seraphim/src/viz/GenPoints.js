
class GenPoints {

    vec({ x=0, y=0, z=0, radius, angle=0 }) {
        return { 
            x: x + Math.cos(angle) * radius,
            y: y + Math.sin(angle) * radius,
            z: z
        };
    }

    triangle({ x=0, y=0, z=0, radius=32, angle=0 } = {}) {
        const step = (Math.PI * 2) / 3;
        const points = [];
        for (let i=0; i < 3; ++i) {
            points.push(this.vec({ x, y, z, radius, angle: angle + i * step }));
        }
        return points;
    }

    rect({ x=0, y=0, z=0, w=32, h=32 } = {}) {
        let hw = w * 0.5,
            hh = h * 0.5;
        return [{
            x: x - hw, y: y - hh, z
        },{
            x: x + hw, y: y - hh, z
        },{
            x: x + hw, y: y + hh, z
        },{
            x: x - hw, y: y + hh, z
        },{
            x: x - hw, y: y - hh, z
        }];
    }

    diamond({ x=0, y=0, z=0, w=32, h=32 } = {}) {
        let hw = w * 0.5,
            hh = h * 0.5;
        return [{
            x: x, y: y - hh, z
        },{
            x: x + hw, y: y, z
        },{
            x: x, y: y + hh, z
        },{
            x: x - hw, y: y, z
        },{
            x: x, y: y - hh, z
        }];
    }

    chevron({ x=0, y=0, z=0, radius=32, angle=0, spread=0.6 } = {}) {
        let points = [ ];
        // left
        const leftAngle = angle - spread;
        points.push({
            x: x + Math.cos(leftAngle) * radius,
            y: y + Math.sin(leftAngle) * radius,
            z: z
        });
        // center
        points.push({ x: x, y: y, z: z });
        // right
        const rightAngle = angle + spread;
        points.push({
            x: x + Math.cos(rightAngle) * radius,
            y: y + Math.sin(rightAngle) * radius,
            z: z
        });
        return points;
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

    grid({ x=0, y=0, z=0, cx=4, cy=4, cz=4, spacing=32 } = {}) {
        let points = [],
            sx = x - ((cx - 1) * spacing * 0.5),
            sy = y - ((cy - 1) * spacing * 0.5),
            pz = z - ((cz - 1) * spacing * 0.5);

        for (let iz=0; iz < cz; ++iz) {
            let py = sy;
            for (let iy=0; iy < cy; ++iy) {
                let px = sx;
                for (let ix=0; ix < cx; ++ix) {
                    points.push({ x: px, y: py, z: pz });
                    px += spacing; 
                }
                py += spacing; 
            }
            pz += spacing; 
        }

        return points;
    }

    triGrid({ x=0, y=0, z=0, cx=4, cy=4, cz=4, spacing=32 } = {}) {
        let points = [],
            hspacing = spacing * 0.5,
            sx = x - ((cx - 1) * spacing * 0.5),
            sy = y - ((cy - 1) * spacing * 0.5),
            pz = z - ((cz - 1) * spacing * 0.5);

        for (let iz=0; iz < cz; ++iz) {
            let py = sy;
            for (let iy=0; iy < cy; ++iy) {
                let px = sx;
                for (let ix=0; ix < cx; ++ix) {
                    points.push({
                        x: px,
                        y: py + (ix % 2 === 0 ? 0 : hspacing),
                        z: pz + (cz < 2 || ix % 2 === 0 ? 0 : hspacing),
                    });
                    px += spacing; 
                }
                py += spacing; 
            }
            pz += spacing; 
        }

        return points;
    }

    createFromFunc({ x=0, y=0, z=0, count, looped, fn } = {}) {
        let points = [];
        for (let i=0; i <= count; ++i) {
            points.push(fn(x, y, z, i, count));
        }
        if (looped) points.push(points[0]);
        return points;
    }

    createFromGeometry({ x=0, y=0, z=0, geometry } = {}) {
        let used = { };
        return geometry.vertices.map(pt => {
            return { x: pt.x + x, y: pt.y + y, z: pt.z + z };
        }).filter(pt => {
            let key = `${pt.x}|${pt.y}|${pt.z}`,
                skip = used[key];
            used[key] = true;
            return !skip;
        });
    }

    createFromCircle({ x=0, y=0, z=0, radius, segments, thetaStart, thetaLength} = {}) {
        let geometry = new THREE.CircleGeometry(radius, segments, thetaStart, thetaLength);
        let points = this.createFromGeometry({ x, y, z, geometry });
        console.log('need to remove the first point ?', points);
        return points;
    }

    createFromSphere({ x=0, y=0, z=0, radius, widthSegments, heightSegments } = {}) {
        let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
        return this.createFromGeometry({ x, y, z, geometry });
    }

    createFromTriSphere({ x=0, y=0, z=0, radius, detail } = {}) {
        let geometry = new THREE.IcosahedronGeometry(radius, detail);
        return this.createFromGeometry({ x, y, z, geometry });
    }

    createFromRing({ x=0, y=0, z=0, innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength } = {}) {
        let geometry = new THREE.RingGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength);
        return this.createFromGeometry({ x, y, z, geometry });
    }

}

export default new GenPoints();
