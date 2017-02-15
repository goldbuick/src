import React from 'react';
import Text from '../viz/Text';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereMantleGem = (props) => {
    return <RenderObject {...props} 
        name="SphereMantleGem"

        onRender3D={(uuid) => {
            const draft = new Draft();

            if (props.onMantleGem) {
                props.onMantleGem(draft);
            } else {
                const radius = props.radius * 0.15;
                draft.drawHexPod({ radius: radius, count: 3, step: radius * 0.1 });
            }

            const base = draft.tessellate(16).build(Projection.sphere(props.radius, 1));

            base.add(Text.create({
                font: 'TECHMONO',
                text: uuid,
                scale: 0.8,
                position: {
                    x: 0,
                    y: 0,
                    z: props.radius
                }
            }));

            return base;
        }}

    />;
};

SphereMantleGem.defaultProps = {
    radius: 512,
};

export default SphereMantleGem;
