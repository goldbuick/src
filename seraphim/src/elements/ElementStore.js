import genUuid from 'uuid';
import { setter } from 'mobx-decorators';
import { useStrict, observable } from 'mobx';

useStrict(true);

class ElementStore {
    @setter @observable elements = [];
}

export default new ElementStore();
