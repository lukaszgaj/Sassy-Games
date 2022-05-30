import {CLOSE_MODAL, OPEN_MODAL} from '../../Actions/actionNames';
import {CloseModalAction} from '../../Actions/Modals/Common/closeModal';
import {OpenModalAction} from '../../Actions/Modals/Common/openModal';
import {ModalState} from './ModalState';

type Actions = OpenModalAction | CloseModalAction ;

export function modalReducer(state: ModalState = initialState, action: Actions): ModalState {
    if (action.type === CLOSE_MODAL) {
        return {
            ...state,
            confirmationMessage: undefined,
            fields: undefined,
            handleFunction: undefined,
            heading: undefined,
            openedModal: undefined,
        };
    } else if (action.type === OPEN_MODAL) {
        return {
            ...state,
            confirmationMessage: action.payload.confirmationMessage,
            fields: action.payload.fields,
            handleFunction: action.payload.handleFunction,
            heading: action.payload.heading,
            openedModal: action.payload.openedModal,
        };
    }
    return state;
}

const initialState = {};