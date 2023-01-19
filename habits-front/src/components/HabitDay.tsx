import * as Popover from '@radix-ui/react-popover'
import clsx from 'clsx'
import { Cursor } from 'phosphor-react'
import { ProgressBar } from './ProgressBar'

interface HabitProp {
    past: boolean
    amount: number
    completed: number
}

export function HabitDay(prop: HabitProp) {

    let completedPercentage = Math.round((prop.completed/prop.amount) * 100)
    let pastStyle = {
        opacity: `1`
    }
    if (!prop.past) {
        pastStyle = {
            opacity: `0.4`
        }
        completedPercentage = 0
    }
    return (
        <Popover.Root>
            <Popover.Trigger
            className={clsx('h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg', {
                'bg-violet-900 border-violet-700': completedPercentage >= 20,
                'bg-violet-800 border-violet-600': completedPercentage >= 40,
                'bg-violet-700 border-violet-500': completedPercentage >= 60,
                'bg-violet-600 border-violet-400': completedPercentage >= 80,
            })}
            style={pastStyle}/>
            <Popover.Portal>
                <Popover.Content className='min-w-[320px] w-full p-6 rounded-2xl bg-zinc-900 flex flex-col'>
                    <span className='font-semibold text-zinc-400'>dia da semana</span>
                    <span className='mt-1 font-extrabold leading-tight text-3xl'>00/00</span>
                    <ProgressBar progress={completedPercentage} />
                    <Popover.Arrow height={8} width={16} className='fill-zinc-900' />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}