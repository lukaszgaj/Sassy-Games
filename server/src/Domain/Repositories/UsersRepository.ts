import {User} from '../Entities/User';

export abstract class UsersRepository {
    abstract getUserByLogin(name: string): Promise<User | null>;
    abstract getUserById(id: string): Promise<User | null>;
    abstract store(user: User): Promise<void>;
    abstract getAll(): Promise<User[] | undefined>;
    abstract delete(userId: string): Promise<void>;
    abstract ban(userId: string): Promise<void>;
    abstract unban(userId: string): Promise<void>;
}
