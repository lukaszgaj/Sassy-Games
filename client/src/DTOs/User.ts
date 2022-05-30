export interface User {
    id: string;
    login: string;
    password: string;
    isBanned: boolean;
    userRole: User.UserRole;
}

export namespace User {
    export type UserRole = 'Client' | 'Admin';
}
