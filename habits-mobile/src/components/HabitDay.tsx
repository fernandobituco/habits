import { TouchableOpacity, Dimensions, TouchableOpacityProps } from "react-native"
import clsx from "clsx"

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5)

interface HabitProp extends TouchableOpacityProps{
    past: boolean
}

export function HabitDay({past, ...rest}: HabitProp) {
    return (
        <TouchableOpacity
            className={clsx("bg-zinc-900 rounded-lg border-2 m-1 border-zinc-600", {
                "opacity-100": past,
                "opacity-50": !past
            })}
            style={{ width: DAY_SIZE, height: DAY_SIZE }}
            {...rest}
        />
    )
}