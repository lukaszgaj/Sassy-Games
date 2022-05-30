import { useEffect, useState } from "react";
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useService } from '../../../../../customHooks/useService';
import { RootState } from "../../../../../redux/RootState";
import { SocketService } from '../../../../../services/SocketService';
import { decodeToken } from "../../../../../util/token/decodeToken";
import { isTokenValid } from "../../../../../util/token/isTokenValid";
import { GameModeSelector } from "./GameModeSelector";

export function Lobby({ setGameMode, activeGameId, setActiveGameId }: {
    setGameMode: (gameMode: GameModeSelector.GameMode) => void,
    activeGameId: string | undefined,
    setActiveGameId: (id: string | undefined) => void,
}) {
    const socket = useService(SocketService).getSocket();
    const [games, setGames] = useState<{ id: string, players: string[], gameStarted: boolean, playersWhoCanRejoin: string[] }[]>([]);
    const [roomFilter, setRoomFilter] = useState('');

    const token = useSelector<RootState, string | undefined>(state => state.authState.token);
    const decodedToken = token && decodeToken(token);
  

    useEffect(() => {
        socket.on('get_games', games => {
            setGames(games);
        })
        socket.emit('join_tic_tac_toe_lobby');
        socket.on('room_joined', id => {
            setActiveGameId(id);
        })
        socket.on('room_left', () => {
            setActiveGameId(undefined);
        })

        socket.on('game_started', () => {
            setGameMode('Online');
        })

        socket.on('enter_spectator_mode', () => {
            setGameMode('Spectator');
        })
    }, [socket, setActiveGameId, setGameMode]);

    if (!token || !isTokenValid(token)) {
        return <>
            Invalid token - relogin to refresh it
        </>
    }

    return (
        <>
            <InputGroup>
                <div className='input-group-prepend'>
                    <span className='input-group-text'>Filter by room id</span>
                </div>
                <Form.Label htmlFor='Filter by room' />
                <Form.Control
                    onChange={e => {
                        setRoomFilter(e.target.value);
                    }}
                    type='text'
                    className='form-control'
                    id='filter-by-room'
                    placeholder='Room id'
                    required
                />
            </InputGroup>
            <Table striped bordered hover variant='dark' responsive>
                <thead>
                    <tr>
                        <th>Room  id</th>
                        <th>Players</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        games?.filter(game => game.id.includes(roomFilter)).map(game => {
                            return (
                                <tr key={game.id} style={{ height: '60px' }}>
                                    <td>{game.id}{activeGameId === game.id && ' Active'}{activeGameId === game.id && game.players.length === 1 && ' (Please wait for another player to join.)'}</td>
                                    <td>{game.players.length}/2</td>
                                    {!activeGameId && !game.gameStarted && game.players.length < 2 &&
                                        <td>
                                            <Button
                                                className='mr-2'
                                                onClick={() => {
                                                    socket.emit('join_room', game.id)
                                                }}
                                            >
                                                Join
                                            </Button>
                                        </td>
                                    }
                                    {!activeGameId && game.gameStarted && decodedToken && game.playersWhoCanRejoin.filter(login => login === decodedToken.login).length === 1 &&
                                        <td>
                                            <Button
                                                className='mr-2'
                                                onClick={() => {
                                                    socket.emit('join_room', game.id)
                                                }}
                                            >
                                                Rejoin
                                            </Button>
                                        </td>
                                    }
                                    {
                                        activeGameId === game.id &&
                                        <td>
                                            <Button
                                                className='mr-5'
                                                onClick={() => {
                                                    socket.emit('leave_room', game.id)
                                                }}
                                            >
                                                Leave
                                            </Button>
                                        </td>
                                    }
                                    {
                                        activeGameId === game.id && game.players.length === 2 &&
                                        <td>
                                            <Button
                                                className='mr-5'
                                                onClick={() => {
                                                    socket.emit('start_game', game.id)
                                                }}
                                            >
                                                Start game
                                            </Button>
                                        </td>
                                    }
                                    {
                                        !activeGameId && game.gameStarted &&
                                        <td>
                                            <Button
                                                className='mr-5'
                                                onClick={() => {
                                                    socket.emit('spectate', game.id)
                                                }}
                                            >
                                                Spectate
                                            </Button>
                                        </td>
                                    }
                                </tr>
                            );
                        })
                    }
                    <tr>
                        <td>
                            <Button
                                onClick={() => { socket.emit('request_room_creation') }}
                            >
                                Create new room
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </Table>
        </>
    );
}