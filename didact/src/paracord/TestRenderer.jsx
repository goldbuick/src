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

            let params = { cx: 8, cy: 8, cz: 1, step: 128, length: 64, color };
            params.points = VizGen.sphere({ radius: 512, widthSegments: 64, heightSegments: 32 });

            let groups = VizGen.splitPointsByY(params);
            groups.forEach(segment => {
                let ipoints = VizGen.mapPoints({ points: segment, fn: VizGen.translate({ y: 4 }) });
                let opoints = VizGen.mapPoints({ points: segment, fn: VizGen.translate({ y: -4 }) });
                display.drawLine(ipoints, color);
                display.drawLine(opoints, color);
                display.drawSwipeWith({ ipoints, opoints, color });
            });

            let bazz = display.build(VizProjection.plane(1));
            bazz.add(VizGen.text({
                color,
                scale: 3,
                text: '--<=={ nexus }==>--'
            }));

            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            // obj.rotation.x += delta * props.spin * 0.1;
            obj.rotation.y += delta * props.spin * 0.2;
            obj.rotation.z += delta * props.spin * 0.3;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

