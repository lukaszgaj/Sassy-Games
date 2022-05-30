import {Action} from '../Action';
import {STORE_TOKEN} from '../actionNames';
import {createAction} from '../createAction';

export type StoreTokenAction = Action<typeof STORE_TOKEN, string>;

export function storeToken(token: string): StoreTokenAction {
    return createAction(STORE_TOKEN, token);
}