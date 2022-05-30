import Square from "./Square";
import {SquareState} from './Game';

const Board = ({ squares, onClick }: {squares: SquareState[], onClick: (i: number) => void}) => (
  <div className="board">
    {squares.map((square, i) => (
      <Square key={i} value={square} onClick={() => onClick(i)} />
    ))}
  </div>
);

export default Board;