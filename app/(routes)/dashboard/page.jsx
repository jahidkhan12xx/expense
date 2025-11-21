"use client"
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardInfo from "./_components/CardInfo";
import { db } from "@/utils/dbConfig";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseList from "./expenses/_components/ExpenseList";
import { toast } from "sonner";

const Dashboard = () => {
  const [budgetList, setBudgetList] = useState([]);
  const [expensesList,setExpensesList] = useState([])
  const [loadingBudgets, setLoadingBudgets] = useState(true); // new state
  const route = useRouter()

  const { user, isSignedIn, isLoaded } = useUser();

  // All hooks at the top
  useEffect(() => {
  if (isLoaded && !isSignedIn) {
    redirect("/sign-in");
  }

  // Redirect only **after budgets are loaded**
  if (!loadingBudgets && budgetList.length === 0) {
    toast.warning("First Make Some Budgets");
    route.replace("/dashboard/budgets");
  }
}, [isLoaded, isSignedIn, budgetList, loadingBudgets]);


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
    setLoadingBudgets(false);
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
    <div className="p-8">
      <h2 className="font-bold text-3xl">Hi, {user?.fullName} 👏</h2>
      <p className="text-gray-500">
        Here's what happening with your money, Let's manage your expense
      </p>
      <CardInfo budgetList={budgetList} />

      <div className="grid grid-cols-1 md:grid-cols-3 mt-6 gap-5">

        <div className="md:col-span-2">
          <BarChartDashboard budgetList={budgetList}/>

          

          <ExpenseList expensesList={expensesList} refreshData={()=>getBudgetList()}/>
        </div>
        <div className="grid gap-5">
          <h2 className="text-lg font-bold">Latest Budgets</h2>
          {
            budgetList?.map((item,index)=>(
              <BudgetItem data={item} key={index}/>
            ))
          }
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
