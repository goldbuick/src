import React from 'react';
import Theme from '../render/Theme';
import VizDraft from '../viz/VizDraft';
import VizProjection from '../viz/VizProjection';
import RenderObject from '../render/RenderObject';

const Sphere = (props) => {
    return <RenderObject {...props}
        onRender3D={() => {
            const base = new THREE.Group();
            return base;
        }}
    />;
};

Sphere.defaultProps = {
};

export default Sphere;
