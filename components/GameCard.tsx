import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"

export default function GameCard(props: Prop) {
  return (
    <div className='h-fit w-fit'>
        <Link href={props.href}>
          <Card className=''>
            <CardHeader>
              <CardTitle className='text-center'>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={props.img} alt="" className='flex items-center justify-center h-56 w-56 object-scale-down' />
            </CardContent>
          </Card>
        </Link>
    </div>
  )
}

interface Prop{
    href: string
    title: string
    img: string
}