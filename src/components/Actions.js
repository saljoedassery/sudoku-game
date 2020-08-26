import React from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

class Actions extends React.Component {

  confirmClear = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>Are you sure?</h1>
            <p>Do you want to clear the board? All you entered value will diappear</p>
            <button className ="clear-button" onClick={onClose}>Cancel</button>
            <button
              className="clear-button"
              onClick={() => {
                this.props.clearBoard();
                onClose();
              }}
            >
              Clear board
            </button>
          </div>
        );
      }
    });
  }

  generateGameConfirmation = (difficulty) => () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className='confirmation-box'>
            <h1>Are you sure?</h1>
            <p>Do you want to start a new game? All progress with the current game will be lost</p>
            <button className ="clear-button" onClick={onClose}>Cancel</button>
            <button
              className="clear-button"
              onClick={() => {
                this.generateNewBoard(difficulty);
                onClose();
              }}
            >
              Start new Game
            </button>
          </div>
        );
      }
    })
  }

  generateNewBoard = (difficulty) =>{
    this.props.generateNewBoard(difficulty)
  }

  render() {
    return (
      <div className="actions">
        <div className="generate-div">
          <p>Generate: </p>
          <button className="difficulty-button" onClick={this.generateGameConfirmation("Easy")}>Easy</button>
          <button className="difficulty-button" onClick={this.generateGameConfirmation("Medium")}>Medium</button>
          <button className="difficulty-button" onClick={this.generateGameConfirmation("Hard")}>Hard</button>
          <button className="difficulty-button" onClick={this.generateGameConfirmation("Random")}>Random</button>
          <button className="clear-button" onClick={this.confirmClear}>Clear</button>
        </div>

        <div className="validate-clear-div">
          <button className="validate-button" onClick={this.props.validateBoard}>
            <i className="fas fa-check"></i>Validate
          </button>
          <div className="difficulty-indicator-section">
            <button className="difficulty-value" disabled>{this.props.difficulty}</button>
            <button className="difficulty-indicator-button">
              <i className="fa fa-graduation-cap" aria-hidden="true"></i>Difficulty
            </button>
          </div>
        </div>

        <div className="solve-div">
          <button className="solve-button" onClick={this.props.solveBoard}>
            Solve
          </button>
        </div>
      </div>
    );
  }
}

export default Actions;
