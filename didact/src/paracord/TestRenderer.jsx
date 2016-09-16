import React from 'react';
import VizGen from '../sensorium/VizGen';
import VizDraft from '../sensorium/VizDraft';
import VizProjection from '../sensorium/VizProjection';
import RendererObject from '../sensorium/RendererObject';

const THREE = require('three');

const TestRenderer = (props) => {
    return <RendererObject {...props}
        name="TestRenderer"

        onRender3D={() => {
            let display = new VizDraft(),
                color = new THREE.Color(1, 0.5, 0.1);

            let params = { z: -64, cx: 4, cy: 4, cz: 2, step: 128, gap: 12, color };
            params.points = VizGen.grid(params);
            display.drawGridDashes(params);
            params.points.forEach(pt => {
                display.drawDiamond({ x: pt.x, y: pt.y, z: pt.z, w: 16, h: 16, color });
            });

            let bazz = display.build(VizProjection.plane(1));
            bazz.add(VizGen.text({
                color,
                scale: 3,
                text: '--<=={ nexus }==>--',
                nudge: { x: 0, y: 11, z: 128 }
            }));            
            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            // obj.rotation.x += delta * props.spin * 0.1;
            obj.rotation.y += delta * props.spin * 0.2;
            // obj.rotation.z += delta * props.spin * 0.3;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

