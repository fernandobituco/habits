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
    defaultCompleted?: number
    id?: string
}

type DayHabits = {
    possibleHabits: {
        id: string
        title: string
        created_at: Date
    }[]
    completedHabits: string[]
}

export function HabitDay({ past, date, amount = 0, defaultCompleted = 0, id = '' }: HabitProp) {

    const [habits, setHabits] = useState<DayHabits>()
    const isToday = dayjs().startOf('day').isSame(date)
    const [completed, setCompleted] = useState(defaultCompleted)

    async function getHabits() {
        await api.get('day', {
            params: {
                date: date.toISOString()
            }
        }).then(response => {
            setHabits(response.data)
        })

    }

    async function toggleHabit(habitId: string) {
        let completedHabits: string[] = habits!.completedHabits
        const isHabitChecked = completedHabits.includes(habitId)

        console.log(id, date.toISOString())
        await api.patch('habits', {
            id: habitId,
            date: date.toISOString()
        })

        if (isHabitChecked) {
            completedHabits = completedHabits.filter(id => id != habitId)
        } else {
            completedHabits = [...completedHabits, habitId]
        }
        setHabits({
            possibleHabits: habits!.possibleHabits,
            completedHabits: completedHabits
        })
        setCompleted(completedHabits.length)
    }

    let completedPercentage = amount > 0 ? Math.round((completed / amount) * 100) : 0
    let pastStyle = {
        opacity: `1`
    }
    if (!past) {
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
                className={clsx('h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background', {
                    'bg-violet-900 border-violet-700': completedPercentage >= 20,
                    'bg-violet-800 border-violet-600': completedPercentage >= 40,
                    'bg-violet-700 border-violet-500': completedPercentage >= 60,
                    'bg-violet-600 border-violet-400': completedPercentage >= 80,
                    'border-green-400': isToday
                })}
                style={pastStyle} />
            <Popover.Portal>
                <Popover.Content className='min-w-[320px] w-full p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>{dayjs(date).format('dddd')}</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>{dayjs(date).format('DD/MM')}</span>

                    <ProgressBar progress={completedPercentage} />
                    <div className='mt-6 flex flex-col gap-3 '>
                        {habits?.possibleHabits.map((habit, i) => {
                            return (
                                <Checkbox.Root
                                    key={`${habit}-${i}`}
                                    className='flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background'
                                    checked={habits.completedHabits.includes(habit.id)}
                                    onCheckedChange={() => {
                                        toggleHabit(habit.id)
                                    }}>
                                    <div
                                        className='
                                h-8 w-8 bg-zinc-900 border-2 border-zinc-700
                                rounded-lg flex items-center justify-center
                                group-data-[state=checked]:bg-green-600 transition-colors
                                '
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