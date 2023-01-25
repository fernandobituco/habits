import * as Checkbox from "@radix-ui/react-checkbox"
import { Check } from "phosphor-react"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type HabitItem = {
    id: string
    title: string
    created_at: string
    habitWeekDays: {
        week_day: number
    }[]
}

export function HabitsList() {

    const [habitsList, setHabitsList] = useState<HabitItem[]>([])

    useEffect(() => {
        api.get('habits').then(response => {
            setHabitsList(response.data)
        })
    }, [])

    return (
        <div className=" text-zinc-400 text-xl mt-2 font-bold flex flex-col justify-center">
            <div className=" mr-24 flex flex-row gap-16 items-center justify-end">
                {
                    weekDays.map((weekDay, i) => {
                        return (
                            <div key={i}>
                                {weekDay}
                            </div>
                        )
                    })
                }
            </div>

            <div className="text-lg flex flex-col gap-3 mt-3 mr-16">
                {
                    habitsList.map((habit, id) => {
                        return (
                            <div
                                key={`${habit.title}-${id}`}
                                className="flex flex-row items-center justify-between gap-3"
                            >
                                <span className="leading-tight">
                                    {habit.title}
                                </span>
                                <div className="flex justify-end items-center">
                                    {
                                        weekDays.map((weekDayCheck, i) => {
                                            let checkedDay = false
                                            {
                                                habit.habitWeekDays.map(habitWeekDay => {
                                                    if (habitWeekDay.week_day == i) {
                                                        checkedDay = true
                                                    }
                                                })
                                            }
                                            return (
                                                <Checkbox.Root
                                                    key={i}
                                                    className='h-full
                                                        flex flex-row items-center justify-center group focus:outline-none focus:ring-2
                                                        focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background'
                                                    checked={checkedDay}
                                                >
                                                    <div className='
                                                        bg-zinc-700 flex items-center justify-center
                                                        rounded-lg border-2 border-zinc-600 h-8 w-8
                                                         group-data-[state=checked]:bg-green-600 transition-colors
                                                    '>
                                                    <Checkbox.Indicator >
                                                        <Check size={30} className='text-white' />
                                                    </Checkbox.Indicator>
                                                    </div>
                                                </Checkbox.Root>
                                            )
                                        })
                                        
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}