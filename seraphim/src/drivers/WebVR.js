import React from 'react';
import WebVRScene from './WebVRScene';
import RenderObject from '../render/RenderObject';

const WebLayout = RenderObject.Pure(props => {
    return null;
});

export default RenderObject.Pure(props => (
    <WebVRScene>
        <WebLayout>
            {props.children}
        </WebLayout>
    </WebVRScene>
));
