import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native"
import clsx from "clsx"
import { GenerateProgress } from "../utils/GenerateProgress"
import dayjs from "dayjs"

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface HabitProp extends TouchableOpacityProps{
    amount?: number
    completed?: number
    date: Date
    past: boolean
}

export function HabitDay({amount = 0, completed = 0, date,past, ...rest}: HabitProp) {
    const progress = amount > 0? GenerateProgress(amount, completed) : 0
    console.log(progress)
    const today = dayjs().startOf('day').toDate()
    const isCurrentDay = dayjs(today).isSame(date)
    return (
        <TouchableOpacity
            className={clsx("bg-zinc-900 rounded-lg border-2 m-1 border-zinc-600", {
                "opacity-100": past,
                "opacity-50": !past,
                "bg-violet-800 border-violet-800": progress > 20,
                "bg-violet-800 border-violet-700": progress > 40,
                "bg-violet-600 border-violet-600": progress > 60,
                "bg-violet-400 border-violet-500": progress > 80,
                "border-green-600" : isCurrentDay
            })}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            {...rest}
        />
    )
}