export interface ModalFormField {
    label: string;
    type: 'number' | 'text' | 'url' | 'email' | 'password';
    initialValue?: string;
}
