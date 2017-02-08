import React from 'react';
import Draft from '../viz/Draft';
import Theme from '../render/Theme';
import Projection from '../viz/Projection';
import RenderObject from '../render/RenderObject';

const SphereHalo = (props) => {
    return <RenderObject {...props}        
    />;
};

SphereHalo.defaultProps = {
};

export default SphereHalo;
