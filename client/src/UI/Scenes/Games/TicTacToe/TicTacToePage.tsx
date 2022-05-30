import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useService } from "../../../../customHooks/useService";
import { RootState } from "../../../../redux/RootState";
import { SocketService } from "../../../../services/SocketService";
import { isTokenValid } from "../../../../util/token/isTokenValid";
import { Game, SquareState } from "./Components/Game";
import { GameModeSelector } from "./Components/GameModeSelector";
import { Lobby } from "./Components/Lobby";
import './index.css';

export function TicTacToe() {
    const [gameMode, setGameMode] = useState<GameModeSelector.GameMode>(undefined);
    const [activeGameId, setActiveGameId] = useState<string | undefined>();
    const [gameState, setGameState] = useState<GameState>({ players: [], nextMove: '', history: [Array(9).fill(null)], step: 0, winnerId: null });
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);

    const socket = useService(SocketService).getSocket();

    useEffect(() => {
        if (gameMode !== 'Online' && gameMode !== 'Spectator') {
            return;
        }
        socket.on('update_game_state', newGameState => {
            setGameState(prevState => {
                return {
                    ...prevState,
                    players: newGameState.players,
                    nextMove: newGameState.nextMove,
                };
            });
        })

        socket.on('update_game_history', info => {
            setGameState(prevState => {
                return {
                    ...prevState,
                    history: [...prevState.history, info.currentBoardState],
                    step: info.step,
                    nextMove: info.nextMove,
                    winnerId: info.winnerId,
                };
            });
        })
    }, [socket, gameMode]);

    useEffect(() => {
        if (gameMode === 'Lobby') {
            setGameState({
                players: [], 
                nextMove: '',
                history: [Array(9).fill(null)], 
                step: 0, 
                winnerId: null,
            });
        }
    }, [gameMode])

    if (!token || !isTokenValid(token)) {
        return <>
            Invalid token - relogin to refresh it;
        </>
    }

    return (
        <main className='justify-content-center'>
            {gameMode === undefined &&
                <div className='overflow-hidden p-3 m-md-3 text-center bg-dark'>
                    <div className='mx-auto my-5'>
                        <h1>Tic Tac Toe</h1>
                        <p className='lead font-weight-normal'>
                            {gameMode === undefined ? 'Select game mode' : 'Sassy games proof of concept'}
                        </p>
                    </div>
                </div>
            }
            <div>
                {gameMode === undefined && <GameModeSelector setGameMode={setGameMode} />}
                {gameMode === 'Lobby' && <Lobby setGameMode={setGameMode} activeGameId={activeGameId} setActiveGameId={setActiveGameId} />}
                {gameMode !== undefined && gameMode !== 'Lobby' &&
                    <Game
                        setGameMode={setGameMode}
                        gameMode={gameMode}
                        activeGameId={activeGameId}
                        gameState={gameState}
                        setGameState={setGameState}
                    />
                }
            </div>
        </main>
    );
}

export interface GameState {
    players: string[],
    nextMove: string,
    history: SquareState[][],
    step: number,
    winnerId: string | null,
}
