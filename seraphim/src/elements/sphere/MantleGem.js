import React from 'react';
import Text from '../viz/Text';
import Draft from '../viz/Draft';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const MantleGem = (props) => {
    return <RenderObject {...props} 
        name="MantleGem"

        onRender3D={(uuid) => {
            const draft = new Draft();
            const label = props.onMantleGem({...props, uuid}, draft);
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
    onMantleGem: () => {}
};

export default MantleGem;
