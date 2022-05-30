import React from 'react';
import {AddNewModal} from './AddNew/AddNewModal';
import {DeleteModal} from './DeleteModal/DeleteModal';
import {InfoModal} from './InfoModal/InfoModal';

export function Modals() {
    return (
        <>
            <AddNewModal/>
            <DeleteModal/>
            <InfoModal/>
        </>
    );
}