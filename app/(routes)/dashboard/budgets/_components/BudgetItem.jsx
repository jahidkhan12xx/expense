"use client"

import Link from "next/link"

const BudgetItem = ({data}) => {

    const calcProgress = () =>{
        const percent = (data.totalSpend/data.amount)*100

        return percent.toFixed(2)
    }

  return (
    <Link href={`/dashboard/expenses/${data?.id}`} >
        <div className="p-5 border-primary/20 border-2 rounded-lg hover:shadow-md hover:shadow-primary duration-300 cursor-pointer h-[170px]">
            <div className="flex gap-2 items-center justify-between ">
        <div className="flex gap-2 items-center">
            <h2 className=" p-3 bg-primary/5 text-primary rounded-full text-2xl">{data?.icon}</h2>
            <div className="">
                <h2 className="font-bold">{data?.name}</h2>
                <h2 className="text-sm text-black/80">{data?.totalItem} Item</h2>
            </div>
            
        </div>
        <h2 className="font-bold text-primary text-lg">${data?.amount}</h2>
        </div>
        <div className="mt-5 ">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs text-primary/80">${data?.totalSpend?data.totalSpend:0} Spend</h2>
                <h2 className="text-xs text-primary/80">${data?.amount-data?.totalSpend} Remaining</h2>
            </div>
            <div className="w-full bg-primary/20 h-2 rounded-full">
            <div style={{ width: `${calcProgress()}%` }} className={" bg-primary h-2 rounded-full"}>

            </div>

            </div>
        </div>

        </div>
        
    </Link>
  )
}

export default BudgetItem