import * as Checkbox from "@radix-ui/react-checkbox"
import { Check, Trash } from "phosphor-react"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type HabitItem = {
    id: string
    title: string
    created_at: string
    habitWeekDays: number[]
}[]

export function HabitsList() {

    const [habitsList, setHabitsList] = useState<HabitItem>([])
    const [checkedWeekDays, setCheckedWeekDays] = useState<number[][]>([])

    useEffect(() => {
        api.get('habits').then(response => {
            setHabitsList(response.data)
            setCheckedWeekDays(response.data.map((habit: { habitWeekDays: number }) => (habit.habitWeekDays)))
        })
    }, [])

    async function handleToggleWeekDay(habitId: string, weekDay: number, checked: boolean, i: number) {
        
        api.patch('habits/weekdays', {
            habitId: habitId,
            weekDay: weekDay
        })
        
        let newChecked: number[][] = checkedWeekDays.map(day => (day))
        if (checked) {
            newChecked[i] = checkedWeekDays[i].filter(checkedDay => checkedDay != weekDay)
        } else {
            newChecked[i] = [...checkedWeekDays[i], weekDay]
        }
        setCheckedWeekDays(newChecked)
    }

    return (
        <div className=" text-zinc-400 text-xl mt-2 font-bold flex flex-col justify-center">
            <div className=" mr-20 flex flex-row gap-16 items-center justify-end">
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

            <div className="text-lg flex flex-col gap-3 mt-3">
                {
                    habitsList?.map((habit, index) => {
                        return (
                            <div
                                key={`${habit.title}-${index}`}
                                className="flex flex-row items-center justify-between gap-3"
                            >
                                <span className="leading-tight">
                                    {habit.title}
                                </span>
                                <div className="flex justify-end items-center gap-4">
                                    <div className="flex justify-end items-center">
                                        {
                                            weekDays.map((weekDayCheck, i) => {
                                                return (
                                                    <Checkbox.Root
                                                        key={`${weekDayCheck}-${i}`}
                                                        className='h-full
                                                        flex flex-row items-center justify-center group focus:outline-none focus:ring-2
                                                        focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background'
                                                        checked={checkedWeekDays[index].includes(i)}
                                                        onCheckedChange={() => {
                                                            handleToggleWeekDay(habit.id, i, checkedWeekDays[index].includes(i), index)
                                                        }}
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
                                    <Trash
                                        size={30}
                                    />
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}