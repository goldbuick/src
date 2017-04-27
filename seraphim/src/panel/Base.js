import React from 'react';
// import * as THREE from 'three';
import Draft from '../viz/Draft';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const Panel = RenderObject.Pure((props) => {
    return <RenderObject {...props}
        name="Panel"

        onShell3D={(shell) => shell.plane(400, 300)}
        
        onInputEvent={({ type, event, animateState }) => {
            console.log(type);
        }}

        onChildren3D={(children) => {
            return children;
        }}

        onRender3D={() => {
            const draft = new Draft();
            draft.drawRect({ w: 400, h: 300, filled: false });
            return draft.build(Projection.plane(1));
        }}
    />;
});

export default Panel;
