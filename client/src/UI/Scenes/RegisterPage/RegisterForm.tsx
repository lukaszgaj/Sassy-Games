import { FormEvent, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useService } from '../../../customHooks/useService';
import { openInfoModal } from '../../../redux/Actions/Modals/InfoModal/openInfoModal';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { ResponseHandler } from '../../../services/ResponseHandler';

export function RegisterForm() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const confirmPasswordRef = useRef<HTMLInputElement>(null);
    const dispatch = useDispatch();
    const history = useHistory();

    const authenticationService = useService(AuthenticationService);
    const responseHandler = useService(ResponseHandler);

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (
            !loginRef.current
            || !passwordRef.current
            || !confirmPasswordRef.current
        ) {
            dispatch(openInfoModal({ message: 'Some fields are missing.', heading: 'Error' }));
            return;
        }

        if (confirmPasswordRef.current.value !== passwordRef.current.value) {
            passwordRef.current.setCustomValidity('Passwords do not match');
            return;
        }
        authenticationService.sendRegisterRequest({
            login: loginRef.current.value,
            password: passwordRef.current.value,
        }).then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse) {
                dispatch(openInfoModal({ message: 'Login in now!', heading: 'Registration complete.' }));
                history.push('login');
            }
        });
    };

    return (
        <Form className='w-75 flex justify-content-center' onSubmit={handleSubmit}>
            <Form.Row className="justify-content-center" style={{ display: 'flex' }}>
                <Form.Group className='col-md-6'>
                    <Form.Label htmlFor='input-login'>Login</Form.Label>
                    <Form.Control ref={loginRef} type='login' id='input-login' placeholder='Login' required />
                </Form.Group>
            </Form.Row>
            <Form.Row className="justify-content-center" style={{ display: 'flex' }}>
                <Form.Group className='col-md-6'>
                    <Form.Label htmlFor='password'>Password</Form.Label>
                    <Form.Control ref={passwordRef} type='password' id='password' placeholder='Password' required />
                </Form.Group>
            </Form.Row>
            <Form.Row className="justify-content-center" style={{ display: 'flex' }}>
                <Form.Group className='col-md-6'>
                    <Form.Label htmlFor='confirm-password'>Confirm password</Form.Label>
                    <Form.Control ref={confirmPasswordRef} type='password' id='confirm-password'
                        placeholder='Confirm password' required />
                </Form.Group>
            </Form.Row>
            <Form.Row className="justify-content-center" style={{ display: 'flex' }}>
                <Button type='submit' className='btn btn-primary'>Register now!</Button>
            </Form.Row>
        </Form>
    );
}