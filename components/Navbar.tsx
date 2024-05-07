'use client'

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from 'next-auth/react';
import { Button } from './ui/button';
import games from '@/public/games.json';

const Navbar = () => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const gameLinks = games.map(game => game.link);

  let content;

  if (status === 'authenticated') {
    const username = session?.user?.name as string;
    const userImage = session?.user?.image as string;
    content = (
      <div className='flex flex-row gap-3'>
        <img src={userImage} className="rounded-full h-8 w-8" alt={username} />
        <p className="text-white">Hello {username}!</p>
        <Link href={'/api/auth/signout'}>Sign Out</Link>
      </div>
    );
  } else if (status === 'loading') {
    content = <p>Loading...</p>;
  } else {
    content = (
      <div>
        <Link href={'api/auth/signin'}>Login</Link>
      </div>
    );
  }

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link href={'/'}><Button variant={'primary'}>Home</Button></Link>

                <DropdownMenu>
                  <DropdownMenuTrigger>Games</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {games.map(game => (
                      <Link href={game.link} key={game.id}>
                        <DropdownMenuItem key={game.id}>
                          <Button>
                            {game.title}
                          </Button>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {gameLinks.includes(pathname) && (
                  <Link href={`${pathname}/online`}>
                    <Button variant={'primary'}>Online</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          {content}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;