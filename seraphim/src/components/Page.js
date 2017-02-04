import React from 'react';
import Scene from './Scene';
import TWEEN from 'tween.js';
import Theme from '../render/Theme';
import TestRender from './TestRender';

import Button from './Button';
import VizDraft from '../viz/VizDraft';
import VizProjection from '../viz/VizProjection';

export default class Page extends React.Component {

    render() {
        return <Scene>
            <Button name="TestButton"
                onRender3D={() => {
                    return new VizDraft().
                        drawRect({ x: 0, y: 0, w: 200, h: 200, color: Theme.color, alpha: true }).
                        drawRange(0, 10, (draft, v) => {
                            const r1 = 200 + v * 32;
                            const r2 = 200 + v * 16;
                            draft.drawRect({ x: 0, y: 0, w: r2, h: r2, color: Theme.color, filled: false });
                            draft.drawDiamond({ x: 0, y: 0, w: r1, h: r1, color: Theme.color, filled: false });
                        }).
                        build(VizProjection.plane(1));
                }}

                onAnimate3D={(object3D, animateState, delta) => {
                    object3D.rotation.z = (animateState.angle || 0);
                }} 

                onButton={(object3D, animateState, button) => {
                    if (button === 'clicked') {
                        animateState.angle = 0;
                        let tweenA = new TWEEN.Tween(animateState).
                            to({ angle: Math.PI }).
                            easing(TWEEN.Easing.Quadratic.InOut);
                        let tweenB = new TWEEN.Tween(animateState).
                            to({ angle: 0 }).
                            easing(TWEEN.Easing.Quadratic.InOut);
                        tweenA.chain(tweenB);
                        tweenA.start();
                    }
                }}
            />
        </Scene>;
    }

}
