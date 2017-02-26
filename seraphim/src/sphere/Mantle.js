import React from 'react';
import Draft from '../viz/Draft';
import intro from '../anim/intro';
import GenFaces from '../viz/GenFaces';
import GenPoints from '../viz/GenPoints';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

import MantleGem from './MantleGem';

const Mantle = (props) => {

    const createFaces = (detail, radius) => {
        return GenFaces.createFromOctahedron({ radius, detail }).map(f => f.mid);
    };
    const faceIndex = (index, facesLength, mantleGemLength) => {
        return Math.round((index / (mantleGemLength-1)) * (facesLength-1));
    };            

    return <RenderObject {...props} 
        name="Mantle"

        onRender3D={(uuid) => {
            const base = new THREE.Object3D();
            
            const draft = new Draft();
            draft.drawPoints(GenPoints.createFromIcosahedronGeometry({ radius: props.radius - 8, detail: 2 }));
            const mantle = draft.build(Projection.plane(1));

            base.add(mantle);
            base.userData.mantle = mantle;
            return base;
        }}

        onAnimate3D={(object3D, animateState, delta) => {
            intro.primary(animateState, 'scale', intro.CONST.smallScale, 1);
            intro.setScale(animateState, object3D.userData.mantle);

            let faces;
            const mantleGems = RenderObject.byType(object3D.children, MantleGem);
            RenderObject.animate(mantleGems, animateState, (mantleGem, anim, index) => {
                intro.primary(anim, 'scale', intro.CONST.smallScale, 1);
                intro.setScale(anim, mantleGem);

                if (intro.secondary(anim, 'toQuatRatio', 0, 1)) {
                    if (!faces) faces = createFaces(0, props.radius);

                    anim.index = faceIndex(index, faces.length, mantleGems.length);
                    const face = faces[anim.index];
                    const forward = new THREE.Vector3(0, 0, 1);

                    const normal = new THREE.Vector3(face.x, face.y, face.z).normalize();
                    anim.toQuat = new THREE.Quaternion();
                    anim.toQuat.setFromUnitVectors(forward, normal);

                    const from = new THREE.Vector3(0, 0, 0);
                    anim.fromQuat = new THREE.Quaternion(); 
                    anim.fromQuat.setFromUnitVectors(forward, from);
                }

                mantleGem.quaternion.copy(anim.fromQuat);
                mantleGem.quaternion.slerp(anim.toQuat, anim.toQuatRatio);
            });            
        }}

    />;
};

Mantle.defaultProps = {
    radius: 512,
};

export default Mantle;
