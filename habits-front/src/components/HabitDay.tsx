import * as Checkbox from '@radix-ui/react-checkbox'
import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { Check, Cursor } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'
import { ProgressBar } from './ProgressBar'

interface HabitProp {
    past: boolean
    date: Date
    amount?: number
    completed?: number
    id?: string
}
type PossibleHabits = {
    id: string
    title: string
    created_at: Date
}[]
type CompletedHabits = {
    id: string
}[]
type DayHabits = {
    possibleHabits: PossibleHabits
    completedHabits: CompletedHabits
}

export function HabitDay({ past, date, amount = 0, completed = 0, id = '' }: HabitProp) {

    const [habits, setHabits] = useState<DayHabits>()

    async function getHabits() {
        await api.get(`day?date=${date}`).then(response => {
            setHabits(response.data)
        })

    }
    let completedPercentage = Math.round((completed / amount) * 100)
    let pastStyle = {
        opacity: `1`
    }
    if (!past || amount == 0) {
        pastStyle = {
            opacity: `0.4`
        }
        completedPercentage = 0
    }

    return (
        <Popover.Root
            onOpenChange={() => getHabits()}
        >
            <Popover.Trigger
                className={clsx('h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg', {
                    'bg-violet-900 border-violet-700': completedPercentage >= 20,
                    'bg-violet-800 border-violet-600': completedPercentage >= 40,
                    'bg-violet-700 border-violet-500': completedPercentage >= 60,
                    'bg-violet-600 border-violet-400': completedPercentage >= 80,
                })}
                style={pastStyle} />
            <Popover.Portal>
                <Popover.Content className='min-w-[320px] w-full p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>{dayjs(date).format('dddd')}</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayjs(date).format('DD/MM')}</span>

                    <ProgressBar progress={completedPercentage} />
                    <div className='mt-6 flex flex-col gap-3'>
                        {habits?.possibleHabits.map((habit, i) => {
                            return (
                                <Checkbox.Root
                                key={`${habit}-${i}`}
                                className='flex items-center gap-3 group'>
                                    <div
                                        className='
                                h-8 w-8 bg-zinc-900 border-2 border-zinc-700
                                rounded-lg flex items-center justify-center
                                group-data-[state=checked]:bg-green-600'
                                    >
                                        <Checkbox.Indicator>
                                            <Check size={20} className='text-white' />
                                        </Checkbox.Indicator>
                                    </div>
                                    <span className='font-semibold text-xl leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'>
                                        {habit.title}
                                    </span>
                                </Checkbox.Root>

                            )
                        })}
                    </div>


                    <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}