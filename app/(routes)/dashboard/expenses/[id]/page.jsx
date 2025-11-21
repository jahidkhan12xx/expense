"use client";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useUser } from "@clerk/nextjs";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseList from "../_components/ExpenseList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenBox, Trash } from "lucide-react";
import { toast } from "sonner";
import EditBudget from "../_components/EditBudget";

const ExpensesComp = () => {
  const params = useParams();
  const { user, isLoaded } = useUser();
  const route = useRouter()
  const [expensesList, setExpensesList] = useState([]);
  const [budgetInfo, setBudgetInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const getBudgetInfo = async () => {
    setLoading(true);
    try {
      const result = await db
        .select({
          ...getTableColumns(Budgets),
          totalSpend: sql`SUM(CAST(${Expenses.amount} AS INTEGER))`.mapWith(
            Number
          ),
          totalItem: sql`COUNT(${Expenses.id})`.mapWith(Number),
        })
        .from(Budgets)
        .leftJoin(Expenses, eq(Budgets.id, Expenses.budgetId))
        .where(eq(Budgets.createdBy, user?.primaryEmailAddress?.emailAddress))
        .where(eq(Budgets.id, params.id))
        .groupBy(
          Budgets.id,
          Budgets.name,
          Budgets.amount,
          Budgets.icon,
          Budgets.createdBy
        );

      setBudgetInfo(result[0]);
      getExpensesList();
    } catch (err) {
      console.error("Error fetching budget:", err);
    } finally {
      setLoading(false);
    }
  };

  const getExpensesList = async () => {
    const result = await db
      .select()
      .from(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .orderBy(desc(Expenses.id));

    setExpensesList(result);

    console.log(result);
  };

  const deleteBudget = async()=>{

    const delExpense = await db.delete(Expenses)
    .where(eq(Expenses.budgetId,params.id))
    .returning()

    if(delExpense){
        const result = await db.delete(Budgets)
    .where(eq(Budgets.id,params.id))
    .returning();
    console.log(result)
    }

    toast("Budget Deleted!")
    route.replace('/dashboard/budgets')

    

    
  }

  useEffect(() => {
    if (!isLoaded || !user || !params.id) return;

    getBudgetInfo();
  }, [isLoaded, user, params.id]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold mb-5 flex justify-between items-center">
        <span className="flex gap-2 items-center">
            <ArrowLeft onClick={()=>route.back()} className="cursor-pointer"/>
            My Expenses
        </span>
        <div className="flex items-center gap-2">
            <EditBudget refreshData={getBudgetInfo} budgetInfo={budgetInfo}/>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2" variant="destructive">
              <Trash /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                current budget along with expenses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={()=>deleteBudget()}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>

        
      </h2>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-2">
        {loading ? (
          <div className="h-[150px] w-full bg-primary/20 rounded-lg animate-pulse"></div>
        ) : budgetInfo ? (
          <BudgetItem data={budgetInfo} />
        ) : (
          <div>No Budget Found</div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
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
  );
};

export default ExpensesComp;
