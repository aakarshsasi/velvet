import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function OnboardingScreen() {
    const router = useRouter();
    const [page, setPage] = useState(0);
    const [formData, setFormData] = useState({
        relationship: "",
        sexuality: "",
        preferences: [],
    });

    const steps = [
        {
            title: "Tell us about yourself 💖",
            options: ["Single", "In a relationship"],
            key: "relationship",
            multi: false,
        },
        {
            title: "What's your sexuality? 🌈",
            options: ["Straight", "Lesbian", "Gay"],
            key: "sexuality",
            multi: false,
        },
        {
            title: "What are your turn-ons? 😏",
            options: [
                "Dirty talk", "Roleplay", "Foreplay", "Blowjobs",
                "Hard sex", "BDSM"
            ],
            key: "preferences",
            multi: true,
        },
    ];

    // Group steps into pages of 2 questions each
    const pages = [];
    for (let i = 0; i < steps.length; i += 2) {
        pages.push(steps.slice(i, i + 2));
    }

    const toggleSelection = (step, value) => {
        if (step.multi) {
            setFormData(prev => {
                const selected = prev[step.key];
                return {
                    ...prev,
                    [step.key]: selected.includes(value)
                        ? selected.filter(v => v !== value)
                        : [...selected, value],
                };
            });
        } else {
            setFormData(prev => ({ ...prev, [step.key]: value }));
        }
    };

    const nextPage = () => {
        if (page < pages.length - 1) {
            setPage(page + 1);
        } else {
            console.log("Final Data:", formData);
            router.replace("/home");
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
                {pages[page].map((stepData, idx) => (
                    <View key={idx} style={{ marginBottom: 40 }}>
                        <Text style={styles.title}>{stepData.title}</Text>
                        <View style={styles.optionsWrapper}>
                            {stepData.options.map(option => {
                                const selected = stepData.multi
                                    ? formData[stepData.key].includes(option)
                                    : formData[stepData.key] === option;
                                return (
                                    <TouchableOpacity
                                        key={option}
                                        style={[styles.option, selected && styles.optionSelected]}
                                        onPress={() => toggleSelection(stepData, option)}
                                    >
                                        <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                                            {option}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}
            </ScrollView>

            <TouchableOpacity style={styles.nextButton} onPress={nextPage}>
                <Text style={styles.nextText}>
                    {page === pages.length - 1 ? "Submit" : "Next ➡️"}
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#ffe4f0",
        paddingTop: 60,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#6f20a0",
        textAlign: "center",
    },
    optionsWrapper: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-around",
        marginTop: 15,
    },
    option: {
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 20,
        margin: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        minWidth: "40%",
        alignItems: "center",
    },
    optionSelected: {
        backgroundColor: "#6f20a0",
        borderColor: "#6f20a0",
    },
    optionText: {
        color: "#000",
        fontWeight: "500",
        textAlign: "center",
    },
    optionTextSelected: {
        color: "#fff",
    },
    nextButton: {
        position: "absolute",
        bottom: 30,
        alignSelf: "center",
        backgroundColor: "#6f20a0",
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    nextText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});
