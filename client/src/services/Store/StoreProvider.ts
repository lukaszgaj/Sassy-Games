import {injectable} from 'inversify';
import {Store} from 'redux';
import {RootState} from '../../redux/RootState';

@injectable()
export class StoreProvider {
    private store: Store<RootState>;

    setStore(store: Store<RootState>) {
        this.store = store;
    }

    getState(): RootState {
        return this.getStore().getState();
    }

    getStore(): Store<RootState> {
        if (!this.store) {
            throw new Error('The store object wasn\'t set yet.');
        }

        return this.store;
    }
}