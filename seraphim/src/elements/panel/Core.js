import React from 'react';
import Draft from 'viz/Draft';
import Projection from 'viz/Projection';
import RenderObject from 'render/RenderObject';

const Panel = RenderObject.Pure((props) => {
    return <RenderObject {...props}
        name="Panel"

        onShell3D={(shell) => shell.plane(props.width, props.height)}
        
        onInputEvent={({ type, event, animateState }) => {
            console.log(type);
        }}

        onChildren3D={(children) => {
            return children;
        }}

        onRender3D={() => {
            const draft = new Draft();
            draft.drawRect({ w: props.width, h: props.height, filled: false });
            return draft.build(Projection.plane(1));
        }}
    />;
});

Panel.defaultProps = {
    width: 400,
    height: 300,
};

export default Panel;
