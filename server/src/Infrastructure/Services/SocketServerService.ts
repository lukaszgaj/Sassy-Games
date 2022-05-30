import { Server as HttpServer } from "http";
import { injectable } from "inversify";
import { verify } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { v4 as uuidv4 } from 'uuid';
import { GamesRepository } from "../../Domain/Repositories/GamesRepository";
import { UserDetails } from "../../Domain/Types/UserDetails";
import { Game } from '../../Domain/Entities/Game';
import { GameType } from "../../Domain/Enums/GameType";
import { calculateWinner } from "../../App/Utils/calculateWinner";
import { GameEventsRepository } from "../../Domain/Repositories/GameEventsRepository";
import { GameEvent } from "../../Domain/Entities/GameEvent";
import { LoggerService } from "./LoggerService";

@injectable()
export class SocketServerService {
    private server: Server | undefined;
    private ticTacToeLobby = new Map<string, { activePlayers: Socket[], gameStarted: boolean, playersWhoCanRejoin: string[] }>([]);
    private ticTacToeIdLobbyId = uuidv4();
    private userList = new Map<string, string>([]);

    constructor(
        private gamesRepository: GamesRepository,
        private gameEventsRepository: GameEventsRepository,
        private loggerService: LoggerService,
    ) { }

    initializerServer(httpServer: HttpServer) {
        const io = new Server(httpServer, {
            cors: {
                origin: "http://localhost:3000",
                methods: ["GET", "POST"],
                allowedHeaders: ["my-custom-header"],
                credentials: true
            }
        });

        io.use((socket, next) => {
            if (!process.env.JWT_KEY) {
                throw new Error('Missing JWT_KEY');
            }
            const tokenString = socket.handshake.auth.token;

            try {
                const decoded = verify(tokenString, process.env.JWT_KEY) as UserDetails;
                this.userList.forEach(login => {
                    if (login === decoded.login) {
                        this.loggerService.log({
                            filename: __filename,
                            level: 'error',
                            message: 'one socket session allowed only',
                            payload: decoded,
                        });
                        next(new Error('ONE SESSION ALLOWED ONLY'));
                    }
                })
                this.userList.set(socket.id, decoded.login);
            } catch (e) {
                this.loggerService.log({
                    filename: __filename,
                    level: 'error',
                    message: 'invalid token',
                    payload: {
                        token: tokenString,
                    },
                });
                next(new Error('INVALID TOKEN'));
            }

            next();
        });

        io.on('connection', (socket) => {

            socket.on('request_room_creation', () => this.handleRoomCreation());

            socket.on('disconnect', () => {
                socket.leave(this.ticTacToeIdLobbyId);
                this.ticTacToeLobby.forEach(({ activePlayers: players }) => {
                    if (players.filter(player => player.id === socket.id).length === 1) {
                        players.splice(players.findIndex(player => player.id === socket.id), 1);
                    }
                })
                this.userList.delete(socket.id);
            })

            socket.on('join_tic_tac_toe_lobby', () => {
                socket.join(this.ticTacToeIdLobbyId);
                this.emitGames();
            })

            socket.on('join_room', id => {
                this.joinRoom(id, socket);
                this.emitGames();
            })

            socket.on('leave_room', id => {
                this.leaveRoom(id, socket);
                this.emitGames();
            })

            socket.on('start_game', async id => {
                await this.startGame(id);
                this.emitGames();
            })

            socket.on('move_commited', async info => {
                await this.handleMove(info, socket);
            })

            socket.on('spectate', id => {
                this.handleSpectate(id, socket);
            })
        });

        this.server = io;
    }

    getServer(): Server {
        if (!this.server) {
            throw new Error('Server should be set by now');
        }

        return this.server;
    }

    getActiveGamesCount(): number {
        let count = 0;
        this.ticTacToeLobby.forEach(({ gameStarted }) => {
            if (gameStarted) {
                count++;
            }

        })
        return count;
    }

    private handleRoomCreation() {
        const newRoomId = uuidv4();
        this.ticTacToeLobby.set(newRoomId, { gameStarted: false, activePlayers: [], playersWhoCanRejoin: [] });
        this.emitGames();
    }

