import React from 'react';
import {Square} from './Square.jsx'

export class Board extends React.Component {
  renderSquare(i, className) {
    const handleClick = () => {
      this.props.onClick(i);
    }

    return (
      <Square
        className={className}
        value={this.props.squares[i]}
        onClick={handleClick}
        key={i}
      />
    )
  }

  render() {
    const squares = Array(9).fill(null).map((square, index) => {
      let className = 'square';

      const {winnerLine} = this.props;
      if (winnerLine?.includes(index)) {
        className = 'square square-win';
      }

      return this.renderSquare(index, className);
    });

    const rows = Array(3).fill(null).map((row, index) => {
      const startOfRow = index*3;
      const endOfRow = startOfRow + 3;

      return squares.slice(startOfRow, endOfRow);
    });

    return (
      <div className="board-container">
        {rows.map((row, index) => <div key={index} className="board-row">{row}</div>)}
      </div>
    );
  }
}