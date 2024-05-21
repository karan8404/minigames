import { Player } from "./Player";

export class onlineGame {
  player1: Player;
  player2: Player;
  board: Array<string>;
  currChar: string;
  currPlayer: boolean; //true - player1, false - player2

  constructor(
    player1: Player,
    player2: Player,
    currChar: string = "X",
    currPlayer: boolean = Math.random() < 0.5
  ) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = Array(9).fill("");
    this.currChar = currChar;
    this.currPlayer = currPlayer;
  }

  // 0 - game not over, 1 - player1 wins, 2 - player2 wins, 3 - draw, -1 - invalid move
  makeMove(pos: number): number {
    if (this.board[pos] != "") return -1;

    this.board[pos] = this.currChar;
    if (this.checkWin()) {
      return this.currPlayer ? 1 : 2;
    }
    if (!this.board.includes("")) {
      return 3;
    }
    this.currChar = this.currChar === "X" ? "O" : "X"; //swap character
    this.currPlayer = !this.currPlayer; //swap player
    return 0;
  }

  checkWin(): boolean {
    const winConditions = [
      //horizontal lines
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      //vertical lines
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      //diagonals
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let condition of winConditions) {
      if (
        this.board[condition[0]] &&
        this.board[condition[0]] === this.board[condition[1]] &&
        this.board[condition[1]] === this.board[condition[2]]
      ) {
        return true;
      }
    }
    return false;
  }
}
