import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

import Text from '../viz/Text';
import GenFaces from '../viz/GenFaces';
import GenTransform from '../viz/GenTransform';

const Sphere = (props) => {
    return <RenderObject {...props}
        
        onChildren3D={(children) => {
            return children.map(child => React.cloneElement(child, { sphereRadius: props.radius }));
        }}

        // onRender3D={() => {
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
        // }}

        onAnimate3D={(object3D, animateState, delta) => {
            // object3D.userData.sphere.rotation.y += delta * 0.1;
        }}
    />;
};

Sphere.defaultProps = {
    radius: 512
};

export default Sphere;


// OctahedronBufferGeometry