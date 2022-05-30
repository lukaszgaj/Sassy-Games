import {injectable} from 'inversify';
import {DataSource} from 'typeorm';
import {User} from '../../Domain/Entities/User';
import {UsersRepository} from '../../Domain/Repositories/UsersRepository';
import { UserDetails } from '../../Domain/Types/UserDetails';

@injectable()
export class MysqlBasedUsersRepository implements UsersRepository {
    constructor(
        private dataSource: DataSource,
    ) {
    }

    async getUserByLogin(login: UserDetails['login']): Promise<User | null> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(User, 'user')
            .where('login = :login', {login})
            .limit(1)
            .getOne()
            .then(result => result || null)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getUserById(id: UserDetails['id']): Promise<User | null> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(User, 'user')
            .where('id = :id', {id})
            .limit(1)
            .getOne()
            .then(result => result || null)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async ban(id: UserDetails['id']): Promise<void> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error(`Repository error: user with id: ${id} not found`);
        }

        if (!user.isBanned) {
            user.isBanned = true;
        }

        return this.dataSource
            .getRepository(User)
            .update(user.id, User.create(user))
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }    
    
    async unban(id: UserDetails['id']): Promise<void> {
        const user = await this.getUserById(id);
        if (!user) {
            throw new Error(`Repository error: user with id: ${id} not found`);
        }

        if (user.isBanned) {
            user.isBanned = false;
        }

        return this.dataSource
            .getRepository(User)
            .update(user.id, User.create(user))
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }

    async store(user: User): Promise<void> {
        return this.dataSource
            .getRepository(User)
            .save(user)
            .then(() => void 0)
            .catch(e => {
                if (e.code === 'ER_DUP_ENTRY') {
                    return void 0;
                }
                throw new Error(`Repository error: ${e}`);
            });
    }

    async getAll(): Promise<User[] | undefined> {
        return this.dataSource
            .getRepository(User)
            .createQueryBuilder('user')
            .getMany()
            .then(users => users)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }

    async delete(userId: string): Promise<void> {
        return this.dataSource.createEntityManager()
            .createQueryBuilder(User, 'user')
            .where('id = :userId', {userId})
            .limit(1)
            .delete()
            .execute()
            .then(() => void 0)
            .catch(e => {
                throw new Error(`Repository error: ${e}`);
            });
    }
}
