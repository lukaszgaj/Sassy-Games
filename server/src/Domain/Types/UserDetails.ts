export interface UserDetails {
    id: string;
    login: string;
    password: string;
    isBanned: boolean;
    userRole: UserDetails.UserRole;
}

export namespace UserDetails {
    export type UserRole = 'Client' | 'Admin';
}
