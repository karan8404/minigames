'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Board from '@/components/tic-tac-toe/Board';
import { useState } from "react";
import { Button } from '@/components/ui/button';
import { socket } from '@/components/socket';
import { prisma } from '@/components/prisma';
import { List } from 'postcss/lib/list';

const Page = () => {
    const { data: session, status } = useSession();
    const [userEmail, setUserEmail] = useState('');
    const [userID, setUserID] = useState('');

    const loading = status === 'loading';
    const router = useRouter();
    const [opponent, setOpponent] = useState('');
    const [gameState, setGameState] = useState('waiting');//waiting,searching,playing
    const [availablePlayers, setAvailablePlayers] = useState([]);

    useEffect(() => {
        const handleUnload = () => {
            setGameState('waiting');
            socket.emit('leaveGame', userID);
        };

        const intervalId = setInterval(() => {
            socket.emit('heartbeat', userID);
        }, 5000); // Send heartbeat every 5 seconds
    
        window.addEventListener('beforeunload', handleUnload);
    
        // Clean up the event listener
        return () => {
            window.removeEventListener('beforeunload', handleUnload);
            clearInterval(intervalId); // Stop sending heartbeats when the component unmounts
        };
    }, [userID]);

    useEffect(() => {
        if (session && session.user && session.user.email) {
            setUserEmail(session.user.email);
            fetch(`/api/getUser?email=${encodeURIComponent(session.user.email)}`)
                .then(res => res.json())
                .then(data => {
                    setUserID(data.userID);
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
            socket.emit('leaveGame', userID);
        }
        if (gameState === 'searching') {
            socket.on('availablePlayers', (ticTacToePlayers) => {
                setAvailablePlayers(ticTacToePlayers);
                console.log('availablePlayers:', ticTacToePlayers);
            });
        }
        return () => {
            socket.off('availablePlayers');
        }
    }, [gameState]);

    if (loading) {
        return <div className='container'>
            Loading...
        </div>;
    }

    const searchPlayers = () => {
        console.log('searching for players', userEmail);
        setGameState('searching');
        socket.emit('searching', userID);
    }

    const playAgainst = (opponentID: string) => {
        setOpponent(opponentID);
        setGameState('playing');
        socket.emit('startGame', { userID, opponentID });
    }

    return (
        <div className='container py-5'>
            {
                <div className='flex flex-col gap-4 w-fit'>
                    <p>User ID : {userID}</p>
                    {(gameState === 'waiting' || gameState === 'searching') ?
                        <p>You are not in a Game </p> :
                        <p>You are playing against {opponent}</p>
                    }
                    {(gameState === 'waiting') &&
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
                                        {Array.from(availablePlayers).map((player: string) => {
                                            return (player != userID &&
                                                <li className='' key={player}>{player}</li>)
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