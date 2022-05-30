import {Action} from '../Action';
import {CLEAR_TOKEN} from '../actionNames';
import {createAction} from '../createAction';

export type ClearTokenAction = Action<typeof CLEAR_TOKEN, null>;

export function clearToken(): ClearTokenAction {
    return createAction(CLEAR_TOKEN, null);
}