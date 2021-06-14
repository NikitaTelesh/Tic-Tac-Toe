const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];
const diagonalCombinations = winningCombinations.slice(6);
const straightCombinations = winningCombinations.slice(0,6);
const center = 4;

function firstStepAlgorithm(squares, playerGoesFirst){
  const isCenterEmpty = !squares[center];

  const condition = playerGoesFirst ? isCenterEmpty : chooseRandomStrategy();

  return condition ? center : getRandomPosition(squares, 'onAngle');
}

function secondStepAlgorithm(squares, playerGoesFirst){
  const zeroInCenter = squares[center] === 'O';
  const xInCenter = squares[center] === 'X';

  if (playerGoesFirst) {
    if (zeroInCenter) {
      const isXOnOppositeDiagonals = (squares[0] === 'X' && squares[0] === squares[8]) || (squares[2] === 'X' && squares[2] === squares[6]);
      const isXOnSiblingSides = (squares[1] === 'X' && (squares[1] === squares[3] || squares[1] === squares[5])) || (squares[7] === 'X' && (squares[7] === squares[3] || squares[7] === squares[5]));
      const isXOnSideAndOnAngle = isMarkOn(squares, 'X', 'onCenterOfSide') && isMarkOn(squares, 'X', 'onAngle');

      if (isXOnOppositeDiagonals) {
        return getRandomPosition(squares, 'onSide');
      } else if (isXOnSiblingSides || isXOnSideAndOnAngle) {
        return getPositionNearXOnAngle(squares);
      }
    }

    return getRandomPosition(squares, 'onAngle');
  }

  if (!playerGoesFirst) {
    if (xInCenter) {
      return getRandomPosition(squares, 'onAngle');
    }

    if (!zeroInCenter) {
      const isZeroOnAngle = isMarkOn(squares, 'O', 'onAngle');

      return isZeroOnAngle ? getRandomPosition(squares, 'onAngle') : getAnglePositionOnFriendlyLine(squares);
    }

    for(let i = 0; i < diagonalCombinations.length; i ++) {
      const [a, , c] = diagonalCombinations[i];

      if (squares[a] === 'X' && !squares[c]) {
        return c;
      } else if (squares[c] === 'X' && !squares[a]) {
        return a;
      }
    }

  }
}

function isMarkOn(squares, mark, where) {
  let i = where === 'onAngle' ? 0 : 1;
  let isMarkOn = false;

  while(i < squares.length) {
    if (squares[i] === mark && i !== center) {
      isMarkOn = true;
      break;
    }

    i += 2;
  }

  return isMarkOn;
}

function findRepetitionsAlgorithm(squares, playerGoesFirst){
  const computerSymbol = playerGoesFirst ? 'O' : 'X';
  const playerSymbol = computerSymbol === 'X' ? 'O' : 'X';

  const winningPosition = findRepetitions(squares, playerSymbol);
  const protectPosition = findRepetitions(squares, computerSymbol);

  return winningPosition !== null ? winningPosition : protectPosition;
}

function findRepetitions(squares, symbol){
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    const isOppositeSymbolOnLine = (squares[a] === symbol || squares[b] === symbol || squares[c] === symbol);
    if (isOppositeSymbolOnLine) {
      continue;
    }

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
  for (let i = 0; i < winningCombinations.length; i++) {
    const [a, b, c] = winningCombinations[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      const winnerLine = winningCombinations[i];
      const winnerMark = squares[a];
      return [winnerMark, winnerLine];
    }
  }

  return null;
}

function getRandomInt(min = 0, max = 8){
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getPositionNearXOnAngle(squares) {
  for(let i = 0; i < winningCombinations.length; i++) {
    let [a, b, c] = winningCombinations[i];

    if (!squares[a] && squares[b] === 'X' && !squares[c]) {
      return chooseRandomStrategy() ? a : c;
    }
  }
}

function getAnglePositionOnFriendlyLine(squares) {
  for(let i = 0; i < straightCombinations.length; i++) {
    const [a, b, c] = straightCombinations[i];

    if (squares[a] === 'X' && squares[b] !== 'O' && !squares[c]) {
      return c;
    } else if (squares[c] === 'X' && squares[b] !== 'O' && !squares[a]) {
      return a;
    }
  }
}

function getRandomPosition(squares, where){
  let squareNumber = getRandomInt();

  if (where) {
    const remainder = where === 'onAngle' ? 0 : 1;

    while((squareNumber % 2 !== remainder) || (squareNumber === center) || squares[squareNumber]) {
      squareNumber = getRandomInt();
    }
  } else {
    while(squares[squareNumber]) {
      squareNumber = getRandomInt();
    }
  }

  return squareNumber;
}

function chooseRandomStrategy() {
  return Math.round(Math.random());
}

export {firstStepAlgorithm, secondStepAlgorithm, getRandomPosition, getAnglePositionOnFriendlyLine, findRepetitionsAlgorithm, calculateDraw, calculateWinner};