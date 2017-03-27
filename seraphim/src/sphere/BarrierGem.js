import React from 'react';
import * as THREE from 'three';
import Text from '../viz/Text';
import Draft from '../viz/Draft';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const BarrierGem = (props) => {
    return <RenderObject {...props}
        name="BarrierGem"

        onRender3D={(uuid) => {
            const draft = new Draft();
            const base = new THREE.Object3D();
            const label = props.onBarrierGem({...props, uuid}, draft);
            
            const side1 = draft.build(Projection.planeNonUniform(1, 1, 1, 1));
            side1.position.x = props.radius;
            base.add(side1);
            
            const side2 = draft.build(Projection.planeNonUniform(1, -1, 1, -1));
            side2.position.x = props.radius;
            base.add(side2);

            base.add(Text.create({
                font: 'TECHMONO',
                text: label || 'barrier-gem',
                ax: 0,
                scale: 0.5,
                position: {
                    x: 48 + props.radius,
                    y: 2.5,
                    z: 0
                }
            }));

            return base;
        }}    
    />;
};

BarrierGem.defaultProps = {
    radius: 512,
    onBarrierGem: () => {}
};

export default BarrierGem;
