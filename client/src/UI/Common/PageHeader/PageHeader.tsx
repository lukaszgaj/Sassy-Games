import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { User } from '../../../DTOs/User';
import { UserToken } from '../../../DTOs/UserToken';
import { clearToken } from '../../../redux/Actions/Auth/clearToken';
import { RootState } from '../../../redux/RootState';
import { decodeToken } from '../../../util/token/decodeToken';

export function PageHeader() {
    const history = useHistory();
    const dispatch = useDispatch();
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);
    const decodedToken = token && decodeToken(token);

    const menuItems: {
        label: string,
        href?: string,
        hiddenWhenLogged?: boolean,
        visibleWithRoles?: User.UserRole[],
        onClick?: () => void,
    }[] = [
        {label: 'Home', href: '/home'},
        {label: 'Sign in', href: '/login', hiddenWhenLogged: true},
        {label: 'Register now', href: '/register', hiddenWhenLogged: true},
        {label: 'Admin Panel', href: '/admin', visibleWithRoles: ['Admin']},
        {label: `Profile (${(decodedToken as UserToken)?.login})`, href: '/profile', visibleWithRoles: ['Client']},
        {
            label: `Logout`,
            onClick: () => {
                dispatch(clearToken());
                history.push('/login');
            },
            visibleWithRoles: ['Admin', 'Client'],
        },
    ];

    return (
        <Navbar collapseOnSelect expand='lg' bg='black' variant='dark' className='border-bottom'>
            <Navbar.Toggle aria-controls='responsive-navbar-nav'/>
            <Navbar.Collapse id='responsive-navbar-nav'>
                <Nav className='mr-auto'>
                </Nav>
                <Nav>
                    {
                        menuItems.map((item, index) => {
                            if (
                                (decodedToken && item.hiddenWhenLogged)
                                || (!decodedToken && item.visibleWithRoles)
                                || (
                                    decodedToken
                                    && item.visibleWithRoles
                                    && !item.visibleWithRoles.includes(decodedToken.userRole)
                                )
                            ) {
                                return '';
                            }
                            const isActive = history.location.pathname === item.href;
                            const className = ['nav-item', isActive ? 'active' : ''].join(' ');
                            return (
                                <li key={index} className={className}>
                                    {
                                        item.onClick ?
                                            <div
                                                style={{cursor: 'pointer'}}
                                                className='nav-link'
                                                onClick={item.onClick}
                                            >
                                                {item.label}
                                            </div>
                                            : <Nav.Link href={item.href}>{item.label}</Nav.Link>
                                    }

                                </li>
                            );
                        })
                    }
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}