"use client"
import { Button } from '@/components/ui/button'
import { UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const Header = () => {

  const {user,isSignedIn} = useUser()
  return (
    <div className='flex justify-between items-center shadow-sm border-b p-5'>
       <h2 className='text-xl font-semibold'><span className='font-bold text-primary text-2xl'>Ex</span>pense Tracker</h2>

       {
        isSignedIn?<UserButton/>:<Link href="/dashboard"><Button className="">Get Started</Button></Link>
       }

        
    </div>
  )
}

export default Header