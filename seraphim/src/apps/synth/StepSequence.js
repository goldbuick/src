import React from 'react';
import tween from 'anim/tween';
import Panel from 'elements/panel/Core';
import RenderObject from 'render/RenderObject';
import GridInput from 'elements/panel/GridInput';

class StepSequence extends React.Component {

    static defaultProps = {
        cols: 1,
        rows: 1,
    };

    state = {
        enabled: {},
    };

    render() {
        const { enabled } = this.state;
        const { values, cols, rows } = this.props;
        return (
            <GridInput
                cols={cols}
                rows={rows}
                filled={enabled}
                elementId={values.id}
                onCellTap={this.handleCellTap}
            />
        );
    }

    handleCellTap = (cellKey, worldPosition, elementId) => {
        console.log('handleCellTap', elementId, worldPosition);
        const filled = this.state.enabled[cellKey];
        const enabled = {
            ...this.state.enabled,
            [cellKey]: !filled,
        };
        this.setState({ enabled });
    }

}

export default RenderObject.Pure(StepSequence);
