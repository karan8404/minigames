'use client'
import React, { use, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Board from '@/components/tic-tac-toe/Board';
import { Player } from '@/components/tic-tac-toe/Player';
import { onlineGame } from '@/components/tic-tac-toe/onlineGame';
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { socket } from '@/components/socket';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"


const Page = () => {
    const { data: session, status } = useSession();
    const [player, setPlayer] = useState<Player>(new Player('', '', '', ''));
    const [Game, setGame] = useState<onlineGame>();
    const loading = status === 'loading';
    const router = useRouter();
    const [opponent, setOpponent] = useState<Player>();
    const [gameState, setGameState] = useState('waiting');//waiting,searching,playing
    const [availablePlayers, setAvailablePlayers] = useState<Map<string, Player>>();

    useEffect(() => {
        setPlayer(prevPlayer => ({ ...prevPlayer, socketID: socket.id }));
    }, [socket]);

    useEffect(() => {//gets userID and userName
        if (session && session.user && typeof session.user.email === 'string') {
            const email = session.user.email;
            fetch(`/api/getUser?email=${encodeURIComponent(session.user.email)}`)
                .then(res => res.json())
                .then(data => {
                    console.log('data:', data);
                    setPlayer(prevPlayer => new Player(data.userID, socket.id, data.name, email));
                })
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
            const handleAvailablePlayers = (ticTacToePlayers) => {
                setAvailablePlayers(new Map(Object.entries(ticTacToePlayers)));
                console.log('availablePlayers:', ticTacToePlayers);
            };
            const handleGameStarted = (gameID: string, game: onlineGame) => {
                console.log('gameStarted:', gameID, game);
                socket.emit('join', gameID);

                setGame(game);
                setOpponent(game.player1.userID === player.userID ? game.player2 : game.player1);
                setGameState('playing');
            };

            socket.on('availablePlayers', handleAvailablePlayers);
            socket.on('gameStarted', handleGameStarted);
            socket.emit('searching', player);
            return () => {
                socket.off('availablePlayers', handleAvailablePlayers);
                socket.off('gameStarted', handleGameStarted);
            };
        }
        if (gameState === 'playing') {
            //TODO listeners during game
        }
    }, [gameState]);

    if (loading || socket.disconnected) {
        return <div className='container'>
            Loading...
        </div>;
    }

    const searchPlayers = () => {
        console.log('searching for players', player);
        setGameState('searching');

    }

    const playAgainst = (opponentPlayer: Player) => {
        // setOpponent(opponentID);
        // setGameState('playing');

        socket.emit('startGame', { player, opponentPlayer });
    }

    return (
        <div className='container py-5'>
            {
                <div className='flex flex-col gap-4 w-fit'>
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
                                    <ul className='flex flex-col gap-3'>
                                        {Array.from(availablePlayers?.values() || []).map((anotherPlayer: Player) => {
                                            return (player.userID != anotherPlayer.userID &&
                                                <li className='bg-slate-600 rounded-md p-2' key={anotherPlayer.userID}>
                                                    <TooltipProvider><Tooltip>
                                                        <TooltipTrigger>{anotherPlayer.name}</TooltipTrigger>
                                                        <TooltipContent>
                                                            <Button onClick={() => playAgainst(anotherPlayer)}>Play against {anotherPlayer.name}</Button>
                                                        </TooltipContent>
                                                    </Tooltip></TooltipProvider>
                                                </li>)
                                        })}
                                    </ul>
                                </div>
                            }
                            <Button className='mt-5' variant={'secondary'} onClick={() => { setGameState('waiting') }}>Cancel Search</Button>
                        </div>
                    }
                </div>
            }
        </div>
    );
};

export default Page;