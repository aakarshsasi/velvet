import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkFirstLaunch = async () => {
            const hasLaunched = await AsyncStorage.getItem("hasLaunched");
            // if (!hasLaunched) {
                await AsyncStorage.setItem("hasLaunched", "true");
                router.replace("/welcome");
            // } else {
            //     router.replace("/(tabs)");
            // }
        };
        checkFirstLaunch();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#6f20a0" />
        </View>
    );
}