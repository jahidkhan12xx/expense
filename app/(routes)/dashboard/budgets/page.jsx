"use client"
import { useUser } from '@clerk/nextjs'
import { redirect } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import BudgetList from './_components/BudgetList';

const Budgets = () => {
  const [b,setB] = useState([])
  const { user,isSignedIn,isLoaded } = useUser();


  
      if(!isLoaded){
    <h2>Loading</h2>
  }
  else if (!isSignedIn) {
    redirect("/sign-in"); 
  }
  
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl '>My Budgets</h2>
      <BudgetList b={b} setB={setB}/>
      
    </div>
  )
}

export default Budgets