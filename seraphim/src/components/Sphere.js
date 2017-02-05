import React from 'react';
import Theme from '../render/Theme';
import Draft from '../viz/Draft';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

import Text from '../viz/Text';
import GenFaces from '../viz/GenFaces';
import GenTransform from '../viz/GenTransform';

const Sphere = (props) => {
    return <RenderObject {...props}
        onRender3D={() => {
            const draft = new Draft();

            // GenFaces.createFromTriSphere({ radius: 450, detail: 2 }).forEach(face => {
            //     const points = GenTransform.map({
            //         points: face.points, 
            //         fn: GenTransform.radialTranslate({ x: face.mid.x, y: face.mid.y, z: face.mid.z, radius: -32 })
            //     });
            //     draft.drawTri({ points, alpha: true });
            //     draft.drawTri({ points, filled: false });

            //     const transform = GenTransform.radialTranslate({ x: 0, y: 0, z: 0, radius: 16 });
            //     const peak = transform(face.mid);
            //     draft.drawTri({ points: [ peak, points[0], points[1] ], filled: false });
            //     draft.drawTri({ points: [ peak, points[2], points[0] ], filled: false });
            // });

            const object3D = draft.build(Projection.plane(1));
            object3D.add(Text.create({
                scale: 8,
                font: 'NEONOIRE',
                text: 'exculta',
            }));

            return object3D;
        }}
        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.y += delta * 0.1;
        }}
    />;
};

Sphere.defaultProps = {
};

export default Sphere;


// OctahedronBufferGeometry