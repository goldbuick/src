import React from 'react';
import intro from 'anim/intro';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';

const cellSize = 128;

const GridInput = RenderObject.Pure(props => {
    const cells = [];
    for (let y=0; y<props.rows; ++y) {
        for (let x=0; x<props.cols; ++x) {
            cells.push({ key: `cell-${x}-${y}`, x, y });
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
                    const col = index % props.cols;
                    const row = Math.floor(index / props.cols);
                    intro.secondary(anim, 'px', 0, col * -stepSize + left);
                    intro.secondary(anim, 'py', 0, row * -stepSize + top);
                    cell.position.x = anim.px;
                    cell.position.y = anim.py;
                });
            }}
        >
            {cells.map(cell => (
                <Panel
                    name="GridInputCell"
                    key={cell.key}
                    width={cellSize}
                    height={cellSize}
                    onInputEvent={({ type, event, animateState }) => {
                        console.log(cell, type);
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

