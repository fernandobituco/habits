import { generateRange } from "../utils/GenerateRangeByYear"
import { HabitDay } from "./HabitDay"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const dates = generateRange()
export function SummaryTable() {
console.log(dates)
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
                {dates.map((date, i) => {
                    return (
                        <div key={i}>
                            <HabitDay past={date.past}/>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}