import React from 'react';
import DriverRender from 'drivers/DriverRender';
import ElementRender from 'elements/ElementRender';
import InterfaceRender from 'interfaces/InterfaceRender';

export default class AppRender extends React.Component {

    static defaultProps = {
    };

    render() {
        return (
            <InterfaceRender>
                <DriverRender>
                    <ElementRender />
                </DriverRender>
            </InterfaceRender>
        );
    }
}

/*
is it possible to split element & driver implementation into micro-services ?
*/
