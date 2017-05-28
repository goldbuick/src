import genUuid from 'uuid';
import { setter } from 'mobx-decorators';
import { useStrict, action, computed, observable } from 'mobx';

useStrict(true);

class ElementStore {
    @observable list = [];
    @setter @observable elements = {};

    @action createElement(...valueSets) {
        let element = {};
        valueSets.forEach(values => {
            element = { ...element, ...values };
        });
        element = { ...element, id: genUuid() };
        this.elements[element.id] = element;
        this.list = Object.keys(this.elements).map(k => this.elements[k]);
        return element;
    }

    @action removeElement(element) {
        if (element && element.id) {
            delete this.elements[element.id];
        }
    }

    @action setValue(element, key, value) {
        const values = this.elements[element && element.id];
        if (values) values[key] = value;
        return value;
    }

    render(component) {
        return { component };
    }
}

export default new ElementStore();
