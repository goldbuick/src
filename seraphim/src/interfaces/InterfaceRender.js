import React from 'react';
import InterfaceStore from 'interfaces/InterfaceStore';
import InterfaceDisplay from 'interfaces/InterfaceDisplay';

export default class InterfaceRender extends React.Component {
    render() {
        const { children } = this.props;

        return (
            <InterfaceDisplay>
                {children}
            </InterfaceDisplay>
        );
    }
}
