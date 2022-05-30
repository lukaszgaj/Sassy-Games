import React from 'react';
import {useSelector} from 'react-redux';
import {Redirect, Route} from 'react-router-dom';
import { User } from '../DTOs/User';
import {RootState} from '../redux/RootState';
import {decodeToken} from '../util/token/decodeToken';

export const PrivateRoute: React.FC<{
    component: React.FC;
    path: string;
    role: User.UserRole;
}> = (props) => {
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);
    const decodedToken = token && decodeToken(token);
    return decodedToken && decodedToken.userRole === props.role ?
        <Route path={props.path} component={props.component} />
        : <Redirect to='login'/>;
};