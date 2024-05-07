import React from 'react'
import GameCard from '@/components/GameCard'
import games from '@/public/games.json'

export default function page() {
  return (
    <div>
      <div className='grid grid-cols-4 gap-8 mx-16 my-32'>
        {games.map(game => (
          <GameCard key={game.id} href={game.link} title={game.title} img={game.image} />
        ))}
      </div>
    </div>
  )
}