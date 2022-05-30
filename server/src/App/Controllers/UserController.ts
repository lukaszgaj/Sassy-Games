import { compareSync, hashSync } from 'bcrypt';
import { plainToClass } from 'class-transformer';
import express from 'express';
import { controller, httpDelete, httpGet, httpPost, principal, request, response } from 'inversify-express-utils';
import { User } from '../../Domain/Entities/User';
import { UsersRepository } from '../../Domain/Repositories/UsersRepository';
import { Principal } from '../../Infrastructure/Auth/Principal';
import { LoggerService } from '../../Infrastructure/Services/LoggerService';
import { DeleteRequest } from '../ApiModels/Requests/DeleteRequest';
import { LoginUserRequest } from '../ApiModels/Requests/User/LoginUserRequest';
import { RegisterClientRequest } from '../ApiModels/Requests/User/RegisterClientRequest';
import { generateToken } from '../Utils/generateToken';
import { handleAuthenticationCheck } from '../Utils/handleAuthenticationCheck';

const path = '/user';

@controller(path)
export class UserController {
    constructor(
        private usersRepository: UsersRepository,
        private loggerService: LoggerService,
    ) {
    }

    @httpPost('/authenticate')
    async authenticate(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const normalizedBody = plainToClass(LoginUserRequest, req.body);
        if (!normalizedBody.login || !normalizedBody.password) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'authenticate -> wrong data provided',
            });
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            return;
        }
        const user = await this.usersRepository.getUserByLogin(normalizedBody.login);
        if (!user) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'authenticate -> user does not exist',
                payload: {
                    login: normalizedBody.login,
                },
            });
            res.status(400).json({ message: 'USER_DOES_NOT_EXIST' });
            return;
        }
        if (!compareSync(normalizedBody.password, user.password)) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'authenticate -> wrong password',
                payload: {
                    login: normalizedBody.login,
                },
            });
            res.status(400).json({ message: 'BAD_PASSWORD' });
            return;
        }

        if (user.isBanned) {
            res.status(403).json({ message: 'FORBIDDEN' });
            this.loggerService.log({
                filename: __filename,
                level: 'info',
                message: 'authenticate -> banned user tried to log in',
                payload: {
                    login: normalizedBody.login,
                },
            });
            return;
        }

        try {
            const token = generateToken(user);
            res.status(200).json({ token });
            return;
        } catch (e) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'authenticate -> failed to generate token',
                payload: {
                    normalizedBody,
                },
            });
            res.status(400).json({ message: 'SOMETHING_WENT_WRONG' });
        }
    }

    @httpPost('/register')
    async register(
        @request() req: express.Request,
        @response() res: express.Response,
    ) {
        const normalizedBody = plainToClass(RegisterClientRequest, req.body);
        if (
            !normalizedBody.login || !normalizedBody.password
        ) {
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'register -> invalid data provided',
                payload: normalizedBody,
            });
            return;
        }
        if (await this.usersRepository.getUserByLogin(normalizedBody.login)) {
            this.loggerService.log({
                filename: __filename,
                level: 'info',
                message: 'register -> user with this login already exists',
                payload: {
                    login: normalizedBody.login,
                },
            });
            res.status(409).json({ message: 'USER_WITH_THIS_LOGIN_ALREADY_EXISTS' });
            return;
        }
        await this.usersRepository.store(User.create({
            login: normalizedBody.login,
            password: hashSync(normalizedBody.password, 10),
            userRole: 'Client',
            isBanned: false,
        }));
        res.status(200).json({ message: 'STORED_SUCCESSFULLY' });
    }

    @httpGet('/get-all')
    async getAllUsers(
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ parentFilename: __filename, res, authPrincipal, loggerService: this.loggerService });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }
        const users = await this.usersRepository.getAll();
        res.status(200).json({
            users: users?.map(user => {
                return {
                    login: user.login,
                    id: user.id,
                    isBanned: user.isBanned,
                    userRole: user.userRole,
                }
            })
        });
    }

    @httpDelete('/delete')
    async delete(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }

        if (!authPrincipal.isInRole('Admin')) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'delete -> user with no previliges tried to use delete endpoint',
                payload: authPrincipal.getDetails(),
            });
            res.status(403).json({ message: 'FORBIDDEN' });
            return;
        }
        
        const normalizedBody = plainToClass(DeleteRequest, req.body);
        if (!normalizedBody.id) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'delete -> invalid data',
                payload: normalizedBody,
            });
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            return;
        }

        if (!await this.usersRepository.getUserById(normalizedBody.id)) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'delete -> user does not exist in database',
                payload: normalizedBody,
            });
            res.status(200).json({ message: 'USER_DOES_NOT_EXIST_IN_DATABASE' });
            return;
        }
        await this.usersRepository.delete(normalizedBody.id);
        res.status(200).json({ message: 'REMOVED_SUCCESSFULLY' });
    }

    @httpPost('/ban')
    async ban(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }

        if (!authPrincipal.isInRole('Admin')) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'ban -> user with no previliges tried to use ban endpoint',
                payload: authPrincipal.getDetails(),
            });
            res.status(403).json({ message: 'FORBIDDEN' });
            return;
        }
        
        const normalizedBody = plainToClass(DeleteRequest, req.body);
        if (!normalizedBody.id) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'ban -> invalid data',
                payload: normalizedBody,
            });
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            return;
        }

        if (!await this.usersRepository.getUserById(normalizedBody.id)) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'ban -> user does not exist in database',
                payload: normalizedBody,
            });
            res.status(200).json({ message: 'USER_DOES_NOT_EXIST_IN_DATABASE' });
            return;
        }
        await this.usersRepository.ban(normalizedBody.id);
        res.status(200).json({ message: 'BANNED_SUCCESSFULLY' });
    }

    @httpPost('/unban')
    async unban(
        @request() req: express.Request,
        @response() res: express.Response,
        @principal() authPrincipal: Principal,
    ) {
        const authenticaitonCheckResult = await handleAuthenticationCheck({ res, authPrincipal, loggerService: this.loggerService, parentFilename: __filename });
        if (authenticaitonCheckResult === 'fail') {
            return;
        }

        if (!authPrincipal.isInRole('Admin')) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'unban -> user with no previliges tried to use ban endpoint',
                payload: authPrincipal.getDetails(),
            });
            res.status(403).json({ message: 'FORBIDDEN' });
            return;
        }
        
        const normalizedBody = plainToClass(DeleteRequest, req.body);
        if (!normalizedBody.id) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'unban -> invalid data',
            });
            res.status(400).json({ message: 'PLEASE_PROVIDE_VALID_DATA' });
            return;
        }

        if (!await this.usersRepository.getUserById(normalizedBody.id)) {
            this.loggerService.log({
                filename: __filename,
                level: 'error',
                message: 'unban -> user does not exist in database',
            });
            res.status(200).json({ message: 'USER_DOES_NOT_EXIST_IN_DATABASE' });
            return;
        }
        await this.usersRepository.unban(normalizedBody.id);
        res.status(200).json({ message: 'UNBANNED_SUCCESSFULLY' });
    }
}
