import { ReactNode } from 'react';
import { Action } from '../../Action';
import { OPEN_INFO_MODAL } from '../../actionNames';
import { createAction } from '../../createAction';

interface Payload {
    message?: string;
    heading: string;
    children?: ReactNode;
}

export type OpenInfoModal = Action<typeof OPEN_INFO_MODAL, Payload>;

export function openInfoModal(payload: Payload): OpenInfoModal {
    return createAction(OPEN_INFO_MODAL, payload);
}