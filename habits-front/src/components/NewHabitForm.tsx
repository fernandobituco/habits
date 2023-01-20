import * as Checkbox from "@radix-ui/react-checkbox";
import { Check } from "phosphor-react";
import { FormEvent, useEffect, useState } from "react";
import { api } from "../lib/axios";

const availableWeekDays = [
    'Domingo',
    'Segunda-Feira',
    'Terça-Feira',
    'Quarta-Feira',
    'Quinta-Feira',
    'Sexta-Feira',
    'Sábado'
]

export function NewHabitForm() {

    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])
    
    async function createNewHabit(event: FormEvent) {
        event.preventDefault()
        if (!title || weekDays.length == 0) {
            return
        }

        await api.post('habits', {
            title,
            weekDays
        })
        setTitle('')
        setWeekDays([])
        alert('Hábito criado com sucesso')
    }
    function handleToggleWeekDay(weekDay: number) {
        if(weekDays.includes(weekDay)) {
            const weekDaysLessRemoved = weekDays.filter(day => day != weekDay)
            setWeekDays(weekDaysLessRemoved)
        } else {
            const weekDaysPlusAdded = [...weekDays, weekDay]
            setWeekDays(weekDaysPlusAdded)
        }
    }

    return (
        <form onSubmit={createNewHabit} className="w-full flex flex-col mt-6">
            <label htmlFor="title" className="font-semibold leading-tight">
                Qual seu comprometimento?
            </label>
            <input
                type="text"
                id="title"
                placeholder="ex. Malhar, Beber 2L de água..."
                className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
                autoFocus
                value={title}
                onChange={event => setTitle(event.target.value)}
            />

            <label htmlFor="" className="font-semibold leading-tight mt-4">
                Qual a recorrência?
            </label>
            <div className='flex flex-col mt-1'>
                {availableWeekDays.map((weekDay, i) => {
                    return (
                        <Checkbox.Root
                            key={weekDay}
                            className='flex items-center gap-3 group'
                            onCheckedChange={ () => handleToggleWeekDay(i) }
                            checked={weekDays.includes(i)}
                        >
                            <div
                                className='
                                h-8 w-8 bg-zinc-900 border-2 border-zinc-700
                                rounded-lg flex items-center justify-center
                                group-data-[state=checked]:bg-green-600
                            '
                            >
                                <Checkbox.Indicator>
                                    <Check size={20} className='text-white' />
                                </Checkbox.Indicator>
                            </div>
                            <span className='text-white leading-tight'>
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}

            </div>

            <button type="submit" className="mt-3 rounded-lg p-4 flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500">
                <Check size={20} weight="bold" />
                Confirmar
            </button>
        </form>
    )
}