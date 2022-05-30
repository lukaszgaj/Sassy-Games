import { useEffect, useState } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useService } from "../../../customHooks/useService";
import { RootState } from "../../../redux/RootState";
import { GameService } from "../../../services/Entities/GameService";
import { ResponseHandler } from "../../../services/ResponseHandler";

export function HomePage() {
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);
    const gameService = useService(GameService);
    const [gamesCount, setGamesCount] = useState<number | undefined>(undefined);
    const [ongoingGamesCount, setOngoingGamesCount] = useState<number | undefined>(undefined);
    const responseHandler = useService(ResponseHandler);

    useEffect(() => {
        gameService.sendGetAllGamesCountRequest().then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse && handledResponse.body !== undefined) {
                setGamesCount(handledResponse.body);
            }
        })
        
        gameService.sendGetAllOngoingGamesCountRequest().then(res => {
            const handledResponse = responseHandler.handle(res);
            if (handledResponse && handledResponse.body !== undefined) {
                console.log('HANDLED: ', handledResponse.body);
                setOngoingGamesCount(handledResponse.body);
            }
        })
    }, [gameService, responseHandler])

    return (
        <main className='justify-content-center'>
            <div className='overflow-hidden p-3 m-md-3 text-center bg-dark'>
                <div className='mx-auto my-5'>
                    <h1>Sassy games</h1>
                    <p className='lead font-weight-normal'>
                        Sassy games proof of concept
                    </p>
                    {!token && <p className='lead font-weight-normal'>
                        Log in and start playing! <a href='login' className='btn btn-dark'>Sign in</a>
                    </p>}
                </div>
            </div>
            <div className='container col-sm-4'>
                <article className='card-body'>
                    <h4 className='card-title text-center mb-4 mt-1'>Currently available games:</h4>
                    <Row xs={1} className="g-4">
                        {Array.from({ length: 1 }).map((_, idx) => (
                            <a href='tic_tac_toe' key={idx}>
                                <Col>
                                    <Card
                                        bg={'primary'}
                                        text='light'
                                    >
                                        <Card.Img variant="top" src='https://img.redro.pl/obrazy/tic-tac-toe-700-183361891.jpg' />
                                        <Card.Body>
                                            <Card.Header>Tic Tac Toe ({gamesCount} games played, {ongoingGamesCount} ongoing!)</Card.Header>
                                            <Card.Text>
                                                Tic Tac Toe is a paper-and-pencil game for two players who take turns marking the spaces in a three-by-three grid with X or O. The player who succeeds in placing three of their marks in a horizontal, vertical, or diagonal row is the winner.
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </a>
                        ))}
                    </Row>
                </article>
            </div>
        </main>
    );
}