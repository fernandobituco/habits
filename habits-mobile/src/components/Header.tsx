import { View, Text, TouchableOpacity } from "react-native";
import Logo from "../assets/logo.svg";
import { Feather } from "@expo/vector-icons"
import colors from 'tailwindcss/colors';
import { useNavigation } from '@react-navigation/native'

export function Header() {
    const { navigate } = useNavigation()

    return (
        <View className="w-full flex-row items-center justify-between">
            <Logo />
            <TouchableOpacity
                className="flex-row h-11 px-4 border border-violet-500 rounded-lg items-center"
                onPress={() => navigate('new')}
            >
                <Feather
                    name="plus"
                    size={20}
                    color={colors.violet[500]}
                />
                <Text className="text-white ml-3 font-semibold text-base">
                    Novo
                </Text>
            </TouchableOpacity>
        </View>
    )
}