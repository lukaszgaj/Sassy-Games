
import { ReactNode, useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useService } from "../../../customHooks/useService";
import { Game } from "../../../DTOs/Game";
import { GameEvent } from "../../../DTOs/GameEvent";
import { openInfoModal } from "../../../redux/Actions/Modals/InfoModal/openInfoModal";
import { RootState } from "../../../redux/RootState";
import { GameEventService } from "../../../services/Entities/GameEventService";
import { GameService } from "../../../services/Entities/GameService";
import { ResponseHandler } from "../../../services/ResponseHandler";
import { decodeToken } from "../../../util/token/decodeToken";
import Board from "../Games/TicTacToe/Components/Board";

export function ProfilePage() {
    const gameService = useService(GameService);
    const gameEventService = useService(GameEventService);
    const responseHandler = useService(ResponseHandler);
    const [games, setGames] = useState<Game[] | undefined>(undefined);
    const dispatch = useDispatch();
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);

    useEffect(() => {
        gameService.sendGetAllGamesForLoggedUserRequest().then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse && handledResponse.body) {
                setGames(handledResponse.body);
            }
        })
    }, [gameService, responseHandler])

    function getChildren(gameEvents: GameEvent[]): ReactNode {
        return <Table striped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>id</th>
                    <th>userId</th>
                    <th>Payload</th>
                </tr>
            </thead>
            <tbody>
                {
                    gameEvents
                        .sort(function (a, b) {
                            var c = new Date(a.createdAt).getTime();
                            var d = new Date(b.createdAt).getTime();
                            return c - d;
                        })
                        .map(gameEvent => {
                            return (
                                <tr key={gameEvent.id}>
                                    <td>{gameEvent.id}</td>
                                    <td>{gameEvent.userId}</td>
                                    <td><Board squares={JSON.parse(gameEvent.payload).currentBoardState} onClick={() => void 0}></Board></td>
                                </tr>
                            );
                        })
                }
            </tbody>
        </Table>
    }

    return <>
        <h3 style={{ textAlign: 'center' }}>STATISTICS</h3>
        <Table striped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>Total Games Played</th>
                    <th>Won</th>
                    <th>Lost</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{games?.length}</td>
                    <td>{token && games?.filter(game => game.winnerId === decodeToken(token).login).length}</td>
                    <td>{token && games?.filter(game => game.loserId === decodeToken(token).login).length}</td>
                </tr>
            </tbody>
        </Table>
        <h3 style={{ textAlign: 'center' }}>GAME HISTORY</h3>
        <Table striped bordered hover variant='dark'>
            <thead>
                <tr>
                    <th>id</th>
                    <th>Game Type</th>
                    <th>Winner</th>
                    <th>Loser</th>
                    <th>isCancelled</th>
                    <th>roomId</th>
                </tr>
            </thead>
            <tbody>
                {
                    games?.map(game => {
                        return (
                            <tr key={game.id}>
                                <td>{game.id}</td>
                                <td>{game.gameType}</td>
                                <td>{game.winnerId}</td>
                                <td>{game.loserId}</td>
                                <td>{game.isCancelled.toString()}</td>
                                <td>{game.roomId}</td>
                                <td>
                                    <Button
                                        className='mr-5'
                                        onClick={() => {
                                            gameEventService.sendGetAllGamesForLoggedUserRequest(game.id).then(res => {
                                                const handledResponse = responseHandler.handle(res);
                                                if (handledResponse && handledResponse.body) {
                                                    dispatch(openInfoModal({ children: getChildren(handledResponse.body), heading: `Game history - ${game.id}` }));
                                                }
                                            })
                                        }}
                                    >
                                        Show game history
                                    </Button>
                                </td>
                            </tr>
                        );
                    })
                }
            </tbody>
        </Table>
    </>

}