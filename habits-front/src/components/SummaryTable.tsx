import dayjs from "dayjs"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { generateRange } from "../utils/GenerateRangeByYear"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const dates = generateRange()

type Summary = {
    id: string;
    date: Date;
    amount: number;
    completed: number;
}[]

export function SummaryTable() {

    const [summary, setSummary] = useState<Summary>([])

    useEffect(() => {
        api.get('summary').then(response => {
            setSummary(response.data)
        })
    }, [])
    
    return (
        <div className='w-full flex'>
            <div className='grid grid-rows-7 grid-flow-row gap-3'>
                {weekDays.map((weekDay, i) => {
                    return (
                        <div
                            key={i}
                            className='text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center'>
                            {weekDay}
                        </div>
                    )
                })}
            </div>
            <div className='grid grid-rows-7 grid-flow-col gap-3'>
                {summary.length > 0 && dates.map((date, i) => {
                    const dayInDates = summary.find(day => {
                        return dayjs(date.date).isSame(day.date)
                    })
                    return (
                        <div key={i}>
                            <HabitDay
                                id={dayInDates?.id}
                                past={date.past}
                                date={date.date}
                                amount={dayInDates?.amount}
                                defaultCompleted={dayInDates?.completed} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}