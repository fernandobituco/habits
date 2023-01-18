import { View, Text, ScrollView } from "react-native";
import { HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { DAY_SIZE } from "../components/HabitDay";
import { generateRange } from "../utils/GenerateRangeByYear";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const dates = generateRange()

export function Home() {
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
            <ScrollView contentContainerStyle={{paddingBottom: 100}}>
                <View className="flex-row flex-wrap">
                    {dates.map((day, i) => (
                        <HabitDay key={i} past={day.past} />
                    ))}
                </View>
            </ScrollView>
        </View >
    )
}