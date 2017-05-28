import React from 'react';
import { observer } from 'mobx-react';
import DriverList from 'drivers/DriverList';
import DriverStore from 'drivers/DriverStore';
import ElementStore from 'elements/ElementStore';
import InterfaceStore from 'interfaces/InterfaceStore';
import InterfaceDisplay from 'interfaces/InterfaceDisplay';

@observer
export default class AppRender extends React.Component {

    static defaultProps = {
        onCreate: () => {},
    };

    componentDidMount() {
        this.props.onCreate(ElementStore);
    }

    render() {
        const { interface: Component = InterfaceDisplay } = InterfaceStore;
        return Component ? <Component>{this.renderDriver()}</Component> : null;        
    }

    renderDriver() {
        const { interface: Component = DriverList } = DriverStore;
        return Component ? <Component>{this.renderElements()}</Component> : null;        
    }

    renderElements() {
        const { list } = ElementStore;
        return list.map(element => {
            const { component: Component } = element;
            return Component ? <Component key={element.id} values={element} /> : null;
        });
    }
}

/*
is it possible to split element & driver implementation into micro-services ?
*/
