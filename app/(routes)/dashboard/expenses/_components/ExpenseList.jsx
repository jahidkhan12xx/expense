import { db } from '@/utils/dbConfig'
import { Expenses } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Trash } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

const ExpenseList = ({expensesList,refreshData}) => {

    const deleteExpense = async(expense) =>{

        const result = await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))
        .returning()


        if(result){
            refreshData()
            toast("Deleted Successfully!")
        }
    }

    
  return (
    <div className='mt-3'>
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        <div className='grid grid-cols-4 bg-primary text-white font-bold p-2 mt-3'>
            <h2>Name</h2>
            <h2>Amount</h2>
            <h2>Date</h2>
            <h2>Action</h2>

        </div>
        {
            expensesList?.map((expenses,index)=>(
                <div key={index} className='grid grid-cols-4 my-1 bg-primary/5  hover:shadow-md duration-300 p-2'>
            <h2>{expenses?.name}</h2>
            <h2>{expenses?.amount}</h2>
            <h2>{expenses?.createdAt}</h2>
            <h2>
                <Trash onClick={()=>deleteExpense(expenses)} className= 'text-red-600 cursor-pointer hover:font-bold hover:text-red-400 duration-300'/>
            </h2>

        </div>
            ))
        }
    </div>
  )
}

export default ExpenseList