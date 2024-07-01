'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Player } from '@/components/tic-tac-toe/Player';
import { onlineGame } from '@/components/tic-tac-toe/onlineGame';
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { socket } from '@/socket';


const Page = () => {
    const { data: session, status } = useSession();
    const [player, setPlayer] = useState<Player>(new Player('', '', ''));
    const [Game, setGame] = useState<onlineGame>();
    const loading = status === 'loading';
    const router = useRouter();
    const [opponent, setOpponent] = useState<Player>();
    const [gameState, setGameState] = useState('waiting');//waiting,searching,playing
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
        if (session && session.user && typeof session.user.email === 'string') {
            const email = session.user.email;
            setPlayer(new Player(socket.id, session.user.name, email));
        }
    }, [session]);

    useEffect(() => {
        if (!loading && !session) {
            router.push('/api/auth/signin');
        }
    }, [session, loading]);

    useEffect(() => {
        console.log('gameState:', gameState);
        if (gameState === 'waiting') {
            socket.emit('leaveGame');
        }
        if (gameState === 'searching') {

            socket.on('availablePlayers', (ticTacToePlayers) => {
                setAvailablePlayers(new Map(Object.entries(ticTacToePlayers)));
                console.log('availablePlayers:', ticTacToePlayers);
            });

            socket.on('gameStarted', (gameID: string, game: onlineGame) => {
                setStatusCode(0);
                console.log('gameStarted:', gameID, game);
                console.log(typeof game.player1, typeof game.player2);
                socket.emit('join', gameID);

                setGame(game);
                setOpponent(game.player1.email === player.email ? game.player2 : game.player1);
                setGameState('playing');
            });

            socket.emit('searching', player);

            return () => {
                socket.off('availablePlayers');
                socket.off('gameStarted');
            };
        }
        if (gameState === 'playing') {

            //TODO listeners during game
            socket.on('moveMade', (game: onlineGame, statusCode: number) => {
                setGame(game);
                setStatusCode(statusCode);
            });

            socket.on('rematchStarted', (gameID: string, game: onlineGame) => {
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

    if (loading || socket.disconnected) {
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
        setGameState('searching');

    }

    const playAgainst = (opponentPlayer: Player) => {
        console.log('play against:', opponentPlayer);
        // setOpponent(opponentPlayer);
        // setGameState('playing');
        socket.emit('startGame', player, opponentPlayer)
    }

    const rematch = (opponentPlayer: Player) => {
        console.log('rematch:', opponentPlayer);
        socket.emit('rematch', player, opponentPlayer);
    }

    return (
        <div className='container py-5'>
            {
                <div className='flex flex-col gap-4 items-center'>
                    <p>User : {player.name}</p>
                    <p>Socket ID : {socket.id}</p>
                    {
                        (gameState === 'waiting' || gameState === 'searching') ?
                            <p>You are not in a Game </p> :
                            <p>You are playing against {opponent.name}</p>
                    }

                    {
                        (gameState === 'waiting') &&
                        <Button variant={'secondary'} onClick={searchPlayers}>Search for Users</Button>
                    }

                    {
                        (gameState === 'searching') &&
                        <div>
                            <p className='mb-5'>Searching for Users...</p>
                            {
                                <div className='border-2 border-blue-600 rounded-md p-5'>
                                    <p className='mb-5'>Available Players:</p>
                                    <ul className='flex flex-col bg-emerald-500 rounded-md gap-3'>
                                        {Array.from(availablePlayers?.values() || []).map((anotherPlayer: Player) => {
                                            return (player.email != anotherPlayer.email &&
                                                <li className='rounded-md p-2' key={anotherPlayer.socketID}>
                                                    <Button variant='outline' onClick={() => playAgainst(anotherPlayer)}>Play against {anotherPlayer.name}</Button>
                                                </li>)
                                        })}
                                    </ul>
                                </div>
                            }
                            <Button className='mt-5' variant={'secondary'} onClick={() => { setGameState('waiting') }}>Cancel Search</Button>
                        </div>
                    }
                    {
                        (gameState === 'playing' && getGameStatus(statusCode) != "") &&
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
                            {
                                statusCode === 1 || statusCode === 2 || statusCode === 3 ?
                                    <div className='flex flex-col gap-3'>
                                        <Button variant={'secondary'} onClick={() => setGameState('waiting')}>Leave Game</Button>
                                        <Button variant={'secondary'} onClick={() => setGameState('searching')}>Play against another Player</Button>
                                        <Button variant={'secondary'} onClick={() => rematch(opponent)}>Rematch</Button>
                                    </div> : <></>
                            }
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Page;