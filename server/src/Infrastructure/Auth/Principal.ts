import {interfaces} from 'inversify-express-utils';
import {AuthPrincipal} from '../../App/Auth/AuthPrincipal';
import {UserDetails} from '../../Domain/Types/UserDetails';

export class Principal implements AuthPrincipal, interfaces.Principal {
    details: any;

    constructor(
        details?: UserDetails,
        private token?: string,
    ) {
        this.details = details;
    }

    getDetails(): UserDetails {
        if (!this.details || !this.token) {
            throw new Error('Make sure user is authenticated');
        }

        return this.details;
    }

    getTokenAsString(): string {
        if (!this.details || !this.token) {
            throw new Error('Make sure user is authenticated');
        }

        return this.token;
    }

    async isAuthenticated(): Promise<boolean> {
        return !!this.details;
    }

    async isInRole(role: 'Client' | 'Admin'): Promise<boolean> {
        if (!this.details) {
            return false;
        }

        return this.getDetails().userRole.indexOf(role) > -1;
    }

    async isResourceOwner(_: any): Promise<boolean> {
        return this.isAuthenticated();
    }
}
