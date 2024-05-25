import React from 'react'
import GameCard from '@/components/GameCard'
import games from '@/public/games.json'

export default function page() {
  return (
    <div>
      <div className='flex flex-col items-center gap-8 mx-16 my-32 md:flex-row'>
        {games.map(game => (
          <GameCard key={game.id} href={game.link} title={game.title} img={game.image} />
        ))}
      </div>
    </div>
  )
}