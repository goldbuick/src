import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import RenderDevice from './render/RenderDevice';
import RenderObject from './render/RenderObject';
import registerServiceWorker from '../registerServiceWorker';
import Text from '../gen/Text';
import { projectToColumn } from '../gen/Projection';

const App = () => (
    <RenderDevice>
        <RenderObject
            name="TextTest"
            onRender3D={() => {
                const base = new THREE.Group();
                const scale = 1;
                const guide = 10000;
                const step = 180 * scale;
                const color = new THREE.Color('rgb(192,41,66)');
                const guideColor = color.clone().offsetHSL(0, 0, -0.25);
                const material = new THREE.LineBasicMaterial({ color: guideColor });
                const testers = [
                    'FMREGULAR', 
                    'EXO2THIN', 
                    'FSULTRALIGHT',
                    'FSULTRALIGHT',
                    'EXO2THIN', 
                    'FMREGULAR', 
                ];
                
                const peak = testers.length * 0.5;
                testers.forEach((font, index) => {
                    let rStep = index % peak;
                    if (index >= peak) rStep = 2 - rStep;
                    const obj = Text({
                        font,
                        color,
                        scale,
                        ax: 0,
                        ay: 0,
                        // glow: true,
                        text: 'skyscraper courier sunglasses nodal point beef noodles',
                    });
                    obj.position.y = (index * -step) + ((testers.length-1) * step * 0.5);
                    projectToColumn(obj, { radius: 1024 + rStep * 256 });
                    base.add(obj);
                });

                const geometry = new THREE.Geometry();
                geometry.vertices.push(
                     new THREE.Vector3(0, -guide, 0),
                     new THREE.Vector3(0, guide, 0),
                );
                base.add(new THREE.Line(geometry, material));

                const anchor = new THREE.Group();
                anchor.add(base);
                anchor.position.z = -2024;

                return anchor;
            }}

            onAnimate3D={(object3D, anim, delta) => {
                anim.wiggle = (anim.wiggle || 0) + (delta * 0.3);
                const anchor = object3D.children[0];
                const base = anchor.children[0];
                base.children.forEach((child, i) => {
                    child.rotation.y = (i % 2 === 0) ? -anim.wiggle : anim.wiggle;
                });
                object3D.rotation.x = Math.cos(anim.wiggle) * -0.1;
                object3D.rotation.y = Math.sin(anim.wiggle) * 0.1;
                object3D.rotation.z = Math.cos(anim.wiggle) * 0.1;
            }}
        />
    </RenderDevice>
);

export default () => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
};
