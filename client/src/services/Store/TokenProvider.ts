import {injectable} from 'inversify';
import {StoreProvider} from './StoreProvider';

@injectable()
export class TokenProvider {
    constructor(
        private storeProvider: StoreProvider,
    ) {}

    get(): string {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling sendAddNewCar request');
        }
        return token;
    }
}