import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebaseConfig";

const Index = () => {
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) router.replace("../(tabs)");
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={{ marginBottom: 450 }}>
        <Text style={[styles.welcomeText, { fontSize: 30, paddingBottom: 20 }]}>
          Welcome Back!
        </Text>
        <Text style={styles.welcomeText}>Let's get started!</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/(auth)/signIn")}
        >
          <Text style={[styles.buttonText, { color: "white" }]}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { borderTopLeftRadius: 60, backgroundColor: "white" },
          ]}
          onPress={() => router.push("/(auth)/signUp")}
        >
          <Text style={[styles.buttonText, { color: "#ff6d00" }]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 15,
    color: "white",
    textAlign: "center",
    fontWeight: "bold",
  },
  container: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#7b2cbf",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    padding: 30,
    paddingBottom: 40,
    width: "50%",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Index;
