import React from 'react';
import * as THREE from 'three';
import ReactDOM from 'react-dom';
import RenderDevice from './render/RenderDevice';
import RenderObject from './render/RenderObject';
import registerServiceWorker from '../registerServiceWorker';
import Text from '../gen/Text';

const App = () => (
    <RenderDevice>
        <RenderObject
            name="TextTest"
            onRender3D={() => {
                const base = new THREE.Group();
                const scale = 2;
                const z = -1024;
                const guide = 10000;
                const step = 100 * scale;
                const color = new THREE.Color('rgb(192,41,66)');
                const guideColor = color.clone().offsetHSL(0, 0, -0.25);
                const testers = [
                    'LOGO', 
                    'NEONOIRE', 
                    'EXO2THIN', 
                    'FMREGULAR', 
                    'FSULTRALIGHT',
                ];
                
                testers.forEach((font, index) => {
                    
                    const obj = Text({
                        font,
                        color,
                        scale,
                        ax: index % 2 === 0 ? 0 : 1,
                        text: 'Brisk.Evening.Star' + index,
                    });
                    obj.position.z = z;
                    obj.position.y = (index * -step) + ((testers.length-1) * step * 0.5);
                    base.add(obj);

                    const material = new THREE.LineBasicMaterial({ color: guideColor });
                    const geometry = new THREE.Geometry();
                    geometry.vertices.push(
                         new THREE.Vector3(-guide, obj.position.y, obj.position.z - 0.1),
                         new THREE.Vector3(guide, obj.position.y, obj.position.z - 0.1),
                    );
                    base.add(new THREE.Line(geometry, material));

                });

                const material = new THREE.LineBasicMaterial({ color: guideColor });
                const geometry = new THREE.Geometry();
                geometry.vertices.push(
                     new THREE.Vector3(0, -guide, z - 0.1),
                     new THREE.Vector3(0, guide, z - 0.1),
                );
                base.add(new THREE.Line(geometry, material));

                base.rotation.x = -0.1;
                base.rotation.y = 0.3;
                base.rotation.z = 0.1;
                base.position.x = 200;

                return base;
            }}
        />
    </RenderDevice>
);

export default () => {
    ReactDOM.render(<App />, document.getElementById('root'));
    registerServiceWorker();
};
