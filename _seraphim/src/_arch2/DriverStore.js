import { setter } from 'mobx-decorators';
import { useStrict, observable } from 'mobx';

useStrict(true);

class DriverStore {
    @setter @observable driver;
}

export default new DriverStore();
