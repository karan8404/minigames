'use client'
import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();
  const username = session?.user?.name as string;
  const userImage = session?.user?.image as string;

  let content;

  if (status === 'authenticated') {
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
                <Link href={'/'}>Home</Link>

                <DropdownMenu>
                  <DropdownMenuTrigger>Games</DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem><Link href={'/tic-tac-toe'}>Tic Tac Toe</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={'/snakes&ladders'}>Snake and Ladders</Link></DropdownMenuItem>
                    <DropdownMenuItem><Link href={'/flappy-bird'}>Flappy Bird</Link></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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