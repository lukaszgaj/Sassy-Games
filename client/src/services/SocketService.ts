import { injectable } from "inversify";
import io, { Socket } from 'socket.io-client';
import { BASIC_URL } from "../config/config";
import { StoreProvider } from "./Store/StoreProvider";

@injectable()
export class SocketService {
    private socket: Socket;

    constructor(
        private storeProvider: StoreProvider,
    ) {
        const token = this.storeProvider.getState().authState.token;
        if (!token) {
            throw new Error('Token should be defined when calling getAllUsers request');
        }
        this.socket = io(BASIC_URL, { auth: { token } });

        this.socket.on("connect_error", (err) => {
            console.log('ERROR:', err.message); // not authorized
        });
    }



    getSocket(): Socket {
        return this.socket;
    }
}