import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { closeInfoModal } from '../../../../redux/Actions/Modals/InfoModal/closeInfoModal';
import { InfoState } from '../../../../redux/Reducers/Info/InfoState';
import { RootState } from '../../../../redux/RootState';

export function InfoModal() {
    const infoState = useSelector<RootState, InfoState>(state => state.infoState);
    const dispatch = useDispatch();
    return (
        <>
            <Modal
                style={{ color: 'black', maxWidth: '1500px' }}
                show={infoState.isModalVisible}
                onHide={() => dispatch(closeInfoModal())}
                animation={true}
                size='lg'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{infoState.heading || 'Info Occurred'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {infoState.message}
                    {infoState.children}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant='secondary' onClick={() => dispatch(closeInfoModal())}>
                        Ok
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
