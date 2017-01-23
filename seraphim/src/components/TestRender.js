import React from 'react';
import VizGen from '../viz/VizGen';
import VizDraft from '../viz/VizDraft';
import VizProjection from '../viz/VizProjection';
import RenderObject from '../render/RenderObject';

const TestRender = (props) => {
    return <RenderObject {...props}
        name="TestRender"

        onRender3D={() => {
            let seed = 'asd89fhaj9wnef',
                display = new VizDraft(),
                rng = VizGen.rng({ seed }),
                color = new THREE.Color(1, 0.5, 0.1);

            for (let i=1; i < 20; ++i) {
                display.drawBracket({ rng, w: 64, y: 320, x: i * -128, h: 512 + i * 16, facing: 1, color });
                display.drawBracket({ rng, w: 64, y: 320, x: i * 128, h: 512 - i * 16, facing: -1, color });
                display.drawBracket({ rng, w: 64, y: -320, x: i * -128, h: 512 - i * 8, facing: 1, color });
                display.drawBracket({ rng, w: 64, y: -320, x: i * 128, h: 512 + i * 8, facing: -1, color });
            }

            /*/
            let bazz = display.build(VizProjection.plane(1));
            /*/
            let bazz = display.build(VizProjection.column(2048, 1));
            //*/

            bazz.add(VizGen.text({
                color,
                scale: 3,
                text: '--<=={ exculta }==>--',
                // nudge: { x: 0, y: 11, z: 128 }
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

TestRender.defaultProps = {
    spin: 1
};

export default TestRender;

