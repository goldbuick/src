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
            let color = new THREE.Color(1, 0.5, 0.1),
                steps = 32,
                drift = 8,
                count = 16,
                gap = drift * 2,
                offset = count * gap * 0.5,
                display = new VizDraft();
                
            // for (let i=0; i < count; ++i) {
            //     color.r = i / count;
            //     color.g = (count - i) / count;
            //     let radius = 512 + (Math.cos(i * 0.373) * 48) + (i * drift),
            //         args = { color, steps, radius, width: 32, z: (i * gap) - offset };
            //     etch.drawSwipeAlt(args);
            //     etch.drawSwipeLineAlt(args);
            // }

            let params = { cx: 6, cy: 6, cz: 1, step: 128, color };
            params.points = VizGen.grid(params);
            display.drawGridLines(params);

            params.points.forEach(pt => {
                display.drawDiamond({ x: pt.x, y: pt.y, z: pt.z,
                    w: 16, h: 32, color });
                display.drawHexPod({ x: pt.x, y: pt.y, z: pt.z, 
                    radius: 32, count: 2, step: 8, color });
            });

            let bazz = display.build(VizProjection.plane(1));
            // bazz.add(VizGen.text({
            //     scale: 3,
            //     text: '--<=={ nexus }==>--',
            //     color
            // }));

            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            obj.rotation.x += delta * props.spin * 0.1;
            // obj.rotation.y += delta * props.spin * 0.2;
            obj.rotation.z += delta * props.spin * 0.3;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

