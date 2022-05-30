import {Column, Entity} from 'typeorm';
import {PrimaryColumn} from 'typeorm';
import {v4 as uuidv4} from 'uuid';
import {UserDetails} from '../Types/UserDetails';

@Entity({name: 'user'})
export class User {
    static create(data: Omit<UserDetails, 'id'>): User {
        return new User(data);
    }

    // uuid
    @PrimaryColumn({type: 'char', length: 36})
    readonly id: string;

    @Column({type: 'longtext'})
    readonly login: string;

    @Column({type: 'longtext'})
    password: string;

    @Column({type: 'boolean'})
    isBanned: boolean;

    @Column({type: 'longtext'})
    readonly userRole: UserDetails.UserRole;

    private constructor(data?: Omit<UserDetails, 'id'>) {
        if (!data) {
            return;
        }

        this.id = uuidv4();
        this.login = data.login;
        this.password = data.password;
        this.userRole = data.userRole;
        this.isBanned = data.isBanned;
    }
}
