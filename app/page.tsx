import React from 'react'
import GameCard from '@/components/GameCard'

export default function page() {
  return (
    <div>
      <div className='grid grid-cols-4 gap-8 mx-16 my-32'>
        <GameCard href='/tic-tac-toe' title='Tic Tac Toe' img='/tic-tac-toe.png'/>
        <GameCard href='/snakes&ladders' title='Snake and Ladders' img='/snakes-and-ladders.jpeg'/>
        <GameCard href='/flappy-bird' title='Flappy Bird' img='/flappy-bird.png'/>
      </div>
    </div>
  )
}
