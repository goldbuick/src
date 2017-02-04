import React from 'react';
import VizGen from '../viz/VizGen';
import VizDraft from '../viz/VizDraft';
import { range } from '../util/UtilArray';
import VizProjection from '../viz/VizProjection';
import RenderObject from '../render/RenderObject';

const TestRender = (props) => {
    return <RenderObject {...props}
        name="TestRender"

        onRender3D={() => {
            let seed = 'asd89fhaj9wnef',
                display = new VizDraft(),
                rng = VizGen.rng({ seed }),
                color = new THREE.Color(
                    148 / 255,
                    208 / 255, 
                    255 / 255);

            for (let i=1; i < 20; ++i) {
                display.drawBracket({ rng, w: 64, y: 320, x: i * -128, h: 512 + i * 16, facing: 1, color });
                display.drawBracket({ rng, w: 64, y: 320, x: i * 128, h: 512 - i * 16, facing: -1, color });
                display.drawBracket({ rng, w: 64, y: -320, x: i * -128, h: 512 - i * 8, facing: 1, color });
                display.drawBracket({ rng, w: 64, y: -320, x: i * 128, h: 512 + i * 8, facing: -1, color });
            }

            let bazz = display.build(VizProjection.column(1024, 1));

            bazz.add(VizGen.text({
                color,
                scale: 3,
                text: '--<=={ exculta }==>--',
            }));

            let count = 64;
            let split = 64;
            display = range(0, Math.round(count / split)).map(d => new VizDraft());

            let noise = VizGen.noise({ seed });
            let steps = 256;
            let radius = 600;
            let velocity = 64;
            for (let i=0; i < count; ++i) {
                let toffset = i * 0.002;
                let angle = (i / count) * Math.PI * 2;

                let x = 0, y = 0, z = 0;
                x = Math.cos(angle) * radius;
                y = Math.sin(angle) * radius;

                let points = VizGen.flow({ noise, x, y, z, velocity, steps, toffset });
                display[Math.round(i / split)].drawLine(points, color);
            }

            display.forEach(d => bazz.add(d.build(VizProjection.plane(1))));

            return bazz;
        }}

        onAnimate3D={(obj, anim, delta) => {
            obj.rotation.y += delta * props.spin;
        }} 
    />;
};

TestRender.defaultProps = {
    spin: 0.2
};

export default TestRender;

