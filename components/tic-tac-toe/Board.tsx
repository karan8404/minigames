'use client'
import { useState } from "react"
import React from 'react'
import { Button } from "@/components/ui/button"


const Board = () => {
    const [squares, setSquares] = useState(Array(9).fill(''))
    const [player, setPlayer] = useState('X')

    const handleClick = (i: number) => {
        const newSquares = squares.slice()
        if (newSquares[i] || calculateWinner(newSquares)) {
            return
        }
        newSquares[i] = player
        setSquares(newSquares)
        setPlayer(player === 'X' ? 'O' : 'X')
    }

    const renderSquare = (i: number) => {
        return <button className='border border-red-500 md:h-20 md:w-20 h-16 w-16' onClick={() => handleClick(i)}>{squares[i]}</button>
    }

    const resetBoard = () => {
        setSquares(Array(9).fill(null));
        setPlayer('X');
    }

    return (
        <div className="container flex flex-col gap-5 items-center justify-center min-h-screen">
            <div className='status'>{calculateWinner(squares) ? 'Winner: ' + calculateWinner(squares) : 'Next player: ' + player}</div>
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
            <Button variant="primary" onClick={resetBoard}>Reload</Button>

        </div>
    )
}

const calculateWinner = (squares: string[]) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}

export default Board