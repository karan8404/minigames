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
        <p className="hidden text-white sm:block">Hello {username}!</p>
        <Link href={'/api/auth/signout'}>Sign Out</Link>
      </div>
    );
  } else if (status === 'loading') {
    content = "Loading...";
  } else {
    content = (
      <Link href={'api/auth/signin'}>Login</Link>
    );
  }

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className=" flex items-center">
            <div className="block">
              <div className="flex items-baseline space-x-4">
                <Link href={'/'}><Button variant={'primary'}>Home</Button></Link>
                <div className='hidden sm:block'>
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
                </div>
                {gameLinks.includes(pathname) && (
                  <Link href={`${pathname}/online`}>
                    <Button variant={'primary'}>Online</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
          <div className='ml-auto'>
            {content}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;