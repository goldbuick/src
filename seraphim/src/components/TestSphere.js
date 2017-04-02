import React from 'react';
import RenderObject from '../render/RenderObject';

import Sphere from '../sphere/Core';
import SphereMantleGem from '../sphere/MantleGem';
import SphereSubStrate from '../sphere/SubStrate';
import SphereBarrierGem from '../sphere/BarrierGem';

import GenAlgo from '../viz/GenAlgo';
import BJunkGraph from '../graphs/BJunkGraph';
import MRadialGraph from '../graphs/MRadialGraph';

const TestSphere = RenderObject.Pure((props) => {
    const radius = 512;
    const sphereMantleGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereMantleGem key={v} onMantleGem={MRadialGraph}/>);
    const sphereSubStrate = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereSubStrate key={v} verta={v*v*0.3}/>);
    const sphereBarrierGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereBarrierGem key={v} onBarrierGem={BJunkGraph}/>);

    return (
        <Sphere {...props} radius={radius}>
            {sphereMantleGem(8)}
            {sphereSubStrate(4)}
            {sphereBarrierGem(5)}
        </Sphere>
    );
});

TestSphere.defaultProps = Sphere.defaultProps;

export default TestSphere;