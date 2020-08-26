import React from "react";
import Header from "./Header";
import Board from "./Board";
import Actions from "./Actions";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Array(9).fill(0).map(() => new Array(9).fill(0)),
      difficulty: "Easy"
    };
    this.originalBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))
  }

  componentDidMount() {
    let boardInput =
      "060000100005308060000060074007000000000045018080000003500003000001000640000900000";
    let board = this.fetchBoard(boardInput);
    this.setState({ board: board });
  }

  unsolvablePopUp = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>Sorry</h1>
            <p>This Sudoku is unsolvable!. Clear the board and start over. You got this.</p>
            <button className="clear-button" onClick={onClose}>Ok</button>
          </div>
        );
      }
    });
  }

  boardIsNotFilledError = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>Sorry</h1>
            <p>Board is not completely filled, Try after finishing all the cells</p>
            <button className="clear-button" onClick={onClose}>Ok</button>
          </div>
        );
      }
    });
  }

  fetchBoard = (boardInput) => {
    let board = this.state.board;
    let originalBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))

    let index = 0;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        board[i][j] =
          boardInput.charAt(index) === "0" ? "" : boardInput.charAt(index);
        index += 1;
      }
    }


    for (var ind = 0; ind < 9; ind++) originalBoard[ind] = board[ind].slice();
    this.originalBoard = originalBoard;

    return board;
  };

  clearBoard = () => {
    let originalBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))
    for (var ind = 0; ind < 9; ind++) originalBoard[ind] = this.originalBoard[ind].slice();
    this.setState({ board: originalBoard })
  }

  changeBoardValue = (i, j, value) => {
    var board = this.state.board;
    board[i][j] = value;
    this.setState({ board: board });
  };

  checkIfBoardIsNotFilled = () => {
    let board = this.state.board;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (board[i][j] === "") {
          return true;
        }
      }
    }
  }

  validateBoard = () => {
    if (this.checkIfBoardIsNotFilled()) this.boardIsNotFilledError()
    else {
      var board = this.originalBoard;
      var filledBoard = this.state.board
      var emptyCell = this.findEmptyCell(board);
      var answer = this.backTracking(emptyCell[0], emptyCell[1], board);
      if (answer[1].length === 0) {
        this.unsolvablePopUp()
      } else {
        for (var i = 0; i < 9; i++) {
          for (var j = 0; j < 9; j++) {
            if (filledBoard[i][j] !== answer[1][i][j]) {
              filledBoard[i][j] = "-" + filledBoard[i][j]
            }
          }
        }
        this.setState({ board: filledBoard })
      }
    }
  }

  generateNewBoard = (difficulty) => {
    console.log("generating new game")
    // create a solution
    var board = this.fetchBoard("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    var emptyCell = this.findEmptyCell(board);
    var answer = this.backTracking(emptyCell[0], emptyCell[1], board);
    if (answer[1].length !== 0) {
      console.log("Answer found!!")
      this.setState({ board: answer[1] });
    } else {
      console.log("No solution found!!")
    }

    // remove numbers from board
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    console.log("random index: ", i, j)

    this.setState({ difficulty: difficulty })
  }

  find3by3Number = (rowIndex, columnIndex, board) => {
    var newBoard = [];
    for (var ind = 0; ind < 9; ind++) newBoard[ind] = board[ind].slice();
    var startRow = Math.floor(rowIndex / 3) * 3;
    var startColumn = Math.floor(columnIndex / 3) * 3;
    var matrix = [];

    for (var i = startRow; i < startRow + 3; i++) {
      for (var j = startColumn; j < startColumn + 3; j++) {
        matrix.push(newBoard[i][j]);
      }
    }
    return matrix;
  };

  checkDuplicationInRow = (rowIndex, number, board) => {
    var status = false;
    for (var j = 0; j < 9; j++) {
      if (board[rowIndex][j] === number.toString()) {
        status = true;
        break;
      }
    }
    return status;
  };

  checkDuplicationInColumn = (columnIndex, number, board) => {
    var status = false;
    for (var i = 0; i < 9; i++) {
      if (board[i][columnIndex] === number.toString()) {
        status = true;
        break;
      }
    }
    return status;
  };

  checkDuplicationInBlock = (rowIndex, columnIndex, number, board) => {
    var status = false;
    var block = this.find3by3Number(rowIndex, columnIndex, board);
    block.forEach((blockNumber) => {
      if (blockNumber === number.toString()) {
        status = true;
      }
    });
    return status;
  };

  checkIfNumberPossibleInCell = (row, column, number, board) => {
    if (
      !this.checkDuplicationInColumn(column, number, board) &&
      !this.checkDuplicationInRow(row, number, board) &&
      !this.checkDuplicationInBlock(row, column, number, board)
    ) {
      return true;
    } else {
      return false;
    }
  };

  findEmptyCell = (board) => {
    var row = -1;
    var column = -1;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (board[i][j] === "") {
          row = i;
          column = j;
          break;
        }
      }
      if (row !== -1 || column !== -1) break;
    }
    return [row, column];
  };

  shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  backTracking = (rowIndex, columnIndex, board) => {
    var newBoard = [];
    var status = [false, []];
    for (var ind = 0; ind < 9; ind++) newBoard[ind] = board[ind].slice();

    var assignedNumber = 0;
    let numbers = [1,2,3,4,5,6,7,8,9]
    numbers = this.shuffleArray(numbers)

    for (var i = 0; i < 9; i++) {
      if (this.checkIfNumberPossibleInCell(rowIndex, columnIndex, numbers[i], newBoard)) {

        newBoard[rowIndex][columnIndex] = numbers[i].toString();
        assignedNumber = numbers[i];

        var emptyCell = this.findEmptyCell(newBoard);
        if (emptyCell[0] === -1 || emptyCell[1] === -1) {
          return [true, newBoard];
        }

        status = this.backTracking(emptyCell[0], emptyCell[1], newBoard);
        if (status[0]) break;
      }
    }

    if (assignedNumber === 0) return [false, []];
    return status;
  };

  solveBoard = () => {
    var board = this.state.board;
    var emptyCell = this.findEmptyCell(board);
    var answer = this.backTracking(emptyCell[0], emptyCell[1], board);
    if (answer[1].length === 0) {
      this.unsolvablePopUp()
    } else {
      console.log("Answer found!!")
      this.setState({ board: answer[1] });
    }
  };

  render() {
    return (
      <div className="main">
        <Header />
        <Board
          board={this.state.board}
          changeBoardValue={(i, j, value) => this.changeBoardValue(i, j, value)}
        />
        <Actions
          solveBoard={this.solveBoard}
          clearBoard={this.clearBoard}
          difficulty={this.state.difficulty}
          generateNewBoard={(difficulty) => this.generateNewBoard(difficulty)}
          validateBoard={this.validateBoard}
        />
      </div>
    );
  }
}

export default MainComponent;
