const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const diagonalLines = lines.slice(6);
const straightLines = lines.slice(0,6);

function firstStepAlgorithm(squares, playerGoesFirst){
  if (playerGoesFirst){
    if (!squares[4]) {
      return 4;
    } else {
      return getRandomAnglePosition(squares);
    }
  } else {
    const firstStepInCenter = Math.round(Math.random());

    if (firstStepInCenter) {
      return 4;
    } else {
      return getRandomAnglePosition(squares);
    }
  }
}

function secondStepAlgorithm(squares, playerGoesFirst){
  if (playerGoesFirst) {
    if (squares[4] === 'O') {
      const checkOppositeDiagonals = (squares[0] === 'X' && squares[0] === squares[8]) || (squares[2] === 'X' && squares[2] === squares[6]);
      const checkXOnSiblingSides = (squares[1] === 'X' && (squares[1] === squares[3] || squares[1] === squares[5])) || (squares[7] === 'X' && (squares[7] === squares[3] || squares[7] === squares[5]));
      const checkXOnSides = findMarkOn(squares, 'X', 'side');
      const checkXOnAngles = findMarkOn(squares, 'X', 'angle');

      if(checkOppositeDiagonals) {
        return getRandomSidePosition(squares);
      } else if (checkXOnSiblingSides || (checkXOnSides && checkXOnAngles)) {
        return getPositionNearXOnAngle(squares);
      }
    }

    return getRandomAnglePosition(squares);
  }

  if (squares[4] !== 'X') {
    if (squares[4] !== 'O') {
      let [isZeroOnAngle,] = findMarkOn(squares, 'O', 'angle');

      if (isZeroOnAngle) {
        return getRandomAnglePosition(squares);
      } else {
        return getAnglePositionOnFriendlyLine(squares);
      }
    } else {
      for(let i = 0; i < diagonalLines.length; i ++) {
        const [a, , c] = diagonalLines[i];

        if (squares[a] === 'X' && !squares[c]) {
          return c;
        } else if (squares[c] === 'X' && !squares[a]) {
          return a;
        }
      }
    }
  }

  if (squares[4] === 'X') {
    return getRandomAnglePosition(squares);
  }
}

function findMarkOn(squares, mark, where) {
  let i = where === 'angle' ? 0 : 1;
  let isMarkOn = false;
  let markPosition = null;

  while(i < squares.length) {
    if (squares[i] === mark && i !== 4) {
      isMarkOn = true;
      markPosition = i;
      break;
    }
    i += 2;
  }

  return [isMarkOn, markPosition];
}

function findRepetitionsAlgorithm(squares, playerGoesFirst){
  const computerSymbol = playerGoesFirst ? 'O' : 'X';
  const playerSymbol = computerSymbol === 'X' ? 'O' : 'X';

  if (findRepetitions(squares, playerSymbol) !== null) {
    return findRepetitions(squares, playerSymbol);
  } else if (findRepetitions(squares, computerSymbol) !== null) {
    return findRepetitions(squares, computerSymbol);
  }

  return null;
}

function findRepetitions(squares, symbol){
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] === symbol || squares[b] === symbol || squares[c] === symbol) continue;

    if (squares[a] && squares[a] === squares[b]) {
      return c;
    } else if (squares[b] && squares[b] === squares[c]) {
      return a;
    } else if (squares[a] && squares[a] === squares[c]) {
      return b;
    }
  }

  return null;
}

function calculateDraw(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (!squares[i]) {
      return false;
    }
  }
  return true;
}

function calculateWinner(squares) {
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winnerLine = lines[i];
      const winnerMark = squares[a];
      return [winnerMark, winnerLine];
    }
  }
  return null;
}

function getRandomInt(min, max){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomAnglePosition(squares){
  let squareNumber = getRandomInt(0,8);
  while((squareNumber % 2 !== 0) || (squareNumber === 4) || squares[squareNumber]) {
    squareNumber = getRandomInt(0,8);
  }
  return squareNumber;
}

function getRandomSidePosition(squares){
  let squareNumber = getRandomInt(0,8);
  while((squareNumber % 2 !== 1) || (squareNumber === 4) || squares[squareNumber]) {
    squareNumber = getRandomInt(0,8);
  }
  return squareNumber;
}

function getPositionNearXOnAngle(squares) {
  for(let i = 0; i < lines.length; i++) {
    let [a, b, c] = lines[i];

    if (!squares[a] && squares[b] === 'X' && !squares[c]) {
      if(Math.round(Math.random())){
        return a;
      } else {
        return c;
      }
    }
  }
}

function getAnglePositionOnFriendlyLine(squares) {
  for(let i = 0; i < straightLines.length; i++) {
    const [a, b, c] = straightLines[i];

    if (squares[a] === 'X' && squares[b] !== 'O' && !squares[c]) {
      return c;
    } else if (squares[c] === 'X' && squares[b] !== 'O' && !squares[a]) {
      return a;
    }
  }
}

function getRandomPosition(squares){
  let squareNumber = getRandomInt(0,8);
  while(squares[squareNumber]) {
    squareNumber = getRandomInt(0,8);
  }
  return squareNumber;
}

export {firstStepAlgorithm, secondStepAlgorithm, getRandomPosition, getRandomAnglePosition, getAnglePositionOnFriendlyLine, findRepetitionsAlgorithm, calculateDraw, calculateWinner}