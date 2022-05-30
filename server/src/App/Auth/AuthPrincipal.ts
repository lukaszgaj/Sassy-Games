import {UserDetails} from '../../Domain/Types/UserDetails';

export interface AuthPrincipal {
    getDetails(): UserDetails;
    getTokenAsString(): string;
    isAuthenticated(): Promise<boolean>;
}
