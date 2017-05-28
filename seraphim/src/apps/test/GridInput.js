import React from 'react';
import intro from 'anim/intro';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';

const cellSize = 128;

const GridInput = RenderObject.Pure(props => {
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
                const stepSize = cellSize + 16;
                const top = (props.rows * stepSize * 0.5) - (stepSize * 0.5);
                const left = (props.cols * stepSize * 0.5) - (stepSize * 0.5);
                const cells = RenderObject.byType(object3D.children, Panel);
                RenderObject.animate(cells, animateState, (cell, anim, index) => {
                    const attr = cellAttrs[index];
                    // console.log(attr);
                    intro.secondary(anim, 'px', 0, attr.x * -stepSize + left);
                    intro.secondary(anim, 'py', 0, attr.y * -stepSize + top);
                    cell.position.x = anim.px;
                    cell.position.y = anim.py;
                });
            }}
        >
            {cellAttrs.map(attr => (
                <Panel
                    name="GridInputCell"
                    key={attr.key}
                    width={cellSize}
                    height={cellSize}
                    onInputEvent={({ type, event, animateState }) => {
                        console.log(type, attr);
                    }}    
                />
            ))}
        </RenderObject>
    );
});

GridInput.defaultProps = {
    cols: 3,
    rows: 3,
    onCellTap: () => {},
};

export default GridInput;

