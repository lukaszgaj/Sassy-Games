import {Action} from '../../Action';
import {CLOSE_INFO_MODAL} from '../../actionNames';
import {createAction} from '../../createAction';

export type CloseInfoModal = Action<typeof CLOSE_INFO_MODAL, null>;

export function closeInfoModal(): CloseInfoModal {
    return createAction(CLOSE_INFO_MODAL, null);
}