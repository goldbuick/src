import React from 'react';
import VizGen from '../sensorium/VizGen';
import VizEtch from '../sensorium/VizEtch';
import VizProjection from '../sensorium/VizProjection';
import RendererObject from '../sensorium/RendererObject';

const THREE = require('three');

const TestRenderer = (props) => {
    return <RendererObject {...props}
        name="TestRenderer"

        onRender3D={() => {
            let drift = 6,
                step = 64,
                gap = drift * 2,
                offset = step * gap * 0.5,
                etch = new VizEtch(),
                color = new THREE.Color();
                
            for (let i=0; i < step; ++i) {
                color.r = i / step;
                color.g = (step - i) / step;
                let radius = 128 + (Math.cos(i * 0.273) * 48) + (i * drift);
                etch.drawLoop({ color, steps: 12, radius, z: (i * gap) - offset});
            }

            return etch.build(VizProjection.plane(1));
        }}

        onAnimate3D={(obj, anim, delta) => {
            obj.rotation.x += delta * props.spin * 0.12;
            obj.rotation.y += delta * props.spin * 0.2;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

