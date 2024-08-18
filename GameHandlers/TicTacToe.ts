import { Server, Socket } from "socket.io";
import { Player } from "../components/Player";
import { onlineGame } from "../app/tic-tac-toe/onlineGame";

//tic tac toe
const ticTacToePlayers = new Map<string, Player>();
const ticTacToeGames = new Map();

export function setupTicTacToeHandlers(socket: Socket, io: Server) {
    socket.on("join", (room) => {
        console.log("Joining room", room);
        socket.join(room);
      });
  
      socket.on("searching", (player: Player) => {
        ticTacToePlayers.set(player.socketID, player);
        console.log("Players", ticTacToePlayers);
        io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
      });
  
      socket.on("leaveGame", () => {
        console.log(socket.id, "disconnected");
        if (ticTacToePlayers.has(socket.id)) {
          ticTacToePlayers.delete(socket.id);
          io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
        }
      });
  
      socket.on("startGame", (player1: Player, player2: Player) => {
        if (
          !(
            ticTacToePlayers.has(player1.socketID) &&
            ticTacToePlayers.has(player2.socketID)
          )
        ) {
          console.log("Invalid Players");
          return;
        }
        ticTacToePlayers.delete(player1.socketID);
        ticTacToePlayers.delete(player2.socketID);
  
        io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
        console.log("Game Started", player1.name, player2.name);
  
        const gameID = player1.socketID + player2.socketID;
  
        const game = new onlineGame(gameID, player1, player2);
        ticTacToeGames.set(gameID, game);
  
        io.to([player1.socketID, player2.socketID]).emit(
          "gameStarted",
          gameID,
          game
        );
      });
  
      socket.on("rematch", (player1: Player, player2: Player) => {
        console.log("Rematch Started", player1.name, player2.name);
  
        const gameID = player1.socketID + player2.socketID;
  
        const game = new onlineGame(gameID, player1, player2);
        ticTacToeGames.set(gameID, game);
  
        io.to([player1.socketID, player2.socketID]).emit(
          "rematchStarted",
          gameID,
          game
        );
      });
  
      socket.on("madeMove", (gameId: string, player: Player, pos: number) => {
        console.log("Move Made", gameId, player.name, pos);
        const game: onlineGame = ticTacToeGames.get(gameId);
        if (!game) {
          console.log("Invalid Game");
          return;
        }
        if (
          (game.currPlayer ? game.player1.socketID : game.player2.socketID) !==
          player.socketID
        ) {
          console.log("Invalid Player");
          return;
        }
        const statusCode = game.makeMove(pos);
        io.to([game.player1.socketID, game.player2.socketID]).emit(
          "moveMade",
          game,
          statusCode
        );
      });
}