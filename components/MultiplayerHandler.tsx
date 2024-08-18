import React from 'react'
import { Player } from './Player'
import { Socket } from 'socket.io-client'
import { GameState } from './interfaces/GameState'
import { Button } from './ui/button'

export const MatchMakingHandler = (props: MatchMakingProps) => {
    return (
        <>
            <p>User : {props.player.name}</p>
            <p>Socket ID : {props.socket.id}</p>
            {
                (props.gameState === GameState.WAITING || props.gameState === GameState.SEARCHING) ?
                    <p>You are not in a Game </p> :
                    <p>You are playing against {props.opponent.name}</p>
            }

            {
                (props.gameState === GameState.WAITING) &&
                <Button variant={'secondary'} onClick={props.searchPlayers}>Search for Users</Button>
            }

            {
                (props.gameState === GameState.SEARCHING) &&
                <div>
                    <p className='mb-5'>Searching for Users...</p>
                    {
                        <div className='border-2 border-blue-600 rounded-md p-5'>
                            <p className='mb-5'>Available Players:</p>
                            <ul className='flex flex-col bg-emerald-500 rounded-md gap-3'>
                                {Array.from(props.availablePlayers?.values() || []).map((anotherPlayer: Player) => {
                                    return (props.player.email != anotherPlayer.email &&
                                        <li className='rounded-md p-2' key={anotherPlayer.socketID}>
                                            <Button variant='outline' onClick={() => props.playAgainst(anotherPlayer)}>Play against {anotherPlayer.name}</Button>
                                        </li>)
                                })}
                            </ul>
                        </div>
                    }
                    <Button className='mt-5' variant={'secondary'} onClick={() => { props.setGameState(GameState.WAITING) }}>Cancel Search</Button>
                </div>
            }
        </>
    )
}

export const GameOverHandler = (props: GameOverProps) => {
    return (
        <>
            {props.isGameOver &&
                <div className='flex flex-col gap-3' >
                    <Button variant={'secondary'} onClick={props.leaveGame}>Leave Game</Button>
                    <Button variant={'secondary'} onClick={props.newGame}>Play against another Player</Button>
                    <Button variant={'secondary'} onClick={props.newGame}>Rematch</Button>
                </div >
            }
        </>
    )
}

interface MatchMakingProps {
    gameState: GameState,
    setGameState: (gameState: GameState) => void,
    player: Player,
    opponent: Player,
    socket: Socket,
    searchPlayers: () => void,
    availablePlayers: Map<string, Player>,
    playAgainst: (opponentPlayer: Player) => void,
}

interface GameOverProps {
    isGameOver: boolean,
    leaveGame: () => void,
    newGame: () => void,
    rematch: () => void,
}