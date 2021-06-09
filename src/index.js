import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Logic from './computerAlgorithms.js';
import {ReactComponent as ManSVG} from './man.svg';
import {ReactComponent as ComputerSVG} from './computer.svg';

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = JSON.parse(localStorage.getItem('state')) || {
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

  squareOnClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    let squares = current.squares.slice();

    if (Logic.calculateWinner(squares) || squares[i]) {

      return;
    }

    this.unboldMovesBtns();

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    if (this.state.playWithComputer && !Logic.calculateWinner(squares) && !Logic.calculateDraw(squares)) {
      squares = this.computerMove(squares);
    }

    if (!this.state.playWithComputer) {
      this.setState({
        xIsNext: !this.state.xIsNext,
      })
    }

    this.setState({
      history: history.concat([{
        squares: squares,
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
        squareNumber = Logic.firstStepAlgorithm(squares, playerGoesFirst);
      } else if (Logic.findRepetitionsAlgorithm(squares, playerGoesFirst) !== null) {
        squareNumber = Logic.findRepetitionsAlgorithm(squares, playerGoesFirst);
      } else if (stepNumber === 1) {
        squareNumber = Logic.secondStepAlgorithm(squares, playerGoesFirst);
      } else {
        squareNumber = Logic.getRandomPosition(squares);
      }
    }

    if (!playerGoesFirst) {
      if (stepNumber === 0) {
        squareNumber = Logic.secondStepAlgorithm(squares, playerGoesFirst);
      } else if (Logic.findRepetitionsAlgorithm(squares, playerGoesFirst) !== null) {
        squareNumber = Logic.findRepetitionsAlgorithm(squares, playerGoesFirst);
      } else if (stepNumber === 1) {
        squareNumber = Logic.getAnglePositionOnFriendlyLine(squares);
      } else {
        squareNumber = Logic.getRandomPosition(squares);
      }
    }

    squares[squareNumber] = this.state.xIsNext ? 'O' : 'X';
    return squares;
  }

  movesHandleClick(move, e) {
    this.jumpTo(move);
    this.unboldMovesBtns();

    const btn = e.target;
    btn.classList.add('active');
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
    })

    if (!this.state.playWithComputer) {
      this.setState({
        xIsNext: (step % 2) === 0,
      })
    }
  }

  unboldMovesBtns(){
    const allBtns = document.querySelectorAll('.game-list button');
    allBtns.forEach(item => item.classList.remove('active'));
  }

  resetState(){
    this.setState({
      history: [{
        squares: Array(9).fill(null),
        moveRow: null,
        moveCol: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      playerGoesFirst: true,
    })
  }

  saveToLocalStorage(){
    const localState = JSON.stringify(this.state);
    localStorage.setItem('state', localState);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const draw = Logic.calculateDraw(current.squares);

    const winnerData = Logic.calculateWinner(current.squares);
    let [winnerMark, winnerLine] = winnerData || [null, null];

    let moves = history.map((step, move) => {
      if(move) {
        const desc = `Go to move #${move}: row(${step.moveRow}) col(${step.moveCol})`;

        return (
          <li key={move}>
            <button onClick={(e) => this.movesHandleClick(move, e)}>{desc}</button>
          </li>
        );
      }

      return null;
    });

    if (this.state.reverseListOfMoves) {
      moves = moves.reverse();
    }

    let status;
    if (winnerMark) {
      status = 'Winner: ' + winnerMark;
    } else if (draw) {
      status = 'A draw!';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    this.saveToLocalStorage();

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.squareOnClick(i)}
            winnerLine={winnerLine}
          />
        </div>
        <div className="game-info">
          <div className="game-status">{status}</div>
          <GameModeBtm
            active={!this.state.stepNumber ? 'active' : ''}
            text={this.state.playWithComputer ? 'friend' : 'computer'}
            onClick={() => {
              if (!this.state.stepNumber) {
                this.setState({playWithComputer: !this.state.playWithComputer})}
              }
            }
          />
          <FirstStepRight
            lock={!this.state.stepNumber ? '' : 'lock'}
            hide={this.state.playWithComputer ? '' : 'hide'}
            manFirst={() => {
              this.resetState();
              this.setState({
                playerGoesFirst: true,
                xIsNext: true,
              })
            }}
            computerFirst={() => {
              this.resetState();

              const squares = Array(9).fill(null);
              const squareNumber = Logic.firstStepAlgorithm(squares, false);
              squares[squareNumber] = 'X';
              this.setState({
                history: [{
                  squares: squares,
                }],
                playerGoesFirst: false,
                xIsNext: false,
              });
            }}
          />
          <button
            className={`game-restart ${!this.state.stepNumber ? 'hide' : ''}`}
            onClick={(e) => {
                this.resetState();

                const btn = document.querySelector('.game-mode');
                btn.classList.add('active');

                const firstStepBtns = document.querySelectorAll('.first-step button');
                firstStepBtns.forEach(btn => btn.classList.remove('active'));
              }
            }
          >Start new game
          </button>
          <button
            className={`game-reverse ${!this.state.stepNumber ? 'hide' : ''}`}
            onClick={() => this.setState({reverseListOfMoves: !this.state.reverseListOfMoves})}
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

class Board extends React.Component {
  renderSquare(i, className) {
    return (
      <Square
        className={className || 'square'}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    )
  }

  render() {
    let squares = [];
    let rows = [];

    for (let i = 0; i < 9; i++){
      let className = 'square';

      const winnerLine = this.props.winnerLine;
      if (winnerLine && winnerLine.includes(i)) {
        className = 'square square-win';
      }

      squares.push(this.renderSquare(i, className));
    }

    for (let i = 0; i < 3; i++){
      rows.push(squares.slice(i*3, i*3+3))
    }

    return (
      <div className="board-container">
        <div className="board-row">
          {rows[0]}
        </div>
        <div className="board-row">
          {rows[1]}
        </div>
        <div className="board-row">
          {rows[2]}
        </div>
      </div>
    );
  }
}

function GameModeBtm(props){
  return (
    <button
      className={`game-mode ${props.active}`}
      onClick={() => {
          props.onClick();
        }
      }
    >Click to play with {props.text}
    </button>
  )
}

function FirstStepRight(props){
  return (
    <div className={`first-step ${props.hide} ${props.lock}`}>
      <h3 className="first-step__title">
        Who will go first?
      </h3>
      <div className="first-step__btns">
        <button
          className="first-step__man-btn"
          onClick={(e) => {
              props.manFirst();
              e.currentTarget.classList.add('active');
              e.currentTarget.nextElementSibling.classList.remove('active');
            }
          }
        >
          <ManSVG />
        </button>
        <button
          className="first-step__computer-btn"
          onClick={(e) => {
              props.computerFirst();
              e.currentTarget.classList.add('active');
              e.currentTarget.previousElementSibling.classList.remove('active');
            }
          }
        >
          <ComputerSVG />
        </button>
      </div>
    </div>
  )
}

function Square(props){
  return (
    <button className={props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
