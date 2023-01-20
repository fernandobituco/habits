import { ScrollView, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import { ProgressBar } from "../components/ProgressBar";

interface Params {
    date: Date
}

export function Habit() {
    const route = useRoute()
    const { date } = route.params as Params
    const parsedDate = dayjs(date)
    const dayOfTheWeek = parsedDate.format('dddd')
    const dayAndMonth = parsedDate.format('DD/MM')

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <Text className="mt-6 text-zinc-400 font-semibold text-base">
                    {dayOfTheWeek}
                </Text>
                <Text className="mt-3 text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={75}/>
            </ScrollView>
        </View>
    )
}