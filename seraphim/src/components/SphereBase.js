import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereBase = (props) => {
    return <RenderObject {...props}        
    />;
};

SphereBase.defaultProps = {
};

export default SphereBase;
