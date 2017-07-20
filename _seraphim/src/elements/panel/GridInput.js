import R from 'ramda';
import React from 'react';
import tween from 'anim/tween';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';

const onInputEvent = R.memoize((key, elementId, x, y, onCellTap) => {
    return ({ type, event, animateState }) => {
        if (type === 'tap') {
            tween.bounce(animateState, 'pz', 0, -100);
            tween.bounce(animateState, 'pscale', 1, 0.9);
            tween.bounce(animateState, 'pspin', 0, -0.5);
            onCellTap(key, elementId, x, y);
        }
    };
});

const GridInput = props => {
    const cellAttrs = [];
    for (let y=0; y<props.rows; ++y) {
        for (let x=0; x<props.cols; ++x) {
            cellAttrs.push({ key: `cell-${x}-${y}`, x, y });
        }
    }
    return (
        <RenderObject {...props}
            name="GridInput"
    
            onChildren3D={(children) => RenderObject.byType(children, Panel)}

            onAnimate3D={(object3D, animateState, delta) => {
                // animateState.elementId = props.elementId;
                animateState.offset = (animateState.offset || 0) + delta;
                const stepSize = props.cellSize + 16;
                const top = (props.rows * stepSize * 0.5) - (stepSize * 0.5);
                const left = (props.cols * stepSize * 0.5) - (stepSize * 0.5);
                const cells = RenderObject.byType(object3D.children, Panel);
                RenderObject.animate(cells, (cell, anim, index) => {
                    const attr = cellAttrs[index];
                    tween.secondary(anim, 'px', 0, attr.x * stepSize - left);
                    tween.secondary(anim, 'py', 0, attr.y * -stepSize + top);
                    cell.position.x = anim.px;
                    cell.position.y = anim.py;
                    cell.position.z = anim.pz || 0;
                    const scale = anim.pscale || 1;
                    cell.scale.set(scale, scale, scale);
                    cell.rotation.x = anim.pspin || 0;
                    cell.position.z += Math.cos(animateState.offset + attr.x + attr.y) * 8;
                });
            }}
        >
            {cellAttrs.map(attr => (
                <Panel
                    name="GridInputCell"
                    key={attr.key}
                    width={props.cellSize}
                    height={props.cellSize}
                    filled={props.filled[attr.key]}
                    onInputEvent={onInputEvent(attr.key, props.elementId, attr.x, attr.y, props.onCellTap)}
                />
            ))}
        </RenderObject>
    );
};

const cellSize = 64;

GridInput.defaultProps = {
    cellSize,
    cols: 3,
    rows: 3,
    filled: {},
    onCellTap: () => {},
};

export default RenderObject.Pure(GridInput);

export {
    cellSize,
};
