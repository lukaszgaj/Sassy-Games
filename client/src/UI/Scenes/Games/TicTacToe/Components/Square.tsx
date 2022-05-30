import * as React from 'react';
import {SquareState} from './Game';

const Square = ({ value, onClick }: {value: SquareState, onClick: (e: React.MouseEvent<HTMLButtonElement>) => void}) => {
  const style = value ? `squares ${value}` : `squares`;

  return (
    <button className={style} onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;