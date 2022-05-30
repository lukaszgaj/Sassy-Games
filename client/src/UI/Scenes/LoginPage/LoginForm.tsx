import React, { FormEvent, useRef } from 'react';
import { Button, Form, FormGroup, InputGroup } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useService } from '../../../customHooks/useService';
import { storeToken } from '../../../redux/Actions/Auth/storeToken';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { ResponseHandler } from '../../../services/ResponseHandler';
import { decodeToken } from '../../../util/token/decodeToken';

export function LoginForm() {
    const loginRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const history = useHistory();

    const responseHandler = useService(ResponseHandler);
    const authenticationService = useService(AuthenticationService);
    const dispatch = useDispatch();

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        if (!loginRef.current || !passwordRef.current) {
            return;
        }
        authenticationService.sendLoginRequest({
            login: loginRef.current.value,
            password: passwordRef.current.value,
        }).then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse && handledResponse.body.token) {
                dispatch(storeToken(res.body.token));
                const decodedToken = decodeToken(handledResponse.body.token);
                history.push(decodedToken.userRole === 'Admin' ? '/admin' : '/client');
            }
        });
    };

    return (
        <Form
            onSubmit={handleSubmit}
        >
            <FormGroup>
                <InputGroup>
                    <div className='input-group-prepend'>
                        <span className='input-group-text'> <i className='fa fa-user'/> </span>
                    </div>
                    <Form.Label htmlFor='login'/>
                    <Form.Control
                        ref={loginRef}
                        type='login'
                        className='form-control'
                        id='login'
                        placeholder='Login'
                        required
                    />
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <InputGroup>
                    <div className='input-group-prepend'>
                        <span className='input-group-text'> <i className='fa fa-lock'/> </span>
                    </div>
                    <Form.Label htmlFor='password'/>
                    <Form.Control ref={passwordRef} type='password' id='password' placeholder='Password' required/>
                </InputGroup>
            </FormGroup>
            <FormGroup>
                <Button type='submit' className='btn btn-primary btn-block'>Login</Button>
            </FormGroup>
            <p className='text-center text-light'>
                <a href='register' className='btn-dark'>Register now</a>
            </p>
        </Form>
    );
}