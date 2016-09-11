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
            let steps = 32,
                drift = 8,
                count = 8,
                gap = drift * 2,
                offset = count * gap * 0.5,
                etch = new VizEtch(),
                color = new THREE.Color();
                
            for (let i=0; i < count; ++i) {
                color.r = i / count;
                color.g = (count - i) / count;
                let radius = 512 + (Math.cos(i * 0.373) * 48) + (i * drift),
                    args = { color, steps, radius, width: 8, z: (i * gap) - offset };
                etch.drawSwipe(args);
                etch.drawSwipeLine(args);
            }

            let bazz = etch.build(VizProjection.plane(1));
            bazz.add(VizGen.text({
                text: '<--== Gear Soul ==-->',
                color: new THREE.Color(0.9, 0.6, 1)
            }));

            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            // obj.rotation.x += delta * props.spin * 0.12;
            obj.rotation.y += delta * props.spin * 0.2;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

