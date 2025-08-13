import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Lottie from 'lottie-react';
import welcomeAnimation from '../../assets/images/welcome.json';
import { LinearGradient } from 'expo-linear-gradient';
const { width, height } = Dimensions.get("screen"); // use screen height

export default function WelcomeScreen() {
    const router = useRouter();
    const [LottieView, setLottieView] = useState(null);

    useEffect(() => {
        if (Platform.OS !== 'web') {
            import('lottie-react-native').then((module) => {
                setLottieView(() => module.default);
            });
        }
    }, []);

    return (
        <View style={styles.root}>
            <LinearGradient
                colors={['#353539', '#6f20a0']}
                style={styles.gradient}
            />
            {Platform.OS === 'web' ? (
                <Lottie
                    animationData={welcomeAnimation}
                    loop
                    autoplay
                    style={styles.lottie}
                />
            ) : (
                LottieView && (
                    <LottieView
                        source={welcomeAnimation}
                        autoPlay
                        loop
                        style={styles.lottie}
                    />
                )
            )}

            <TouchableOpacity style={styles.button} onPress={() => alert("Started!")}>
                <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    gradient: {
        position: 'absolute',
        width: width,
        height: height,
    },
    lottie: {
        position: "absolute",
        top: 0,
        left: 0,
        width: width,
        height: height,
    },
    button: {
        position: "absolute",
        bottom: 120,
        alignSelf: "center",
        backgroundColor: "rgba(255, 255, 255, 0.85)",
        paddingVertical: 14,
        paddingHorizontal: 28,
        borderRadius: 25,
    },
    buttonText: {
        fontSize: 18,
        color: "black",
        fontWeight: "bold",
    },
});
