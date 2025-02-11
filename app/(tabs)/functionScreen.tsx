// Import TouchableOpacity from react-native
import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../../firebaseConfig";

export default function FunctionScreen() {
  const [functionResult, setFunctionResult] = useState("");

  const callHelloWorldFunction = async () => {
    const functions = getFunctions(app, "us-central1");
    const helloWorld = httpsCallable(functions, "helloWorld");
    try {
      const result: any = await helloWorld();
      setFunctionResult(result.data.message);
    } catch (error) {
      console.error("Error calling function:", error);
      setFunctionResult("Failed to call function");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Functions</Text>
        <Text style={styles.text}>{functionResult}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={callHelloWorldFunction}
        >
          <Text style={styles.buttonText}>Call Hello World Function</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
