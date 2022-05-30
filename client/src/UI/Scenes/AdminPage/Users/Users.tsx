import { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useService } from '../../../../customHooks/useService';
import { User } from '../../../../DTOs/User';
import { closeModal } from '../../../../redux/Actions/Modals/Common/closeModal';
import { openModal } from '../../../../redux/Actions/Modals/Common/openModal';
import { openInfoModal } from '../../../../redux/Actions/Modals/InfoModal/openInfoModal';
import { RootState } from '../../../../redux/RootState';
import { AuthenticationService } from '../../../../services/AuthenticationService';
import { UserService } from '../../../../services/Entities/UserService';
import { ResponseHandler } from '../../../../services/ResponseHandler';
import { ModalFormField } from '../../../Common/Modals/AddNew/ModalFormField';

export function Users() {
    const dispatch = useDispatch();
    const userService = useService(UserService);
    const authService = useService(AuthenticationService);
    const responseHandler = useService(ResponseHandler);

    const openedModal = useSelector<RootState>(state => state.modalState.openedModal);
    const [users, setUsers] = useState<User[] | undefined>(undefined);

    useEffect(() => {
        userService.sendGetAllUsersRequest().then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse && handledResponse.body.users) {
                setUsers(handledResponse.body.users);
            }
        });
    }, [openedModal, userService, responseHandler]);

    const addNewUserFormFields: ModalFormField[] = [
        { label: 'Login', type: 'text' },
        { label: 'Password', type: 'password' },
    ];

    function handleAddNewUser(values: string[]) {
        if (values.filter(val => val === '').length > 0) {
            dispatch(openInfoModal({ message: 'Some fields are missing.', heading: 'Error' }));
            return;
        }

        authService.sendRegisterRequest({
            login: values[0],
            password: values[1],
        }).then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse) {
                dispatch(closeModal());
            }
        });
    }

    function handleDeleteUser(user: User) {
        if (user.userRole === 'Admin') {
            alert('You cannot delete users with role admin');
            return;
        }

        userService
            .sendRemoveUserRequest(user.id)
            .then(res => {
                const handledResponse = responseHandler.handle(res);
                if (handledResponse) {
                    dispatch(closeModal());
                }
            });
    }

    return (
        <Table striped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Login</th>
                    <th>Role</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {
                    users?.map(user => {
                        return (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.login}</td>
                                <td>{user.userRole}</td>
                                <td>
                                    <Button
                                        onClick={() => {
                                            dispatch(openModal({
                                                confirmationMessage: `Are you sure you want to delete user ${user.id} - ${user.login}`,
                                                handleFunction: () => handleDeleteUser(user),
                                                heading: 'Delete User',
                                                openedModal: 'Delete',
                                            }));
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </td>
                                <td>
                                    <Button
                                        onClick={() => {
                                            dispatch(openModal({
                                                confirmationMessage: `Are you sure you want to ${user.isBanned ? 'Unban' : 'Ban'} user ${user.id} - ${user.login}`,
                                                handleFunction: () => {
                                                    if (user.isBanned) {
                                                        userService
                                                            .sendUnbanUserRequest(user.id)
                                                            .then(res => {
                                                                const handledResponse = responseHandler.handle(res);
                                                                if (handledResponse) {
                                                                    dispatch(closeModal());
                                                                }
                                                            });
                                                    } else {
                                                        userService
                                                            .sendBanUserRequest(user.id)
                                                            .then(res => {
                                                                const handledResponse = responseHandler.handle(res);
                                                                if (handledResponse) {
                                                                    dispatch(closeModal());
                                                                }
                                                            });
                                                    }
                                                },
                                                heading: `${user.isBanned ? 'Unban' : 'Ban'} User`,
                                                openedModal: 'Delete',
                                            }));
                                        }}
                                    >
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                }
                <tr>
                    <td>
                        <Button
                            onClick={() => {
                                dispatch(openModal({
                                    fields: addNewUserFormFields,
                                    handleFunction: values => handleAddNewUser(values || []),
                                    heading: 'Add new user',
                                    openedModal: 'Add'
                                }));
                            }}
                        >
                            Add new client
                        </Button>
                    </td>
                </tr>
            </tbody>
        </Table>
    );
}