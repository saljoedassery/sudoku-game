import React from "react";

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.currentBoxValue = "";
  }

  handleChange = (i, j) => (event) => {
    let value = event.target.value.replace(this.currentBoxValue,"")
    this.props.changeBoardValue(i, j, value);
  };

  handleClick = (i, j) => (event) => {
    this.currentBoxValue = event.target.value
  }

  render() {
    let cells = [];
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        let box = this.props.board[i][j]
        let cellStyle = {}
        if (!box.correct) cellStyle["backgroundColor"] = "#f3aa9f"
        if (box.editable) cellStyle["textShadow"] = "0 0 0 #0b00ff"

        cells.push(
          <div className="cell-div" key={`${i}${j}`}>
            <input
              type="text"
              className="cell"
              style={cellStyle}
              value={isNaN(Math.abs(parseInt(box.value))) ? "": Math.abs(parseInt(box.value))}
              onChange={this.handleChange(i, j)}
              onClick={this.handleClick(i, j)}
              disabled = {!box.editable}
            />
          </div>
        );
      }
    }

    return <div className="board">{cells}</div>;
  }
}

export default Board;
