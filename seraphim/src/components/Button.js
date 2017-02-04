import React from 'react';
import RenderObject from '../render/RenderObject';

const Button = (props) => {
    return <RenderObject {...props}
        onPointer={({ pressed, object3D, animateState }) => {
            if (pressed === undefined) {
                animateState.buttonPressed = false;
                props.onButton(object3D, animateState, 'released');
            } else if (pressed === false && animateState.buttonPressed === true) {
                animateState.buttonPressed = false;
                props.onButton(object3D, animateState, 'clicked');
            } else if (pressed === true && animateState.buttonPressed !== true) {
                animateState.buttonPressed = true;
                props.onButton(object3D, animateState, 'pressed');
            }
        }}
    />;
};

Button.defaultProps = {
    onButton: () => { }
};

export default Button;
