import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { useAuth } from '../src/contexts/AuthContext';

export default function InitialRoute() {
    const router = useRouter();
    const { user, loading, hasCompletedOnboarding } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user && hasCompletedOnboarding) {
                // User is signed in and has completed onboarding
                router.replace("/home");
            } else if (user && !hasCompletedOnboarding) {
                // User is signed in but hasn't completed onboarding
                router.replace("/onboarding");
            } else {
                // No user, show welcome screen
                router.replace("/welcome");
            }
        }
    }, [user, loading, hasCompletedOnboarding, router]);

    // Show a proper loading screen
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Velvet</Text>
            <Text style={styles.subtitle}>Your intimate adventure starts here</Text>
            <ActivityIndicator size="large" color="#DC143C" style={styles.loader} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        color: '#DC143C',
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        color: '#CD5C5C',
        fontSize: 18,
        marginBottom: 30,
        textAlign: 'center',
    },
    loader: {
        marginTop: 20,
    },
});
