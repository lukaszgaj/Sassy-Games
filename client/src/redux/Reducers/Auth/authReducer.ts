import {CLEAR_TOKEN, STORE_TOKEN} from '../../Actions/actionNames';
import {ClearTokenAction} from '../../Actions/Auth/clearToken';
import {StoreTokenAction} from '../../Actions/Auth/storeToken';
import {AuthState} from './AuthState';

type Actions = ClearTokenAction | StoreTokenAction ;

export function authReducer(state: AuthState = initialState, action: Actions): AuthState {
    if (action.type === STORE_TOKEN) {
        return {...state, token: action.payload};
    } else if (action.type === CLEAR_TOKEN) {
        return {...state, token: undefined};
    }
    return state;
}

const initialState = {};