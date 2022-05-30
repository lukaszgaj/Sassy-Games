import {Action} from '../../Action';
import {CLOSE_MODAL} from '../../actionNames';
import {createAction} from '../../createAction';

export type CloseModalAction = Action<typeof CLOSE_MODAL, null>;

export function closeModal(): CloseModalAction {
    return createAction(CLOSE_MODAL, null);
}