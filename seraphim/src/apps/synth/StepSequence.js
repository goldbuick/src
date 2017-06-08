import React from 'react';
import RenderObject from 'render/RenderObject';
import GridInput from 'elements/panel/GridInput';

class StepSequence extends React.Component {

    static defaultProps = {
        cols: 8,
        rows: 5,
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

    handleCellTap = (cellKey, elementId, x, y) => {
        console.log('handleCellTap', elementId, x, y);
        const filled = this.state.enabled[cellKey];
        const enabled = {
            ...this.state.enabled,
            [cellKey]: !filled,
        };
        this.setState({ enabled });
    }

}

export default RenderObject.Pure(StepSequence);
