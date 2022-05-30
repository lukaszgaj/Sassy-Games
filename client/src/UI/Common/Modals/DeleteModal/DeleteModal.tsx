import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {closeModal} from '../../../../redux/Actions/Modals/Common/closeModal';
import {ModalState} from '../../../../redux/Reducers/Modals/ModalState';
import {RootState} from '../../../../redux/RootState';

export function DeleteModal() {
    const modalState = useSelector<RootState, ModalState>(state => state.modalState);
    const onConfirm = modalState.handleFunction ? modalState.handleFunction : () => void 0;
    const dispatch = useDispatch();
    return (
        <>
            <Modal
                style={{color: 'black'}}
                show={modalState.openedModal === 'Delete'}
                onHide={() => dispatch(closeModal())}
                animation={true}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalState.heading}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <span>
                        {modalState.confirmationMessage}
                    </span>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => dispatch(closeModal())}>
                        Cancel
                    </Button>
                    <Button variant='primary' onClick={() => onConfirm()}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
