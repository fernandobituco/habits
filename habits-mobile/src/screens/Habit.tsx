import { ScrollView, View, Text, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";
import { api } from "../lib/axios";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { GenerateProgress } from "../utils/GenerateProgress";

interface Params {
    date: Date

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
    possibleHabits?: PossibleHabits
    completedHabits?: CompletedHabits
}

export function Habit() {
    const route = useRoute()
    const { date } = route.params as Params
    const parsedDate = dayjs(date)
    const dayOfTheWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')
    const [loading, setLoading] = useState(true)
    const [dayHabits, setHabits] = useState<DayHabits>()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get(`/day?date=${date}`)
            setHabits(response.data)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os hábitos')
            console.log(error)
        } finally {
            setLoading(false)
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
    const progress = (dayHabits?.possibleHabits && dayHabits.completedHabits) ?
        GenerateProgress(dayHabits.possibleHabits.length, dayHabits.completedHabits.length) : 0

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
                    {progress}
                    &&
                    <ProgressBar progress={progress}/>
                }
            </ScrollView>
        </View>
    )
}
