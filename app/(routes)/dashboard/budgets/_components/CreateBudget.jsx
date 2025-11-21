"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EmojiPicker from "emoji-picker-react"
import { db } from "@/utils/dbConfig"
import { Budgets } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import { toast } from "sonner"

const CreateBudget = ({ refreshData }) => {
  const [emoji, setEmoji] = useState("😃")
  const [openEmoji, setOpenEmoji] = useState(false)

  const [budgetName,setBudgetName]=useState("")
  const [budgetAmount,setBudgetAmount]= useState(0)

  const {user} = useUser()


  const onCreateBudget = async() =>{
    const result = await db.insert(Budgets)
    .values({
      name:budgetName,
      amount:budgetAmount,
      createdBy:user?.primaryEmailAddress?.emailAddress,
      icon:emoji
    }).returning({insertedId:Budgets.id})
    


    if(result){
      refreshData();
      toast('New Budget Created!')
    }
  }

  return (
    <div>
      <Dialog>
      <DialogTrigger asChild>
        <div className="flex bg-purple-100 p-10 rounded-md items-center flex-col border-2 border-dashed border-primary/20 cursor-pointer hover:shadow-md text-primary">
          <h2 className="text-3xl">+</h2>
          <h2>Create New Budget</h2>
        </div>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
          {/* Use asChild and wrap everything in a single div */}
          <DialogDescription asChild>
            <div className="mt-5">
              <Button className="text-lg" size="lg"   variant="outline" onClick={() => setOpenEmoji(!openEmoji)}>
                {emoji}
              </Button>
              <div className="absolute z-20">
                <EmojiPicker open={openEmoji} onEmojiClick={(e)=>{
                  setEmoji(e.emoji)
                  setOpenEmoji(false)
                }} />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="budget_name">Budget Name</Label>
            <Input id="budget_name" name="budget_name" placeholder="e.g. Electronics" onChange={(e)=>setBudgetName(e.target.value)}  />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="budget_amount">Amount</Label>
            <Input id="budget_amount" name="budget_amount" placeholder="e.g. 50005" type="number" onChange={(e)=>setBudgetAmount(e.target.value)}  />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
             <Button onClick={()=>onCreateBudget()} disabled={!(budgetName&&budgetAmount)}  type="submit">Create Budget</Button>
            
          </DialogClose>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default CreateBudget
