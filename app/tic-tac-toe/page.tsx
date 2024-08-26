'use client'
import { useEffect, useState } from 'react';
import { useSession } from '@clerk/nextjs'
import { Player } from '@/components/Player';
import { OnlineGame } from '@/app/tic-tac-toe/OnlineGame';
import { Button } from '@/components/ui/button';
import { socket } from '@/socket';
import { GameState } from '@/components/interfaces/GameState';
import { MatchMakingHandler, GameOverHandler } from '@/components/MultiplayerHandler';

const Page = () => {
  const { session, isLoaded, isSignedIn } = useSession();
  const [player, setPlayer] = useState<Player>(new Player('', '', ''));
  const [Game, setGame] = useState<OnlineGame>();
  const [opponent, setOpponent] = useState<Player>();
  const [gameState, setGameState] = useState<GameState>(GameState.WAITING);
  const [availablePlayers, setAvailablePlayers] = useState<Map<string, Player>>();

  const [statusCode, setStatusCode] = useState<number>(0);

  const getGameStatus = (statusCode: number) => {
    if (!Game && statusCode === 0) {
      return ('test');
    }
    switch (statusCode) {
      case 0:
        if ((Game.currPlayer ? Game.player1.email === player.email : Game.player2.email === player.email)) {
          return ('Game is On , Your Turn');
        }
        else {
          return ('Game is On , Opponent\'s Turn');
        }
      case 1:
        if (Game.player1.email === player.email) {
          return ('You Win');
        }
        else {
          return ('Opponent Wins');
        }
        break;
      case 2:
        if (Game.player1.email === player.email) {
          return ('Opponent Wins');
        }
        else {
          return ('You Win');
        }
      case 3:
        return ('Draw');
      case -1:
        return ('Invalid Move')
      default:
        return ('');
    }
  }

  useEffect(() => {
    setPlayer(prevPlayer => new Player(socket.id, prevPlayer.name, prevPlayer.email));
  }, [socket]);

  useEffect(() => {//gets userID and userName
    if (!isSignedIn)
      return;

    setPlayer(new Player(socket.id, session.user.username, session.user.primaryEmailAddress.emailAddress));
  }, [session]);

  useEffect(() => {
    console.log('gameState:', gameState);
    if (gameState === GameState.WAITING) {
      socket.emit('leaveGame');
    }
    if (gameState === GameState.SEARCHING) {

      socket.on('availablePlayers', (ticTacToePlayers) => {
        setAvailablePlayers(new Map(Object.entries(ticTacToePlayers)));
        console.log('availablePlayers:', ticTacToePlayers);
      });

      socket.on('gameStarted', (gameID: string, game: OnlineGame) => {
        setStatusCode(0);
        console.log('gameStarted:', gameID, game);
        console.log(typeof game.player1, typeof game.player2);
        socket.emit('join', gameID);

        setGame(game);
        setOpponent(game.player1.email === player.email ? game.player2 : game.player1);
        setGameState(GameState.PLAYING);
      });

      socket.emit('searching', player);

      return () => {
        socket.off('availablePlayers');
        socket.off('gameStarted');
      };
    }
    if (gameState === GameState.PLAYING) {

      //TODO listeners during game
      socket.on('moveMade', (game: OnlineGame, statusCode: number) => {
        setGame(game);
        setStatusCode(statusCode);
      });

      socket.on('rematchStarted', (gameID: string, game: OnlineGame) => {
        setStatusCode(0);
        console.log('rematchStarted:', gameID, game);
        socket.emit('join', gameID);
        setGame(game);
        setOpponent(game.player1.email === player.email ? game.player2 : game.player1);
      });

      return () => {
        socket.off('moveMade');
        socket.off('rematchStarted');
      };
    }
  }, [gameState]);

  if (!isLoaded || socket.disconnected) {
    return <div className='container'>
      Loading...
    </div>;
  }

  const renderSquare = (i: number) => {
    return (
      <Button className='border border-red-500 md:h-20 md:w-20 h-16 w-16' onClick={
        () => socket.emit("madeMove", Game.gameID, player, i)
      }>{Game.board[i]}
      </Button>
    );
  }

  const searchPlayers = () => {
    console.log('searching for players', player);
    setGameState(GameState.SEARCHING);

  }

  const playAgainst = (opponentPlayer: Player) => {
    console.log('play against:', opponentPlayer);
    socket.emit('startGame', player, opponentPlayer)
  }

  const rematch = (opponentPlayer: Player) => {
    console.log('rematch:', opponentPlayer);
    socket.emit('rematch', player, opponentPlayer);
  }

  return (
    <div className='container py-5'>
      <div className='flex flex-col gap-4 items-center'>
        <MatchMakingHandler gameState={gameState} setGameState={setGameState} player={player} opponent={opponent} socket={socket}
          searchPlayers={searchPlayers} availablePlayers={availablePlayers} playAgainst={playAgainst} />
        {
          (gameState === GameState.PLAYING && getGameStatus(statusCode) != "") &&
          <div className="flex flex-col gap-5 items-center justify-center w-screen mt-10">
            <div>You are playing as {
              (Game.currPlayer ? Game.player1.email === player.email : Game.player2.email === player.email) ? Game.currChar : (Game.currChar === 'X' ? 'O' : 'X')
            }</div>
            <div className='status'>{getGameStatus(statusCode)}</div>
            <div>
              <div className='flex flex-row'>
                {renderSquare(0)}
                {renderSquare(1)}
                {renderSquare(2)}
              </div>
              <div className='flex flex-row'>
                {renderSquare(3)}
                {renderSquare(4)}
                {renderSquare(5)}
              </div>
              <div className='flex flex-row'>
                {renderSquare(6)}
                {renderSquare(7)}
                {renderSquare(8)}
              </div>
            </div>
            <GameOverHandler isGameOver={statusCode === 1 || statusCode === 2 || statusCode === 3} leaveGame={() => setGameState(GameState.WAITING)}
              newGame={() => setGameState(GameState.SEARCHING)} rematch={() => rematch(opponent)} />
          </div>
        }
      </div>
    </div>
  );
};

export default Page;