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

            for (let i=1; i < 16; ++i) {
                display.drawBracket({ y: 320, x: i * -192, h: 512 + i * 16, facing: 1, color });
                display.drawBracket({ y: 320, x: i * 192, h: 512 + i * 16, facing: -1, color });
                display.drawBracket({ y: -320, x: i * -192, h: 512 - i * 8, facing: 1, color, z: 128 });
                display.drawBracket({ y: -320, x: i * 192, h: 512 - i * 8, facing: -1, color, z: 128 });
            }

            /*/
            let bazz = display.build(VizProjection.plane(1));
            /*/
            let bazz = display.build(VizProjection.sphere(256, 1));
            //*/

            bazz.add(VizGen.text({
                color,
                scale: 3,
                text: '--<=={ haxkz }==>--',
                // nudge: { x: 0, y: 11, z: 128 }
            }));            
            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            obj.rotation.x += delta * props.spin * 0.1;
            obj.rotation.y += delta * props.spin * 0.2;
            obj.rotation.z += delta * props.spin * 0.3;
        }} 
    />;
};

TestRenderer.defaultProps = {
    spin: 1
};

export default TestRenderer;

