import React from 'react';
import Text from '../viz/Text';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const BarrierGem = (props) => {
    return <RenderObject {...props}
        name="BarrierGem"

        onRender3D={(uuid) => {
            const draft = new Draft();
            const label = props.onBarrierGem({...props, uuid}, draft);

            const radius = 32;
            draft.drawHexPod({ x: props.radius, radius: radius * 0.5, count: 2, step: radius * 0.1, z: 10 });
            draft.drawHexPod({ x: props.radius, radius: radius, count: 4, step: radius * 0.1 });
            draft.drawHexPod({ x: props.radius, radius: radius * 0.5, count: 2, step: radius * 0.1, z: -10 });

            const base = new THREE.Object3D();
            base.add(draft.build(Projection.planeNonUniform(1, 1, 1, 1)));
            base.add(draft.build(Projection.planeNonUniform(1, -1, 1, -1)));
            base.add(Text.create({
                font: 'TECHMONO',
                text: label || uuid,
                ax: 0,
                scale: 0.5,
                position: {
                    x: 64 + props.radius,
                    y: 0,
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
