import React from 'react';
import Scene from './Scene';
import MouseWheel from '../util/MouseWheel';

import Sphere from '../sphere/Core';
import SphereBarrier from '../sphere/Barrier';
import SphereMantleGem from '../sphere/MantleGem';
import SphereSubStrate from '../sphere/SubStrate';
import SphereBarrierGem from '../sphere/BarrierGem';

import GenAlgo from '../viz/GenAlgo';
import BJunkGraph from '../graphs/BJunkGraph';
import MRadialGraph from '../graphs/MRadialGraph';

export default class Page extends React.Component {

    constructor(...args) {
        super(...args);
        this.state = { showLayer: 1 };
        this.mousewheel = new MouseWheel({
            onSwipeUp: this.changeShowLayerUp,
            onSwipeDown: this.changeShowLayerDown
        });
    }

    changeShowLayer(delta) {
        const showLayer = Math.max(0, Math.min(3, this.state.showLayer + delta));
        this.setState({ showLayer });
    }

    changeShowLayerUp = () => this.changeShowLayer(-1)
    changeShowLayerDown = () => this.changeShowLayer(1)

    render() {
        const radius = 512;
        const sphereMantleGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereMantleGem key={v} onMantleGem={MRadialGraph}/>);
        const sphereSubStrate = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereSubStrate key={v} verta={v*v*0.3}/>);
        const sphereBarrierGem = (count) => GenAlgo.range({ from: 1, to: count }).map(v => <SphereBarrierGem key={v} onBarrierGem={BJunkGraph}/>);

        return (
            <Scene onWheel={this.mousewheel.onWheel}>
                <Sphere radius={radius} showLayer={this.state.showLayer}>
                    {sphereMantleGem(8)}
                    {sphereSubStrate(4)}
                    {sphereBarrierGem(5)}
                </Sphere>
            </Scene>
        );
    }

}
