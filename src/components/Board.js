import React from "react";

class Board extends React.Component {

  handleChange = (i, j) => (event) => {
    this.props.changeBoardValue(i, j, event.target.value);
  };

  render() {
    let cells = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        cells.push(
          <div className="cell-div" key={`${i}${j}`}>
            <input
              type="text"
              className="cell"
              style={parseInt(this.props.board[i][j]) < 0 ? {backgroundColor: "red"} : {}}
              value={isNaN(Math.abs(parseInt(this.props.board[i][j]))) ? "": Math.abs(parseInt(this.props.board[i][j]))}
              onChange={this.handleChange(i, j)}
              disabled = {this.props.board[i][j] !== ""}
            />
          </div>
        );
      }
    }

    return <div className="board">{cells}</div>;
  }
}

export default Board;
