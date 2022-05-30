import {CLOSE_INFO_MODAL, OPEN_INFO_MODAL} from '../../Actions/actionNames';
import {CloseInfoModal} from '../../Actions/Modals/InfoModal/closeInfoModal';
import {OpenInfoModal} from '../../Actions/Modals/InfoModal/openInfoModal';
import {InfoState} from './InfoState';

type Actions = OpenInfoModal | CloseInfoModal ;

export function infoReducer(state: InfoState = initialState, action: Actions): InfoState {
    if (action.type === CLOSE_INFO_MODAL) {
        return {
            ...state,
            heading: '',
            isModalVisible: false,
            message: undefined,
        };
    } else if (action.type === OPEN_INFO_MODAL) {
        return {
            ...state,
            heading: action.payload.heading,
            isModalVisible: true,
            message: action.payload.message,
            children: action.payload.children,
        };
    }
    return state;
}

const initialState: InfoState = {
    heading: '',
    isModalVisible: false,
};