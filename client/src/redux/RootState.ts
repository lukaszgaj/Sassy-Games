import {AuthState} from './Reducers/Auth/AuthState';
import {InfoState} from './Reducers/Info/InfoState';
import {ModalState} from './Reducers/Modals/ModalState';

export interface RootState {
    authState: AuthState;
    modalState: ModalState;
    infoState: InfoState;
}