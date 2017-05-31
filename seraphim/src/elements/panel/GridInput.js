import React from 'react';
import tween from 'anim/tween';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';

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
                animateState.elementId = props.elementId;
                const stepSize = props.cellSize + 16;
                const top = (props.rows * stepSize * 0.5) - (stepSize * 0.5);
                const left = (props.cols * stepSize * 0.5) - (stepSize * 0.5);
                const cells = RenderObject.byType(object3D.children, Panel);
                RenderObject.animate(cells, (cell, anim, index) => {
                    const attr = cellAttrs[index];
                    tween.secondary(anim, 'px', 0, attr.x * -stepSize + left);
                    const hhh = tween.secondary(anim, 'py', 0, attr.y * -stepSize + top);
                    cell.position.x = anim.px;
                    cell.position.y = anim.py;
                    cell.position.z = anim.pz || 0;
                    if (hhh) {
                        setTimeout(() => {
                            anim.worldPosition = cell.getWorldPosition();
                            console.log('GridInput', props.elementId, anim.worldPosition);
                        }, 1000);
                    }
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
                    onInputEvent={({ type, event, animateState }) => {
                        if (type === 'tap') {
                            tween.bounce(animateState, 'pz', 0, -100);
                            props.onCellTap(attr.key, animateState.worldPosition, props.elementId);
                        }
                    }}    
                />
            ))}
        </RenderObject>
    );
};

GridInput.defaultProps = {
    cols: 3,
    rows: 3,
    filled: {},
    cellSize: 128,
    onCellTap: () => {},
};

export default RenderObject.Pure(GridInput);
