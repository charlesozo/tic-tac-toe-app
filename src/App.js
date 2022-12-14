import logo from "./logo.svg";
import "./App.css";
import Board from "./components/Board";
import Square from "./components/Square";
import { useEffect, useState } from "react";
const defaultSquares = () => new Array(9).fill(null);

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

function App() {
  const [squares, setSquares] = useState(defaultSquares());
  const [winner, setWinner] = useState(null);
  const [userWin, setUserWin] = useState(localStorage.getItem("userwin") || 0);
  const [computerWin, setComputerWin] = useState(
    localStorage.getItem("computerwin") || 0
  );
  const [allDraw, setAllDraw] = useState(localStorage.getItem("alldraw") || 0);
  const [itsDraw, setItsDraw] = useState(false);
  // console.log(squares);
  useEffect(() => {
    setItsDraw(squares.every((square) => square !== null));
    const isComputerTurn =
      squares.filter((square) => square !== null).length % 2 === 1;
    const putComputerAt = (index) => {
      let newSquares = squares;
      newSquares[index] = "o";
      setSquares([...newSquares]);
    };
    const linesThatAre = (a, b, c) => {
      return lines.filter((squareIndexes) => {
        const squareValues = squareIndexes.map((index) => squares[index]);
        return (
          JSON.stringify([a, b, c].sort()) ===
          JSON.stringify(squareValues.sort())
        );
      });
    };
    const emptyIndexes = squares
      .map((square, index) => (square === null ? index : null))
      .filter((val) => val !== null);
    const playerWon = linesThatAre("x", "x", "x").length > 0;
    const computerWon = linesThatAre("o", "o", "o").length > 0;
    if (playerWon) {
      setWinner("x");
      putComputerAt(null);
      return
    }
    if (computerWon) {
      setWinner("o");
    }

    if (isComputerTurn) {
      const winingLines = linesThatAre("o", "o", null);
      if (winingLines.length > 0) {
        const winIndex = winingLines[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(winIndex);
        return;
      }
      const linesToBlock = linesThatAre("x", "x", null);
      if (linesToBlock.length > 0) {
        const blockIndex = linesToBlock[0].filter(
          (index) => squares[index] === null
        )[0];
        putComputerAt(blockIndex);
        return;
      }
      const linesToContinue = linesThatAre("o", null, null);
      if (linesToContinue.length > 0) {
        putComputerAt(
          linesToContinue[0].filter((index) => squares[index] === null)[0]
        );
        return;
      }
      const randomIndex =
        emptyIndexes[Math.ceil(Math.random() * emptyIndexes.length)];
      putComputerAt(randomIndex);
    }
  }, [squares]);

  const handleSquareClick = (index) => {
    const isPlayerTurn =
      squares.filter((square) => square !== null).length % 2 === 0;
    if (isPlayerTurn && winner !== "o" && squares[index]!=="o") {
      let newSquares = squares;
      newSquares[index] = "x";
      setSquares([...newSquares]);
    }
  };
  useEffect(() => {
    if (winner === "o") {
      setComputerWin(parseInt(computerWin) + 1);
      localStorage.setItem("computerwin", parseInt(computerWin) + 1);
    } else if (winner === "x") {
      setUserWin(parseInt(userWin) + 1);
      localStorage.setItem("userwin", parseInt(userWin) + 1);
    }
  }, [winner]);
  useEffect(() => {
    if (itsDraw) {
      setAllDraw(parseInt(allDraw) + 1);
      localStorage.setItem("alldraw", parseInt(allDraw) + 1);
    }
  }, [itsDraw]);
  function refreshPage() {
    window.location.reload();
  }
  function clearStorage() {
    localStorage.clear();
    window.location.reload();
  }

  // console.log(itsDraw)
  return (
    <div className="App">
      <header>
        <h1>Tic Tac Toe Game</h1>
      </header>

      <main>
        <Board>
          {squares.map((square, index) => (
            <Square
              key={index}
              x={square === "x" ? 1 : 0}
              o={square === "o" ? 1 : 0}
              onClick={() => handleSquareClick(index)}
            />
          ))}
        </Board>
        {!!winner && winner === "x" && (
          <div className="result green">
            <p className="status">You WON!</p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={refreshPage}
              >
                Click to restart
              </button>
            </div>
          </div>
        )}
        {!!winner && winner === "o" && (
          <div className="result red">
            <p className="status">You LOST!</p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={refreshPage}
              >
                Click to restart
              </button>
            </div>
          </div>
        )}
        {itsDraw && winner === null ? (
          <div className="result orange">
            <p className="status">It is a draw!</p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-primary"
                type="button"
                onClick={refreshPage}
              >
                Click to restart
              </button>
            </div>
          </div>
        ) : null}
        <div className="display-score">
          <h3>Score</h3>
          <p className="user-win">
            User- <span>{userWin}</span>
          </p>
          <p className="computer-win">
            Comp- <span>{computerWin}</span>
          </p>
          <p className="all-Draw">
            Draw- <span>{allDraw}</span>
          </p>
          <button
            type="button"
            class="btn btn-danger btn-sm"
            onClick={clearStorage}
          >
            Reset
          </button>
        </div>
      </main>
    </div>
  );
}

export default App;
