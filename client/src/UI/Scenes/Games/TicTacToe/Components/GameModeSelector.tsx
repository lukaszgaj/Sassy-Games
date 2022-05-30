import { Button } from "react-bootstrap";

export function GameModeSelector({ setGameMode }: {setGameMode: (gameMode: GameModeSelector.GameMode) => void }) {
    return (
        <div className="gameModeSelectorContainer">
            <Button onClick={() => setGameMode('Lobby')}>Join Lobby</Button>
            <Button onClick={() => setGameMode('Offline-Easy')}>Offline-Easy</Button>
            <Button onClick={() => setGameMode('Offline-Medium')}>Offline-Medium</Button>
            <Button onClick={() => setGameMode('Offline-Impossible')}>Offline-Impossible</Button>
        </div>
    )
}

export namespace GameModeSelector {
    export type GameMode = 'Lobby' | 'Online' | 'Offline-Easy' | 'Offline-Medium' | 'Offline-Impossible' | 'Spectator' | undefined;
}