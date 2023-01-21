import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { GenerateProgress } from "../utils/GenerateProgress";
import { CheckBox } from "../components/CheckBox";

interface Params {
    date: Date

}

type DayHabits = {
    possibleHabits?: {
        id: string
        title: string
        created_at: Date
    }[]
    completedHabits?: string[]
}

export function Habit() {
    const route = useRoute()
    const { date } = route.params as Params
    const parsedDate = dayjs(date)
    const dayOfTheWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')
    const [loading, setLoading] = useState(true)
    const [dayHabits, setHabits] = useState<DayHabits>()
    const [completed, setCompleted] = useState<string[]>([])

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('day', { params: { date }})
            setHabits(response.data)
            setCompleted(response.data.completedHabits)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleCheck(habitId: string) {
        
        await api.patch('habits', {
            id: habitId,
            date: date
        })

        if (completed.includes(habitId)) {
            setCompleted(prevState => prevState.filter(habit => habit != habitId))
        } else {
            setCompleted(prevState => [...prevState, habitId])
        }   
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (loading) {
        return (
            <Loading />
        )
    }
    const progress = (dayHabits?.possibleHabits && completed && dayHabits.possibleHabits.length > 0) ?
        GenerateProgress(dayHabits!.possibleHabits!.length, completed.length) : 0

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="mt-6 text-zinc-400 font-semibold text-base">
                    {dayOfTheWeek}
                </Text>
                <Text className="mt-3 text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                {
                    { progress }
                    &&
                    <ProgressBar progress={progress} />
                }
                <View className="flex-1 gap-2">
                    {
                        dayHabits?.possibleHabits?.map((habit, i) => (
                            <CheckBox
                            key={`${habit.title}-${i}`}
                            title={habit.title}
                            checked={completed.includes(habit.id)}
                            onPress={() => handleToggleCheck(habit.id)}
                            />
                        ))
                    }
                </View>
            </ScrollView>
        </View>
    )
}
