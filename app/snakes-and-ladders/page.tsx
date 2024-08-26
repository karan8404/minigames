'use client'
import { useEffect, useState, useRef } from 'react';
import { OnlineGame } from './OnlineGame';
import { Player } from '../../components/Player';
export default function page() {
  const numberMapper = (i: number) => {
    const rowParity = Math.floor(i / 10) % 2;//0 -> backward, 1 -> forward
    return rowParity === 0 ? 100 - i :
      Math.ceil((100 - i) / 10) * 20 - (100 - i) - 9;
  }

  const game = new OnlineGame('game1', new Player('', 'player1', ''), new Player('', 'player2', ''));
  const board = Array.from({ length: 100 }, (_, i) => i).map(numberMapper);

  return (
    <div className='container'>
      <p>snakes and ladders</p>
      <div className='grid grid-cols-10 w-fit relative'>
        {
          board.map((number, index) => {
            return (
              <div key={index} className='border border-black h-12 w-12 flex justify-center items-center'>
                <p className=''>{number}</p>
                {/* <p>|{index}</p> */}
              </div>
            )
          })
        }
        {
          <p className='absolute left-3'>hello</p>
        }
      </div>
    </div>
  )
}
