import {injectable} from 'inversify';

@injectable()
export class LocalStorageService {
    loadToken(): string | undefined {
        try {
            return localStorage.getItem('token') || undefined;
        } catch (error) {
            return undefined;
        }
    }

    saveToken(token: string): void {
        localStorage.setItem('token', token);
    }

    removeToken(): void {
        try {
            localStorage.removeItem('token');
        } catch (error) {
            return;
        }
    }
}