import {ModalFormField} from '../../../../UI/Common/Modals/AddNew/ModalFormField';
import {Action} from '../../Action';
import {OPEN_MODAL} from '../../actionNames';
import {createAction} from '../../createAction';

interface Payload {
    openedModal: 'Add' | 'Delete';
    fields?: ModalFormField[];
    handleFunction: (values?: string[]) => void;
    confirmationMessage?: string;
    heading: string;
}

export type OpenModalAction = Action<typeof OPEN_MODAL, Payload>;

export function openModal(payload: Payload): OpenModalAction {
    return createAction(OPEN_MODAL, payload);
}