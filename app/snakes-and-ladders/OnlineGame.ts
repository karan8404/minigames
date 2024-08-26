import { Player } from "../../components/Player";

const ladders = new Map<number, number>([
    [1, 38],
    [4, 14],
    [9, 31],
    [21, 42],
    [28, 84],
    [36, 44],
    [51, 67],
    [71, 91],
    [80, 99],
]);
const snakes = new Map<number, number>([
    [16, 6],
    [47, 26],
    [49, 11],
    [56, 53],
    [62, 19],
    [64, 60],
    [87, 24],
    [93, 73],
    [95, 75],
    [98, 78],
]);
export class OnlineGame {
    gameID: string;
    player1: Player;
    player2: Player;
    currPlayer: boolean; //true - player1, false - player2
    player1Pos: number;
    player2Pos: number;

    constructor(
        gameID: string,
        player1: Player,
        player2: Player,
    ) {
        this.gameID = gameID;
        this.player1 = player1;
        this.player2 = player2;
        this.currPlayer = Math.random() < 0.5;
        this.player1Pos = 1;
        this.player2Pos = 1;
    }
}