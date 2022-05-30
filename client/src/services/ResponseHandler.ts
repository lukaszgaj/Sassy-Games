import {injectable} from 'inversify';
import {Response} from 'superagent';
import {openInfoModal} from '../redux/Actions/Modals/InfoModal/openInfoModal';
import {StoreProvider} from './Store/StoreProvider';

@injectable()
export class ResponseHandler {
    constructor(
        private storeProvider: StoreProvider,
    ) {
    }

    handle(response: Response | undefined): Response | void {
        const dispatch = this.storeProvider.getStore().dispatch;
        if (!response) {
            dispatch(openInfoModal({message: 'Server does not respond', heading: 'Error'}));
        }

        if (response?.status === 200) {
            return response;
        }

        if (response?.status === 403) {
            dispatch(openInfoModal({message: 'Not authorized', heading: 'Error'}));
            return;
        }

        if (response?.status === 400) {
            dispatch(openInfoModal({message: 'Please provide valid data', heading: 'Error'}));
            return;
        }

        if (response?.status === 400) {
            dispatch(openInfoModal({message: 'Destination not found', heading: 'Error'}));
            return;
        }

        if (response?.status === 500) {
            dispatch(openInfoModal({message: 'Database error occurred', heading: 'Error'}));
            return;
        }

        if (response?.status === 409 && response.body.message === 'USER_WITH_THIS_EMAIL_DOES_NOT_EXIST') {
            dispatch(openInfoModal({message: 'User with this email does not exist', heading: 'Error'}));
            return;
        }

        if (response?.status === 409) {
            dispatch(openInfoModal({message: 'User with this email already exists', heading: 'Error'}));
            return;
        }
        return response;
    }
}