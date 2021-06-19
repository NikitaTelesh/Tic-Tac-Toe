import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as GameAlgorithmService from './computerAlgorithms.js';
import {Board} from './Components/Board.jsx';
import {GameModeBtm} from './Components/GameModeBtn.jsx'
import {FirstStepRight} from './Components/FirstStepRight.jsx'

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        moveRow: null,
        moveCol: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      reverseListOfMoves: false,
      playWithComputer: true,
      playerGoesFirst: true,
    }
  }

  componentDidMount(){
    const localStorageState = JSON.parse(localStorage.getItem('state'));
    if (localStorageState) {
      this.setState(localStorageState);
    }
  }

  squareOnClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares.slice();

    if (GameAlgorithmService.calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    if (this.state.playWithComputer && !GameAlgorithmService.calculateWinner(squares) && !GameAlgorithmService.calculateDraw(squares)) {
      squares = this.computerMove(squares);
    }

    if (!this.state.playWithComputer) {
      this.setState({
        xIsNext: !this.state.xIsNext,
      })
    }

    this.setState({
      history: history.concat([{
        squares,
        moveRow: Math.ceil((i+1)/3),
        moveCol: (i+1)%3 || 3,
      }]),
      stepNumber: history.length,
    });
  }

  computerMove(squares){
    const playerGoesFirst = this.state.playerGoesFirst;
    const stepNumber = this.state.stepNumber;
    let squareNumber;

    if (playerGoesFirst) {
      if (stepNumber === 0) {
        squareNumber = GameAlgorithmService.firstStepAlgorithm(squares, playerGoesFirst);
      } else if (GameAlgorithmService.findRepetitionsAlgorithm(squares, playerGoesFirst) !== null) {
        squareNumber = GameAlgorithmService.findRepetitionsAlgorithm(squares, playerGoesFirst);
      } else if (stepNumber === 1) {
        squareNumber = GameAlgorithmService.secondStepAlgorithm(squares, playerGoesFirst);
      } else {
        squareNumber = GameAlgorithmService.getRandomPosition(squares);
      }
    }

    if (!playerGoesFirst) {
      if (stepNumber === 0) {
        squareNumber = GameAlgorithmService.secondStepAlgorithm(squares, playerGoesFirst);
      } else if (GameAlgorithmService.findRepetitionsAlgorithm(squares, playerGoesFirst) !== null) {
        squareNumber = GameAlgorithmService.findRepetitionsAlgorithm(squares, playerGoesFirst);
      } else if (stepNumber === 1) {
        squareNumber = GameAlgorithmService.getAnglePositionOnFriendlyLine(squares);
      } else {
        squareNumber = GameAlgorithmService.getRandomPosition(squares);
      }
    }

    squares[squareNumber] = this.state.xIsNext ? 'O' : 'X';
    return squares;
  }

  createMoves(history){
    let moves = history.map((step, move) => {
      if(move) {
        const desc = `Go to move #${move}: row(${step.moveRow}) col(${step.moveCol})`;

        const handleClick = () => {
          this.jumpTo(move);
        }

        return (
          <li key={move}>
            <button onClick={handleClick} className={this.state.stepNumber === move ? 'active' : ''}>{desc}</button>
          </li>
        );
      }

      return null;
    });

    if (this.state.reverseListOfMoves) {
      moves = moves.reverse();
    }

    return moves;
  }

  reverseMoves = () => {
    this.setState({reverseListOfMoves: !this.state.reverseListOfMoves});
  }

  getStatus(winnerMark, draw){
    if (winnerMark) {
      return `Winner: ${winnerMark}`;
    } else if (draw) {
      return 'A draw!';
    } else {
      return `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
  }

  jumpTo(stepNumber) {
    this.setState({
      stepNumber,
    });

    if (!this.state.playWithComputer) {
      this.setState({
        xIsNext: (stepNumber % 2) === 0,
      })
    }
  }

  modeBtnOnClick = () => {
    this.resetState();
    if (!this.state.stepNumber) {
      this.setState({playWithComputer: !this.state.playWithComputer});
    }
  }

  manFirst = () => {
    this.resetState();
    this.setState({
      playerGoesFirst: true,
      xIsNext: true,
    });
  }

  computerFirst = () => {
    this.resetState();

    const squares = this.resetSquares();
    const squareNumber = GameAlgorithmService.firstStepAlgorithm(squares, false);
    squares[squareNumber] = 'X';

    this.setState({
      history: [{
        squares,
      }],
      playerGoesFirst: false,
      xIsNext: false,
    });
  }

  resetSquares(){
    return Array(9).fill(null);
  }

  resetState = () => {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        moveRow: null,
        moveCol: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      playerGoesFirst: true,
    });
  }

  saveToLocalStorage(){
    const localState = JSON.stringify(this.state);
    localStorage.setItem('state', localState);
  }

  componentDidUpdate() {
    this.saveToLocalStorage();
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const draw = GameAlgorithmService.calculateDraw(current.squares);

    const winnerData = GameAlgorithmService.calculateWinner(current.squares);
    let winnerMark, winnerLine;
    if (winnerData) {
      [winnerMark, winnerLine] = winnerData;
    }

    const moves = this.createMoves(history);
    const status = this.getStatus(winnerMark, draw);

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={this.squareOnClick}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <GameModeBtm
            active={!this.state.stepNumber ? 'active' : ''}
            text={this.state.playWithComputer ? 'friend' : 'computer'}
            onClick={this.modeBtnOnClick}
          />
          <FirstStepRight
            lock={!this.state.stepNumber ? '' : 'lock'}
            hide={this.state.playWithComputer ? '' : 'hide'}
            manFirst={this.manFirst}
            computerFirst={this.computerFirst}
            playerGoesFirst={this.state.playerGoesFirst}
          />
          <button
            className={`game-restart ${!this.state.stepNumber ? 'hide' : ''}`}
            onClick={this.resetState}
          >Start new game
          </button>
          <button
            className={`game-reverse ${!this.state.stepNumber ? 'hide' : ''}`}
            onClick={this.reverseMoves}
          >Reverse list
          </button>
          <ol className={`game-list ${!this.state.stepNumber ? 'hide' : ''}`}>
            <li className="game-list-toggle">
              <button
                onClick={(e) => {
                  const list = e.currentTarget.closest('ol');

                  if (list.classList.contains('open')) {
                    list.classList.remove('open');
                  } else {
                    list.classList.add('open');
                  }
                }}
              >
                List of Moves
              </button>
            </li>
            {moves}
          </ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
