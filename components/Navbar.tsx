'use client'

import React from 'react';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession, SignInButton, UserButton,useAuth } from '@clerk/nextjs';
import { Button } from './ui/button';
import games from '@/public/games.json';

const Navbar = () => {
  const { isLoaded, isSignedIn, session } = useSession();
  const {} = useAuth();

  let content: JSX.Element;

  if (isLoaded && isSignedIn) {
    content = (
      <UserButton showName appearance={{ variables: { colorText:"white",fontSize:"1.2rem",colorBackground:"#1f2937"},elements:{avatarBox:{height:"2rem",width:"2rem"}}}} />
    );
  } else if (!isLoaded) {
    content = (<p>Loading...</p>);
  } else {
    content = (
      <SignInButton>Sign In</SignInButton>
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