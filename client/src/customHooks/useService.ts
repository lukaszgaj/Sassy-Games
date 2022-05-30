import {interfaces} from 'inversify';
import {useContext} from 'react';
import {ContainerContext} from '../context/ContainerContext';

export function useService<T>(id: interfaces.ServiceIdentifier<T>): T {
    const container = useContext(ContainerContext);
    if (!container) {
        throw new Error('ContainerContext should be set by now.');
    }
    return container.get<T>(id);
}