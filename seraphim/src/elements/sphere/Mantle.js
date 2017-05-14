import React from 'react';
import * as THREE from 'three';
import Draft from 'viz/Draft';
import intro from 'util/intro';
import GenPoints from 'viz/GenPoints';
import Projection from 'viz/Projection';
import RenderObject from 'render/RenderObject';

import MantleGem from './MantleGem';

const Mantle = RenderObject.Pure((props) => {

    return <RenderObject {...props} 
        name="Mantle"

        onRender3D={() => {
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

            const mantleGems = RenderObject.byType(object3D.children, MantleGem);
            RenderObject.animate(mantleGems, animateState, (mantleGem, anim, index) => {
                intro.primary(anim, 'scale', intro.CONST.smallScale, 1);
                intro.setScale(anim, mantleGem);

                if (intro.secondary(anim, 'toQuatRatio', 0, 1)) {
                    const eachRow = Mantle.EACH_ROW;
                    const tiltAmount = Mantle.TILT_AMOUNT;

                    const offset = index % eachRow;
                    const ratio = offset / eachRow;
                    const row = Math.floor(index / eachRow);
                    const singleRow = mantleGems.length <= eachRow;
                    const angleStep = (Math.PI * 2) / eachRow;

                    const tiltAngle = singleRow ? 0 : (row ? -tiltAmount : tiltAmount);
                    const tilt = new THREE.Quaternion();
                    tilt.setFromEuler(new THREE.Euler(tiltAngle, 0, 0, 'XYZ'));

                    const spinAngle = ratio * Math.PI * 2 + (singleRow ? 0 : row ? 0 : angleStep * 0.5);
                    const spin = new THREE.Quaternion();
                    spin.setFromEuler(new THREE.Euler(0, spinAngle, 0, 'XYZ'));

                    anim.toQuat = new THREE.Quaternion();
                    anim.toQuat.multiplyQuaternions(spin, tilt);

                    const forward = new THREE.Vector3(0, 0, 1);
                    const from = new THREE.Vector3(0, 0, 0);
                    anim.fromQuat = new THREE.Quaternion(); 
                    anim.fromQuat.setFromUnitVectors(forward, from);
                }

                mantleGem.quaternion.copy(anim.fromQuat);
                mantleGem.quaternion.slerp(anim.toQuat, anim.toQuatRatio);
            });            
        }}

    />;
});

Mantle.EACH_ROW = 4;
Mantle.TILT_AMOUNT = 0.5;

Mantle.defaultProps = {
    radius: 512,
};

export default Mantle;
