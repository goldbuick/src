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

            let label = 'BarrierGem';
            if (props.onBarrierGem) {
                label = props.onBarrierGem({...props, uuid}, draft);
            } else {
                const radius = 32;
                draft.drawHexPod({ x: props.radius, radius: radius, count: 4, step: radius * 0.1 });
                draft.drawHexPod({ x: props.radius, radius: radius - 10, count: 2, step: radius * 0.1, z: 16 });
                draft.drawHexPod({ x: props.radius, radius: radius - 10, count: 2, step: radius * 0.1, z: -16 });
            }

            const base = draft.build(Projection.plane(1));

            base.add(Text.create({
                font: 'TECHMONO',
                text: label || uuid,
                ax: 0,
                scale: 0.5,
                position: {
                    x: props.radius,
                    y: 64,
                    z: 0
                }
            }));

            return base;
        }}    
    />;
};

BarrierGem.defaultProps = {
    radius: 512,
};

export default BarrierGem;
