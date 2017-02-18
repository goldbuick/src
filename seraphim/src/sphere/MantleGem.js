import React from 'react';
import Text from '../viz/Text';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const MantleGem = (props) => {
    return <RenderObject {...props} 
        name="MantleGem"

        onRender3D={(uuid) => {
            let label;
            const draft = new Draft();

            if (props.onMantleGem) {
                label = props.onMantleGem({...props, uuid}, draft);
            } else {
                const radius = props.radius * 0.15;
                draft.drawHexPod({ radius: radius, count: 3, step: radius * 0.1 });
            }

            const base = draft.tessellate(16).build(Projection.sphere(props.radius, 1));

            base.add(Text.create({
                font: 'TECHMONO',
                text: label || uuid,
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

MantleGem.defaultProps = {
    radius: 512,
};

export default MantleGem;
