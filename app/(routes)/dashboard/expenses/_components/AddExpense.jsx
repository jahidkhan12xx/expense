"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/utils/dbConfig";
import { Budgets, Expenses } from "@/utils/schema";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

const AddExpense = ({budgetId,user,refreshData}) => {

    const [name,setName] = useState("");
    const [amount,setAmount] = useState("")
    const [loading,setLoading] = useState(false)

    const addNewExpense = async() =>{
      setLoading(true)
        const result = await db.insert(Expenses).values({
            name:name,
            amount:amount,
            budgetId:budgetId,
            createdAt:moment().format('DD/MM/yyy')
            
        }).returning({insertedId:Budgets.id})
        console.log(result)

        if(result){
          setLoading(false)
            refreshData()
            toast("New Expense Added")
            setName("")
            setAmount("")
            
        }
        setLoading(false)
    }
  return (
    <div className="border-2 border-primary/20 p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
     
        <div className="mt-2">
          <Label htmlFor="budget_name" className="text-black font-medium my-1">Expense Name</Label>
          <Input
            id="name"
            name="name"
            value={name}
            placeholder="e.g. Bedroom Decor"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <Label htmlFor="budget_amount" className="text-black font-medium my-1">Expense Amount</Label>
          <Input
            id="amount"
            name="amount"
            value={amount}
            placeholder="e.g. 1000"
            type="number"
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <Button onClick={()=>addNewExpense()} disabled={!(name&&amount)} className="mt-3 w-full">
          {loading? <Loader className="animate-spin"/>: "Add New Expense"}
        </Button>
      </div>
    
  );
};

export default AddExpense;
