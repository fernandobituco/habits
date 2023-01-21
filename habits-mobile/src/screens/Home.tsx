import { View, Text, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { DAY_SIZE } from "../components/HabitDay";
import { generateRange } from "../utils/GenerateRangeByYear";
import { api } from "../lib/axios";
import { useState, useCallback } from "react";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const dates = generateRange()

type Summary = {
    id: string
    date: Date
    amount: number
    completed: number
}[]

export function Home() {

    const [loading, setLoading] = useState(true)
    const [habits, setHabits] = useState<Summary>([])
    const { navigate } = useNavigation()

    async function fetchData() {
        try {
            setLoading(true)
            const response = await api.get('/summary')
            setHabits(response.data)
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useFocusEffect(useCallback(() => {
        fetchData()
    }, []))

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <Header />
            <View className="flex-row mt-6 mb-2">
                {
                    weekDays.map((weekDay, i) => (
                        <Text
                            key={`${weekDay}-${i}`}
                            className="text-zinc-400 text-xl - font-bold text-center mx-1"
                            style={{ height: DAY_SIZE, width: DAY_SIZE }}>
                            {weekDay}
                        </Text>
                    ))
                }
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View className="flex-row flex-wrap">
                    {dates.map((date, i) => {
                        const dayWithHabits = habits.find(day => {
                            return dayjs(date.date).isSame(day.date, 'day')
                        })
                        return (
                            <HabitDay
                                key={`${date.date.toISOString()}-${i}`}
                                date={date.date}
                                completed={dayWithHabits?.completed}
                                amount={dayWithHabits?.amount}
                                past={date.past}
                                onPress={() => navigate('habit', { date: date.date.toISOString() })}
                            />
                        )
                    })}
                </View>
            </ScrollView>
        </View >
    )
}