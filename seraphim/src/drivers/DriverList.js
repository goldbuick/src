import React from 'react';
import RenderScene from 'render/RenderScene';
import RenderObject from 'render/RenderObject';

const DriverList = (props) => (
    <RenderObject {...props}
        name="DriverList"
        
        onAnimate3D={(object3D, animateState, delta) => {
            animateState.offset = (animateState.offset || 0) + delta;

            object3D.children.forEach((child, i) => {
                child.position.y = i * -(RenderScene.SCREEN.height * 0.5);
                child.position.x = Math.cos(animateState.offset + i) * 8;
            });
        }}
    />
);

export default DriverList;
