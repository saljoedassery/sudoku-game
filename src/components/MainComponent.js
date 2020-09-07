import React from "react";
import Header from "./Header";
import Board from "./Board";
import Actions from "./Actions";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Constants from "../constants/Constants";

class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      board: new Array(9).fill(0).map(() => new Array(9).fill(0)),
      difficulty: "Easy",
      loading: false
    };
    this.originalBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))
    this.solution = new Array(9).fill(0).map(() => new Array(9).fill(0))
    this.difficultyMapping = {
      "Easy": 43,
      "Medium": 51,
      "Hard": 56
    }
  }

  componentDidMount() {
    this.generateNewBoard(this.state.difficulty)
  }

  errorPopUp = (main, sub) => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>{main}</h1>
            <p>{sub}</p>
            <button className="clear-button" onClick={onClose}>Ok</button>
          </div>
        );
      }
    });
  }

  successConfirmation = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>{Constants.SUCCESS_MAIN}</h1>
            <p>{Constants.SUCCESS_SUB}</p>
            <div className="confirmation-button-section">
              <button className="clear-button" onClick={onClose}>Cancel</button>
              <button
                className="clear-button"
                onClick={() => {
                  onClose();
                  this.generateNewBoard("Easy");
                }}
              >
                Start new Game
            </button>
            </div>
          </div>
        );
      }
    })
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
    value = parseInt(value.slice(value.length - 1))
    if (Number.isInteger(value) && value > 0) {
      var board = this.state.board;
      board[i][j] = value;
      this.setState({ board: board });
    } else {
      this.errorPopUp(Constants.INVALID_INPUT_MAIN, Constants.INVALID_INPUT_SUB)
    }
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
    if (this.checkIfBoardIsNotFilled()) this.errorPopUp(Constants.BOARD_NOT_FILLED_MAIN, Constants.BOARD_NOT_FILLED_SUB)
    else {
      var board = this.solution;
      var filledBoard = this.state.board
      let flag = false

      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          if (filledBoard[i][j] !== board[i][j]) {
            filledBoard[i][j] = "-" + Math.abs(parseInt(filledBoard[i][j]))
            flag = true
          }
        }
      }
      if (!flag) {
        this.successConfirmation()
      }
      this.setState({ board: filledBoard })
    }
  }

  findRandomBox = () => {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    return [i, j]
  }

  generateNewBoard = (difficulty) => {
    this.setState({ loading: true })
    // create a solution
    var board = this.fetchBoard("000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
    var emptyCell = this.findEmptyCell(board);
    var answer = this.backTracking(emptyCell[0], emptyCell[1], board);
    this.solution = answer[1]

    let generatedBoard = []
    for (var ind = 0; ind < 9; ind++) generatedBoard[ind] = answer[1][ind].slice();

    // find random box in the board
    let removedNumbersCount = 0;

    var list = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        list.push([i, j]);
      }
    }
    let boxes = this.shuffleArray(list)

    for (let box of boxes) {

      i = box[0]
      j = box[1]

      // try removing the number in the i,j box
      let removedNumber = generatedBoard[i][j];
      generatedBoard[i][j] = ""
      // var emptyBox = this.findEmptyCell(generatedBoard);
      var result = this.backTracking(i, j, generatedBoard, i, j, removedNumber);

      if (result[1].length === 0) {
        // can remove this number
        removedNumbersCount += 1
      } else generatedBoard[i][j] = removedNumber

      var difficultyCount = difficulty !== "Random" ? this.difficultyMapping[difficulty] :
        Math.floor(Math.random() * (this.difficultyMapping["Hard"] - this.difficultyMapping["Easy"] + 1) + this.difficultyMapping["Easy"]);
      if (removedNumbersCount === difficultyCount) break;

    }
    this.setState({ difficulty: difficulty, board: generatedBoard })

    let originalBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))
    for (var indx = 0; indx < 9; indx++) originalBoard[indx] = generatedBoard[indx].slice();
    this.originalBoard = originalBoard;
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

  backTracking = (rowIndex, columnIndex, board, removedRow, removedColumn, removedNumber) => {
    var newBoard = [];
    var status = [false, []];
    for (var ind = 0; ind < 9; ind++) newBoard[ind] = board[ind].slice();

    var assignedNumber = 0;
    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    numbers = this.shuffleArray(numbers)

    for (var i = 0; i < 9; i++) {
      if (this.checkIfNumberPossibleInCell(rowIndex, columnIndex, numbers[i], newBoard) &&
        (removedRow !== rowIndex || removedColumn !== columnIndex || parseInt(removedNumber) !== parseInt(numbers[i]))) {

        newBoard[rowIndex][columnIndex] = numbers[i].toString();
        assignedNumber = numbers[i];

        var emptyCell = this.findEmptyCell(newBoard);
        if (emptyCell[0] === -1 || emptyCell[1] === -1) {
          return [true, newBoard];
        }

        status = this.backTracking(emptyCell[0], emptyCell[1], newBoard, removedRow, removedColumn, removedNumber);
        if (status[0]) break;
      }
    }

    if (assignedNumber === 0) return [false, []];
    return status;
  };

  solveBoard = () => {
    var board = this.originalBoard;
    var emptyCell = this.findEmptyCell(board);
    var answer = this.backTracking(emptyCell[0], emptyCell[1], board, -1, -1, 0);
    if (answer[1].length === 0) {
      this.errorPopUp(Constants.UNSOLVABLE_MAIN, Constants.UNSOLVABLE_SUB)
    } else {
      this.setState({ board: answer[1] });
    }
  };

  modifyBoardToDisplay = () => {
    let board = this.state.board;
    let originalBoard = this.originalBoard
    let modifiedBoard = new Array(9).fill(0).map(() => new Array(9).fill(0))

    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        modifiedBoard[i][j] = {
          "value":board[i][j],
          "editable": originalBoard[i][j] === "",
          "correct" : parseInt(board[i][j]) > 0 || board[i][j] === ""
        }
      }
    }
    return modifiedBoard;
  }

  render() {
    return (
      <div className="main">
        <Header />
        <Board
          board={this.modifyBoardToDisplay()}
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
