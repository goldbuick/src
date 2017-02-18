import React from 'react';
import TWEEN from 'tween.js';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import GenFaces from '../viz/GenFaces';
import Projection from '../viz/Projection';
import GenTransform from '../viz/GenTransform';
import RenderObject from '../render/RenderObject';
import { first, range, flatten } from '../util/UtilArray';

import MantleGem from './MantleGem';

const Mantle = (props) => {
    const smallScale = 0.00001;

    const createFaces = (radius) => {
        return GenFaces.createFromOctahedron({ radius, detail: 0 }).map(f => f.mid);
    };
    const faceIndex = (index, facesLength, mantleGemLength) => {
        return Math.round((index / (mantleGemLength-1)) * (facesLength-1));
    };            

    return <RenderObject {...props} 
        name="Mantle"

        onAnimate3D={(object3D, animateState, delta) => {
            object3D.rotation.y += delta * -0.2;

            let faces;
            const mantleGems = RenderObject.byType(object3D.children, MantleGem);
            RenderObject.animate(mantleGems, animateState, (mantleGem, anim, index) => {
                if (anim.toQuat === undefined) {
                    if (!faces) faces = createFaces(props.radius);

                    anim.index = faceIndex(index, faces.length, mantleGems.length);
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
                    new TWEEN.Tween(anim).to({ scale: 1 }, props.tweenDuration1)
                        .easing(props.tweenAlgo1).delay(props.tweenDelay).start();
                    new TWEEN.Tween(anim).to({ toQuatRatio: 1 }, props.tweenDuration2)
                        .easing(props.tweenAlgo2).delay(props.tweenDelay).start();
                }

                mantleGem.scale.setScalar(anim.scale);
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
