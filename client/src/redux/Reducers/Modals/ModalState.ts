import {ModalFormField} from '../../../UI/Common/Modals/AddNew/ModalFormField';

export interface ModalState {
    openedModal?: 'Add' | 'Delete';
    fields?: ModalFormField[];
    handleFunction?: (values?: string[]) => void;
    confirmationMessage?: string;
    heading?: string;
}