"use client"
import { UserButton } from '@clerk/nextjs'
import { LayoutGrid, PiggyBank, ReceiptText, ShieldCheck } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

const SideNav = () => {
    const menuList = [
        { id:1, name:'Dashboard', icon:LayoutGrid, path:"/dashboard" },
        { id:2, name:'Budgets', icon:PiggyBank, path:"/dashboard/budgets" },
        { id:3, name:"Expenses", icon:ReceiptText, path:"/dashboard/expenses" },
        { id:4, name:"Upgrade", icon:ShieldCheck, path:"/dashboard/upgrade" }
    ]

    const path = usePathname()

    useEffect(()=>{
        console.log(path)
    },[])
    
    return (
        <div className='h-screen p-5 border shadow-sm'>
            <h2 className='text-xl font-semibold'><span className='font-bold text-primary text-2xl'>Ex</span>pense Tracker</h2>

            <div className='mt-5'>
                {menuList.map((menu) => (
                    <Link key={menu.id} href={menu.path}>
                    <h2 
                        
                        className={`flex gap-2 items-center font-medium p-5 cursor-pointer rounded-md mb-2 hover:text-primary hover:bg-blue-100 ${
                            path === menu.path ? 'text-primary bg-blue-100' : 'text-gray-500'
                        }`}
                    >
                        <menu.icon />
                        {menu.name}
                    </h2></Link>
                ))}
            </div>

            <div className='fixed bottom-10 p-5 flex gap-2 items-center cursor-pointer'>
                <UserButton/>
                <span className='text-gray-500 hover:text-primary'> Profile</span>
            </div>
        </div>
    )
}

export default SideNav
