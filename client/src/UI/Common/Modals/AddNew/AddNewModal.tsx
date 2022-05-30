import React, {useEffect, useState} from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {closeModal} from '../../../../redux/Actions/Modals/Common/closeModal';
import {ModalState} from '../../../../redux/Reducers/Modals/ModalState';
import {RootState} from '../../../../redux/RootState';
import {AddNewForm} from './AddNewForm';

export function AddNewModal() {
    const dispatch = useDispatch();
    const modalState = useSelector<RootState, ModalState>(state => state.modalState);
    const onSubmit = modalState.handleFunction ? modalState.handleFunction : () => void 0;

    const [values, setValues] = useState<string[]>([]);

    useEffect(() => {
        setValues(modalState.fields?.map(field => field.initialValue || '') || []);
    },  [modalState.fields]);

    return (
        <>
            <Modal show={modalState.openedModal === 'Add'} onHide={() => dispatch(closeModal())} animation={true}>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'black'}}>{modalState.heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddNewForm fields={modalState.fields} values={values} setValues={setValues}/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => dispatch(closeModal())}>
                        Close
                    </Button>
                    <Button variant='primary' onClick={() => onSubmit(values)}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
