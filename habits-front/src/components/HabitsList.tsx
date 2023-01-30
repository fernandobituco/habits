import * as Checkbox from "@radix-ui/react-checkbox"
import { Check, Trash } from "phosphor-react"
import { useEffect, useState } from "react"
import { api } from "../lib/axios"
import { HabitsListItem } from "./HabitsListItem"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type HabitItem = {
    id: string
    title: string
    created_at: string
    habitWeekDays: number[]
}[]

export function HabitsList() {

    const [habitsList, setHabitsList] = useState<HabitItem>([])

    useEffect(() => {
        api.get('habits').then(response => {
            setHabitsList(response.data)
        })
    }, [])

    async function deleteHabit(id: string) {
        await api.delete('habits', {
            params: {
                habitId: id
            }
        })
        setHabitsList(habitsList.filter(habit => habit.id != id))
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
                            <HabitsListItem
                                habit={habit}
                                index={index}
                                key={`${habit}-${index}`}
                                handleClick={(handleClick) => {
                                    deleteHabit(habit.id)
                                }}
                            />
                        )
                    })
                }
            </div>
        </div>
    )
}