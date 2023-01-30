import * as Checkbox from "@radix-ui/react-checkbox"
import * as Dialog from "@radix-ui/react-dialog"
import { Check, Trash, X } from "phosphor-react"
import React, { useState } from "react"
import { api } from "../lib/axios"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

type Habit = {
    id: string
    title: string
    created_at: string
    habitWeekDays: number[]
}

interface HabitsListItemProps {
    habit: Habit,
    index: number,
    handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

export function HabitsListItem({ habit, index, handleClick }: HabitsListItemProps) {

    const [checkedWeekDays, setCheckedWeekDays] = useState<number[]>(habit.habitWeekDays)

    async function handleToggleWeekDay(habitId: string, weekDay: number, checked: boolean, i: number) {

        api.patch('habits/weekdays', {
            habitId: habitId,
            weekDay: weekDay
        })

        if (checked) {
            setCheckedWeekDays(checkedWeekDays.filter(checkedDay => checkedDay != weekDay))
        } else {
            setCheckedWeekDays([...checkedWeekDays, weekDay])
        }
    }

    return (
        <div
            key={`${habit.title}-${index}`}
            className="flex flex-row items-center justify-between gap-3 "
        >
            <span className="leading-tight">
                {habit.title}
            </span>
            <div className="flex items-center">
                <div className="flex mr-12">
                    {
                        weekDays.map((weekDayCheck, i) => {
                            return (
                                <Checkbox.Root
                                    key={`${weekDayCheck}-${i}`}
                                    className='h-full flex justify-center
                                                        group focus:outline-none focus:ring-2
                                                        focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background'
                                    checked={checkedWeekDays.includes(i)}
                                    onCheckedChange={() => {
                                        handleToggleWeekDay(habit.id, i, checkedWeekDays.includes(i), index)
                                    }}
                                >
                                    <div className='
                                                        bg-zinc-700 
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
                <Dialog.Root>
                    <Dialog.Trigger
                        className="absolute right-4 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
                        type="button"
                    >
                        <Trash size={24} />
                    </Dialog.Trigger>
                    <Dialog.Portal>
                        <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />
                        <Dialog.Content className='absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-lg top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                            flex flex-col items-center justify-center gap-3'
                        >
                            <Dialog.Close
                                className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
                            >
                                <X size={24} aria-label="Fechar" />
                            </Dialog.Close>
                            <span className='font-semibold text-2xl text-zinc-200'>Deletar   hábito - {habit.title}?</span>
                            <span className='font-light text-lg text-zinc-200 mt-4'>Essa ação é irreversível</span>
                            <Dialog.Close
                                type="button"
                                className="bg-red-600 focus:outline-none focus:ring focus:ring-red-900 focus:ring-offset-1 focus:ring-offset-background"
                                onClick={ handleClick }
                            >
                                Deletar
                            </Dialog.Close>

                        </Dialog.Content>
                    </Dialog.Portal>
                </Dialog.Root>
            </div>
        </div>
    )
}