"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import ExpenseList from './_components/ExpenseList';

const Expense = () => {
    const {user} = useUser()
    const [budgetList,setBudgetList] = useState([])
    const [expensesList,setExpensesList] = useState([])

      useEffect(() => {
        if (user?.primaryEmailAddress?.emailAddress) {
          getBudgetList();
        }
      }, [user]);
    const getBudgetList = async () => {
        const result = await db
          .select({
            ...getTableColumns(Budgets),
            totalSpend: sql`SUM(CAST(${Expenses.amount} AS INTEGER))`.mapWith(Number),
            totalItem: sql`count(${Expenses.id})`.mapWith(Number),
          })
          .from(Budgets)
          .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
          .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
          .groupBy(
            Budgets.id,
            Budgets.name,
            Budgets.amount,
            Budgets.icon,
            Budgets.createdBy
          )
          .orderBy(desc(Budgets.id));
    
        setBudgetList(result);
        getAllExpenses()
      };
    
      const getAllExpenses = async()=>{
        const result = await db.select({
          id:Expenses.id,
          name:Expenses.name,
          amount:Expenses.amount,
          createdAt:Expenses.createdAt
        }).from(Budgets)
        .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
        .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
        .orderBy(desc(Expenses.id))
    
        setExpensesList(result)
      }
    
  return (
    <div className='p-5'>
        {expensesList.length > 0 ? (
        <div className="mt-4">
          
          <ExpenseList
            refreshData={() => getBudgetInfo()}
            expensesList={expensesList}
          />
        </div>
      ) : (
        <h2 className="text-xl font-bold mt-5 ">No Expenses Made yet</h2>
      )}
    </div>
  )
}

export default Expense