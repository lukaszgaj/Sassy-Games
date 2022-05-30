import React, { useEffect } from "react";
import { Button } from "react-bootstrap";
import { useService } from "../../../../../customHooks/useService";
import { SocketService } from "../../../../../services/SocketService";
import { GameState } from "../TicTacToePage";
import Board from "./Board";
import { calculateWinner } from "../Utils/calculateWinner";
import { GameModeSelector } from "./GameModeSelector";
import { findRandomEmptyIndex } from "../Utils/findRandomEmptyIndex";
import { findEmptyCrossIndex } from "../Utils/findEmptyCrossIndex";
import { findEmptyCornerIndex } from "../Utils/findEmptyCornerIndex";
import { findBlockingUserOrWinningIndex } from "../Utils/findBlockingUserOrWinningIndex";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../redux/RootState";
import { isTokenValid } from "../../../../../util/token/isTokenValid";

export const Game = ({ gameMode, activeGameId, gameState, setGameMode, setGameState }: {
    gameMode: GameModeSelector.GameMode,
    setGameMode: React.Dispatch<React.SetStateAction<GameModeSelector.GameMode>>,
    activeGameId: string | undefined,
    gameState: GameState,
    setGameState: React.Dispatch<React.SetStateAction<GameState>>,
}) => {
    const socket = useService(SocketService).getSocket();
    const { history, step, winnerId } = gameState;
    const token = useSelector<RootState, string | undefined>(state => state.authState.token);

    useEffect(() => {
        if (gameMode?.includes('Offline')) {
            setGameState({
                history: [Array(9).fill(null)],
                nextMove: socket.id,
                players: [socket.id, gameMode],
                step: 0,
                winnerId: null,
            });
        }
    }, [gameMode, setGameState, socket.id]);

    const handleClick = (i: number) => {
        if (socket.id !== gameState.nextMove || gameMode === 'Spectator') {
            return;
        }
        const historyPoint = history.slice(0, step + 1);
        const currentBoardState = historyPoint[step];
        const currentBoardStateCopy = [...currentBoardState];
        if (winnerId || currentBoardStateCopy[i]) {
            return;
        };
        currentBoardStateCopy[i] = historyPoint.length % 2 === 0 ? 'X' : 'O';

        if (gameMode === 'Online') {
            socket.emit('move_commited', { currentBoardState: currentBoardStateCopy, step: historyPoint.length, roomId: activeGameId });
        } else {
            handleOfflineMode(currentBoardStateCopy);
        }
    };

    const handleOfflineMode = (currentBoardState: SquareState[]) => {
        let winner = calculateWinner(currentBoardState);

        if (winner) {
            setGameState(prevState => {
                return {
                    ...prevState,
                    history: [...prevState.history, currentBoardState],
                    step: prevState.step + 1,
                    winnerId: socket.id,
                };
            });
            return;
        }

        let computerMove: SquareState[];

        if (gameMode === 'Offline-Easy') {
            computerMove = performEasyMove(currentBoardState);
        } else if (gameMode === 'Offline-Medium') {
            computerMove = performMediumMove(currentBoardState);
        } else {
            computerMove = performImpossibleMove(currentBoardState);
        }

        winner = calculateWinner(computerMove);

        if (step === 8) {
            setGameState(prevState => {
                return {
                    ...prevState,
                    history: [...prevState.history, currentBoardState],
                    step: prevState.step + 1,
                    nextMove: socket.id,
                    winnerId: winner ? 'Computer' : null,
                };
            });
            return;
        }

        setGameState(prevState => {
            return {
                ...prevState,
                history: [...prevState.history, currentBoardState, computerMove],
                step: prevState.step + 2,
                nextMove: socket.id,
                winnerId: winner ? 'Computer' : null,
            };
        });
    }

    const performEasyMove = (currentBoardState: SquareState[]): SquareState[] => {
        const currentMoveCopy = [...currentBoardState];
        const selectedIndex = findRandomEmptyIndex(currentBoardState);
        currentMoveCopy[selectedIndex] = 'X';
        return currentMoveCopy;
    }

    const performMediumMove = (currentBoardState: SquareState[]): SquareState[] => {
        const currentMoveCopy = [...currentBoardState];
        if (currentBoardState[4] === null) {
            currentMoveCopy[4] = 'X';
            return currentMoveCopy;
        }

        if (step === 0) {
            const emptyCrossIndex = findEmptyCrossIndex(currentBoardState);
            currentMoveCopy[emptyCrossIndex] = 'X';
            return currentMoveCopy;
        }

        const blockingUserOrWinningIndex = findBlockingUserOrWinningIndex(currentBoardState);
        currentMoveCopy[blockingUserOrWinningIndex] = 'X';
        return currentMoveCopy;
    }

    const performImpossibleMove = (currentBoardState: SquareState[]): SquareState[] => {
        const currentMoveCopy = [...currentBoardState];

        if (currentBoardState[4] === null) {
            currentMoveCopy[4] = 'X';
            return currentMoveCopy;
        }

        if (step === 0) {
            const emptyCornerIndex = findEmptyCornerIndex(currentBoardState);
            currentMoveCopy[emptyCornerIndex] = 'X';
            return currentMoveCopy;
        }

        const blockingUserOrWinningIndex = findBlockingUserOrWinningIndex(currentBoardState);
        currentMoveCopy[blockingUserOrWinningIndex] = 'X';
        return currentMoveCopy;
    }

    if (!token || !isTokenValid(token)) {
        return <>
            Invalid token - relogin to refresh it;
        </>
    }

    return (
        <div className="gameWrapper">
            <h1>Tic Tac Toe {gameMode} {activeGameId}</h1>
            <div className="info-wrapper" style={{ display: "flex", flexDirection: 'column' }}>
                {winnerId && <h3 style={{ textAlign: 'center' }}>{"Winner: " + winnerId}</h3>}
                {!winnerId && step === 9 && <h3 style={{ textAlign: 'center' }}>DRAW!</h3>}
                {(winnerId || (!winnerId && step === 9)) && <Button onClick={() => setGameMode(undefined)}>Back to game mode selector</Button>}
                {((winnerId || (!winnerId && step === 9)) && gameMode?.includes('Offline')) && <Button onClick={() => setGameState({
                    history: [Array(9).fill(null)],
                    nextMove: socket.id,
                    players: [socket.id, gameMode],
                    step: 0,
                    winnerId: null,
                })}>Restart offline game</Button>}
                {!winnerId && step < 9 && <h3 style={{ textAlign: 'center' }}>Next move: {socket.id === gameState.nextMove ? 'You - ' : 'Opponent - '} {gameState.nextMove}</h3>}
            </div>
            <Board squares={history[step]} onClick={handleClick} />
            <h3 style={{ textAlign: 'center' }}>Players: {gameState.players.join('\n')}</h3>
        </div>
    );
};

export type SquareState = 'X' | 'O' | null;

