import { setter } from 'mobx-decorators';
import { useStrict, observable } from 'mobx';

useStrict(true);

class InterfaceStore {
    @setter @observable interface;
}

export default new InterfaceStore();
