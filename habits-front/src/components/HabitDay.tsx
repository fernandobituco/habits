interface HabitProp {
    past: boolean
}

export function HabitDay(prop: HabitProp) {
    if (prop.past) {
        return (
            <div className='h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg' />
        )
    }
    return (
        <div className='h-10 w-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed' />
    )
}