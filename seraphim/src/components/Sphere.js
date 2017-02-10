import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import SphereConstruct from './SphereConstruct';
import RenderObject from '../render/RenderObject';

import TWEEN from 'tween.js';
import Text from '../viz/Text';
import GenFaces from '../viz/GenFaces';
import GenTransform from '../viz/GenTransform';

const Sphere = (props) => {
    return <RenderObject {...props}
        
        onChildren3D={(children) => {
            const constructs = RenderObject.byType(children, SphereConstruct, { sphereRadius: props.radius });
            // console.log(constructs);
            return [
                constructs
            ];
        }}

        onRender3D={() => {
        //     console.log('Render Sphere');
        //     // const draft = new Draft();

        //     // GenFaces.createFromTriSphere({ radius: 512, detail: 2 }).forEach(face => {
        //     //     const transform1 = GenTransform.radialTranslate({ x: face.mid.x, y: face.mid.y, z: face.mid.z, radius: -32 });
        //     //     const points = GenTransform.map({ points: face.points, fn: transform1 });

        //     //     draft.drawTri({ points, alpha: true });
        //     //     draft.drawTri({ points, filled: false });

        //     //     const transform2 = GenTransform.radialTranslate({ radius: 32 });
        //     //     const peak = transform2(face.mid);
        //     //     draft.drawTri({ points: [ peak, points[0], points[1] ], filled: false });
        //     //     draft.drawTri({ points: [ peak, points[1], points[2] ], filled: false });
        //     //     draft.drawTri({ points: [ peak, points[2], points[0] ], filled: false });
        //     // });

        //     // const object3D = new THREE.Group();
        //     // object3D.userData.sphere = draft.build(Projection.plane(1));
        //     // object3D.userData.sphere.position.z = -100;
        //     // object3D.add(object3D.userData.sphere);

        //     // // object3D.add(Text.create({
        //     // //     scale: 5,
        //     // //     font: 'LOGO',
        //     // //     text: 'crypto.cafe',
        //     // //     position: { x: 0, y: -128, z: 380 }
        //     // // }));
        //     // // object3D.add(Text.create({
        //     // //     scale: 1.8,
        //     // //     font: 'NEONOIRE',
        //     // //     text: 'merveilles',
        //     // //     position: { x: 0, y: -256, z: 380 }
        //     // // }));

        //     // return object3D;
            return Text.create({
                scale: 2.5,
                font: 'TECHMONO',
                text: '//= 53R4PHIM =//',
            });
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            animateState.angle = (animateState.angle || 0) + delta * 0.1;
            object3D.rotation.y = animateState.angle;

            const constructs = RenderObject.byType(object3D.children, SphereConstruct);
            RenderObject.animate(constructs, animateState, (construct, anim, index) => {
                if (anim.toQuat === undefined) {
                    const faces = GenFaces.createFromTriSphere({ radius: props.radius, detail: 1 });

                    const _index = index; //Math.round(Math.random() * (faces.length - 1));
                    anim.index = _index;
                    const face = faces[_index];
                    const forward = new THREE.Vector3(0, 0, 1);

                    const normal = new THREE.Vector3(face.mid.x, face.mid.y, face.mid.z).normalize();
                    anim.toQuat = new THREE.Quaternion();
                    anim.toQuat.setFromUnitVectors(forward, normal);
                    anim.toQuatRatio = 0;

                    const from = new THREE.Vector3((Math.random() - 0.5) * props.radius * 2, 0, 0).normalize();
                    anim.fromQuat = new THREE.Quaternion(); 
                    anim.fromQuat.setFromUnitVectors(forward, from);

                    const tween = new TWEEN.Tween(anim).
                        to({ toQuatRatio: 1 }, 1000).
                        easing(TWEEN.Easing.Exponential.InOut).
                        delay(500).
                        start();
                }

                construct.quaternion.copy(anim.fromQuat);
                construct.quaternion.slerp(anim.toQuat, anim.toQuatRatio);
            });
        }}
    />;
};

Sphere.defaultProps = {
    radius: 512
};

export default Sphere;


// OctahedronBufferGeometry