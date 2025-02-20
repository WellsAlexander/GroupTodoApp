// Import TouchableOpacity from react-native
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
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
    <View style={styles.safeArea}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#7b2cbf",
  },
  container: {
    flex: 1,
    marginTop: 45,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#7b2cbf",
    padding: 12,
    borderRadius: 8,
    marginBottom: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
