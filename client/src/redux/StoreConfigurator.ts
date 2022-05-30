import {createStore, Store} from 'redux';

import {injectable} from 'inversify';
import {LocalStorageService} from '../services/LocalStorageService';
import {rootReducer} from './reducers';
import {RootState} from './RootState';

@injectable()
export class StoreConfigurator {
    constructor(
        protected localStorageService: LocalStorageService,
    ) {
    }

    getConfiguredStore(): Store<RootState> {
        const token = this.localStorageService.loadToken();
        const store: Store<RootState> = createStore(rootReducer, {authState: {token}});
        store.subscribe(() => {
            const tokenFromStore = store.getState().authState.token;
            if (tokenFromStore) {
                this.localStorageService.saveToken(tokenFromStore);
            } else {
                this.localStorageService.removeToken();
            }
        });
        return store;
    }
}
