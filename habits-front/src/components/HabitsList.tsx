import { useEffect, useState } from "react"
import { api } from "../lib/axios"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type HabitItem = {

}

export function HabitsList() {

    const[habitsList, setHabitsList] = useState<HabitItem>([])
    
    useEffect(() => {
        api.get('habits').then(response => {
            console.log(response.data)
        })
    }, [])

    return (
        <div className=" text-zinc-400 text-lg mt-2 h-6 w-full font-bold flex flex-row gap-5 justify-between">
            <span className="font-semibold leading-tight">
                Correr na praia
            </span>
            <div className="flex gap-3 items-center justify-end">
            {weekDays.map((weekDay, i) => {
                return (
                    <div key={i}>
                        {weekDay}
                    </div>
                )
            })}
            </div>
        </div>
    )
}