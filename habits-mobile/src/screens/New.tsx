import { useState } from "react";
import { ScrollView, View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { CheckBox } from "../components/CheckBox";
import { Feather } from "@expo/vector-icons"
import colors from "tailwindcss/colors";
import { api } from "../lib/axios";
import { Loading } from "../components/Loading";

const avaliableWeekDays = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado']


export function New() {
    const [weekDays, setWeekDays] = useState<number[]>([])
    const [title, setTitle] = useState('')
    const [loading, setLoading] = useState(false)

    function handleToggleWeekDay(weekDayIndex: number) {
        if (weekDays.includes(weekDayIndex)) {
            setWeekDays(prevState => prevState.filter(weekDay => weekDay !== weekDayIndex))
        } else {
            setWeekDays(prevState => [...prevState, weekDayIndex])
        }
    }

    async function creatHabit() {
        try {
            if(!title.trim()) {
                return Alert.alert('Digite o nome do hábito')
            }
            if(weekDays.length == 0) {
                Alert.alert('Defina a ocorrência')
                return
            }
            setLoading(true)
            await api.post('habits', {title, weekDays})
            setTitle('')
            setWeekDays([])
            Alert.alert('Hábito criado com sucesso')
        } catch (error) {
            Alert.alert('Erro', 'Não foi possível carregar os hábitos')
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <Loading />
        )
    }

    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView contentContainerStyle={{paddingBottom: 100}}>
                <Text className="mt-6 text-white font-extrabold text-3xl">
                    Criar hábito
                </Text>
                <Text className="mt-6 text-white font-semibold text-base">
                    Qual é o seu comprometimento?
                </Text>

                <TextInput
                    className="h-12 pl-4 rounded-lg mt-3 mb-3 bg-zinc-800 text-white focus:border-2 focus:border-green-600"
                    placeholder="ex. Malhar, Beber 2L de água"
                    placeholderTextColor={colors.zinc[400]}
                    onChangeText={setTitle}
                    value={title}
                />
                <Text className="font-semibold text-white mt-4 mb-3 text-base">
                    Qual a recorrência?
                </Text>
                {
                    avaliableWeekDays.map((weekDay, i) => (
                        <CheckBox
                            key={weekDay}
                            title={weekDay}
                            checked={weekDays.includes(i)}
                            onPress={() => handleToggleWeekDay(i)}
                        />
                    ))
                }

                <TouchableOpacity
                    className="w-full h-14 flex-row items-center justify-center bg-green-600 mt-6 rounded-lg"
                    activeOpacity={0.7}
                    onPress={creatHabit}
                    >
                    <Feather
                        name="check"
                        size={20}
                        color={colors.white}
                    />
                    <Text className="font-semibold text-base text-white ml-2">
                        Confirmar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    )
}