"use client"
import { Button } from '@/components/ui/button'
import { PenBox } from 'lucide-react'
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
import EmojiPicker from 'emoji-picker-react'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { db } from '@/utils/dbConfig'
import { Budgets } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { toast } from 'sonner'

const EditBudget = ({budgetInfo,refreshData}) => {
      const [emoji, setEmoji] = useState(budgetInfo?.icon)
  const [openEmoji, setOpenEmoji] = useState(false)

  const [budgetName,setBudgetName]=useState(budgetInfo?.name)
  const [budgetAmount,setBudgetAmount]= useState(budgetInfo?.amount)

  console.log(budgetInfo)

  const {user} = useUser()

useEffect(() => {
  if (budgetInfo) {
    setBudgetName(budgetInfo.name);
    setBudgetAmount(budgetInfo.amount);
    setEmoji(budgetInfo.icon);
  }
}, [budgetInfo]);



  const onUpdateBudget = async() =>{

    const result = await db.update(Budgets).set({
        name:budgetName,
        amount:budgetAmount,
        icon:emoji
    }).where(eq(Budgets.id,budgetInfo.id))
    .returning()


    if(result){
        refreshData()
        toast("Budget Updated")
    }


  }
  return (
    <div>
        
        <Dialog>
      <DialogTrigger asChild>
        <Button className="flex gap-2"> <PenBox/> Edit</Button>
        
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Your Budget</DialogTitle>
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
            <Input id="budget_name" name="budget_name"
            defaultValue={budgetInfo?.name || ""} placeholder="e.g. Electronics" onChange={(e)=>setBudgetName(e.target.value)}  />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="budget_amount">Amount</Label>
            <Input id="budget_amount" name="budget_amount"
            defaultValue={budgetInfo?.amount || ""} placeholder="e.g. 50005" type="number" onChange={(e)=>setBudgetAmount(e.target.value)}  />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
             <Button onClick={()=>onUpdateBudget()} disabled={!(budgetName&&budgetAmount)}  type="submit">Update Budget</Button>
            
          </DialogClose>
         
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  )
}

export default EditBudget