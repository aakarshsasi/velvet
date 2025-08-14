import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const router = useRouter();

    useEffect(() => {
        const checkUserFlow = async () => {
            try {
                // For testing purposes, you can uncomment the next line to reset the flow
                await AsyncStorage.clear();
                
                const hasLaunched = await AsyncStorage.getItem("hasLaunched");
                const hasCompletedOnboarding = await AsyncStorage.getItem("hasCompletedOnboarding");
                
                console.log("Flow check:", { hasLaunched, hasCompletedOnboarding });
                
                if (!hasLaunched) {
                    // First time user - go to welcome
                    console.log("First time user - going to welcome");
                    await AsyncStorage.setItem("hasLaunched", "true");
                    router.replace("/welcome");
                } else if (!hasCompletedOnboarding) {
                    // User has launched but not completed onboarding
                    console.log("User has launched but not completed onboarding - going to onboarding");
                    router.replace("/onboarding");
                } else {
                    // User has completed onboarding - go to home
                    console.log("User has completed onboarding - going to home");
                    router.replace("/home");
                }
            } catch (error) {
                console.error("Error checking user flow:", error);
                // Fallback to welcome screen
                console.log("Error occurred - fallback to welcome");
                router.replace("/welcome");
            }
        };
        
        checkUserFlow();
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0F0F23" }}>
            <ActivityIndicator size="large" color="#EC4899" />
        </View>
    );
}