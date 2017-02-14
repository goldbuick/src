import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';
import { first, range, flatten } from '../util/UtilArray';

import SphereConstruct from './SphereConstruct';
import SphereSubStrate from './SphereSubStrate';

import TWEEN from 'tween.js';
import Text from '../viz/Text';
import GenFaces from '../viz/GenFaces';
import GenTransform from '../viz/GenTransform';

const Sphere = (props) => {

    const tweenDelay = 256;
    const tweenDuration1 = 400;
    const tweenDuration2 = tweenDuration1 + 1000;
    const tweenAlgo1 = TWEEN.Easing.Back.Out;
    const tweenAlgo2 = TWEEN.Easing.Elastic.Out;
    const smallScale = 0.00001;

    const createFaces = (radius) => {
        return GenFaces.createFromOctahedron({ radius, detail: 0 }).map(f => f.mid);
    };
    const faceIndex = (index, facesLength, constructLength) => {
        return Math.round((index / (constructLength-1)) * (facesLength-1));
    };            
    const putOnSphere = (vec, radius) => {
        const dir = new THREE.Vector3(vec.x, vec.y, vec.z).normalize();
        dir.multiplyScalar(radius);
        return dir;
    };

    return <RenderObject {...props}
        
        onChildren3D={(children) => {
            const constructs = RenderObject.byType(children, SphereConstruct, { sphereRadius: props.radius });
            const substrates = RenderObject.byType(children, SphereSubStrate, { sphereRadius: props.radius });
            return [
                constructs,
                substrates
            ];
        }}

        onRender3D={(children) => {
            const base = new THREE.Object3D();

            const draft = new Draft();
            const faces = createFaces(props.radius);

            const constructs = RenderObject.byType(children, SphereConstruct);
            const points = flatten(constructs.map((c, index) => {
                index = faceIndex(index, faces.length, constructs.length);
                return putOnSphere(faces[index], props.radius);
            }));

            points.forEach(from => {
                const _from = new THREE.Vector3(from.x, from.y, from.z);
                const joins = points.map(to => {
                    const _to = new THREE.Vector3(to.x, to.y, to.z);
                    const dist = _from.distanceTo(_to);
                    return { from, to, dist };
                }).filter(j => {
                    return j.dist;
                }).sort((a, b) => {
                    return a.dist - b.dist;
                });

                first(joins, 3).forEach(join => {
                    const arcs = range(0, 1).map(gap => {
                        const steps = 16;
                        const point = new THREE.Vector3();
                        return range(0, steps).map(v => {
                            point.lerpVectors(join.from, join.to, v / steps);
                            return putOnSphere(point, props.radius - gap * 4 - 16);
                        });
                    });
                    draft.drawSwipeWith({ opoints: arcs[0], ipoints: arcs[1], alpha: true });
                });
            });

            base.userData.connect = draft.build(Projection.plane(1));
            base.add(base.userData.connect);

            return base;
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            if (!animateState.scale) {
                animateState.spin = 0;
                animateState.scale = smallScale;
                animateState.rotation = Math.PI;
                new TWEEN.Tween(animateState).to({ scale: 1 }, tweenDuration1).easing(tweenAlgo1).delay(tweenDelay).start();
                new TWEEN.Tween(animateState).to({ rotation: 0 }, tweenDuration2).easing(tweenAlgo2).delay(tweenDelay).start();
            }
            animateState.spin += delta * 0.2;
            object3D.rotation.y = animateState.spin;
            object3D.userData.connect.rotation.y = animateState.rotation;
            object3D.userData.connect.scale.setScalar(animateState.scale);

            let faces;
            const constructs = RenderObject.byType(object3D.children, SphereConstruct);
            RenderObject.animate(constructs, animateState, (construct, anim, index) => {
                if (anim.toQuat === undefined) {
                    if (!faces) faces = createFaces(props.radius);

                    anim.index = faceIndex(index, faces.length, constructs.length);
                    const face = faces[anim.index];
                    const forward = new THREE.Vector3(0, 0, 1);

                    const normal = new THREE.Vector3(face.x, face.y, face.z).normalize();
                    anim.toQuat = new THREE.Quaternion();
                    anim.toQuat.setFromUnitVectors(forward, normal);
                    anim.toQuatRatio = 0;

                    const from = new THREE.Vector3(0, 0, 0);
                    anim.fromQuat = new THREE.Quaternion(); 
                    anim.fromQuat.setFromUnitVectors(forward, from);

                    anim.scale = smallScale;
                    new TWEEN.Tween(anim).to({ scale: 1 }, tweenDuration1).easing(tweenAlgo1).delay(tweenDelay).start();
                    new TWEEN.Tween(anim).to({ toQuatRatio: 1 }, tweenDuration2).easing(tweenAlgo2).delay(tweenDelay).start();
                }

                construct.scale.setScalar(anim.scale);
                construct.quaternion.copy(anim.fromQuat);
                construct.quaternion.slerp(anim.toQuat, anim.toQuatRatio);
            });

            const substrates = RenderObject.byType(object3D.children, SphereSubStrate);
            RenderObject.animate(substrates, animateState, (substrate, anim, index) => {
                substrate.rotation.x = Math.PI * 0.5;
                if (anim.scale === undefined) {
                    anim.scale = smallScale;
                    anim.position = 1024;
                    const targetPosition = props.radius + props.substrateDist + (index * props.substrateStep);
                    new TWEEN.Tween(anim).to({ scale: 1 }, tweenDuration1).easing(tweenAlgo1).delay(tweenDelay).start();
                    new TWEEN.Tween(anim).to({ position: targetPosition }, tweenDuration2).easing(tweenAlgo2).delay(tweenDelay).start();                    
                }
                substrate.scale.setScalar(anim.scale);
                substrate.position.y = -anim.position;
            });

        }}
    />;
};

Sphere.defaultProps = {
    radius: 512,
    substrateDist: 64,
    substrateStep: 32,
};

export default Sphere;


// OctahedronBufferGeometry