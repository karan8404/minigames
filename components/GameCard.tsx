import React from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"


export default function GameCard(props: Prop) {
  return (
    <div>
        <Link href={props.href}>
          <Card>
            <CardHeader>
              <CardTitle className='text-center'>{props.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img src={props.img} alt="" className='flex items-center justify-center' />
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