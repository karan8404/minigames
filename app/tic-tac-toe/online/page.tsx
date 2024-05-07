'use client'
import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Board from '@/components/tic-tac-toe/Board';
import { useState } from "react";
import { Button } from '@/components/ui/button';

const Page = () => {
    const { data: session, status } = useSession();
    const loading = status === 'loading';
    const router = useRouter();
    const [opponent, setOpponent] = useState('');

    useEffect(() => {
        if (!loading && !session) {
            router.push('/api/auth/signin');
        }
    }, [session, loading]);

    if (loading) {
        return <div className='container'>
            Loading...
        </div>;
    }

    return (
        <div className='container py-5'>
            {
                (opponent === '') ?
                    <div className='flex flex-col gap-4 w-fit'>
                        <p>You are not in a Game</p>
                        <Button variant={'secondary'}>Search for Users</Button>
                    </div> :
                    <Board />
            }
        </div>
    );
};

export default Page;