    private joinRoom(roomId: string, socket: Socket, spectatorMode?: boolean) {
        if (!this.ticTacToeLobby.has(roomId)) {
            console.warn(`Room with id: ${roomId} does not exist`);
            return;
        }

        const room = this.ticTacToeLobby.get(roomId)!;
        const playersInRoom = room.activePlayers;

        if (!spectatorMode && playersInRoom.length === 2) {
            console.warn(`Room with id: ${socket.id} has 2 players already`);
            return;
        }

        if (playersInRoom.filter(player => player.id === socket.id).length === 1) {
            console.warn('Player cannot join the same room twice');
            return;
        }

        let shouldReturn = false;
        this.ticTacToeLobby.forEach(({ activePlayers: players }) => {
            if (players.filter(player => player.id === socket.id).length === 1) {
                console.warn('Player can join one room at a time.');
                shouldReturn = true;
                return;
            }
        })

        if (shouldReturn) {
            return;
        }

        playersInRoom.push(socket);
        if (room.playersWhoCanRejoin.filter(player => player === this.userList.get(socket.id)!).length === 0) {
            room.playersWhoCanRejoin.push(this.userList.get(socket.id)!);
        }
        socket.join(roomId);
        socket.emit('room_joined', roomId);
    }

    private emitGames(): void {
        this.getServer().to(this.ticTacToeIdLobbyId).emit('get_games', Array.from(this.ticTacToeLobby, ([id, { activePlayers, gameStarted, playersWhoCanRejoin }]) => ({ id, players: activePlayers.map(player => player.id), gameStarted, playersWhoCanRejoin })))
    }

    private leaveRoom(roomId: string, socket: Socket): void {
        if (!this.ticTacToeLobby.has(roomId)) {
            console.warn(`Room with id: ${roomId} does not exist`);
            return;
        }

        const playersInRoom = this.ticTacToeLobby.get(roomId)!.activePlayers;
        playersInRoom.splice(playersInRoom.findIndex(player => player.id === socket.id), 1);
        socket.leave(roomId);
        socket.emit('room_left');
    }

    private async startGame(roomId: string): Promise<void> {
        if (!this.ticTacToeLobby.has(roomId)) {
            console.warn(`Room with id: ${roomId} does not exist`);
            return;
        }

        const room = this.ticTacToeLobby.get(roomId)!;

        if (room.activePlayers.length < 2) {
            console.warn(`2 players are needed to start a game.`);
            return;
        }

        room.activePlayers.forEach(player => {
            player.emit('game_started');
            player.emit('update_game_state', { players: room.activePlayers.map(player => player.id), nextMove: room.activePlayers[0].id });
        })

        if (!room.gameStarted) {
            room.gameStarted = true;
            const newGame = Game.create({
                gameType: GameType.TicTacToe,
                isCancelled: false,
                winnerId: null,
                loserId: null,
                roomId,
            });
            await this.gamesRepository.store(newGame);
        }

        this.emitGames();
    }

    private async handleMove({ currentBoardState, step, roomId }: { currentBoardState: SquareState[], step: number, roomId: string }, socket: Socket): Promise<void> {
        if (!this.ticTacToeLobby.has(roomId)) {
            console.warn(`Room with id: ${roomId} does not exist`);
            return;
        }

        const playersInRoom = this.ticTacToeLobby.get(roomId)!.activePlayers;
        const winner = calculateWinner(currentBoardState);
        const game = await this.gamesRepository.getGameByRoomId(roomId);

        if (!game) {
            console.warn(`Game not found.`);
            return;
        }

        if (winner !== null) {
            await this.gamesRepository.update(game.id, {
                winnerId: this.userList.get(socket.id)!,
                loserId: socket.id === playersInRoom[0].id ? this.userList.get(playersInRoom[1].id)! : this.userList.get(playersInRoom[0].id)!,
            });
            this.ticTacToeLobby.delete(roomId);
        }

        const payload = {
            currentBoardState,
            step,
            nextMove: socket.id === playersInRoom[0].id ? playersInRoom[1].id : playersInRoom[0].id,
            winnerId: winner ? this.userList.get(socket.id) : null,
        };
        playersInRoom.forEach(player => {
            player.emit('update_game_history', payload);
        })
        await this.gameEventsRepository.store(GameEvent.create({
            gameType: GameType.TicTacToe,
            payload: JSON.stringify(payload),
            userId: this.userList.get(socket.id)!,
            gameId: game.id,
        }));
        this.emitGames();
    }

    private handleSpectate(roomId: string, socket: Socket) {
        this.joinRoom(roomId, socket, true);
        socket.emit('enter_spectator_mode');
    }
}

export type SquareState = 'X' | 'O' | null;
