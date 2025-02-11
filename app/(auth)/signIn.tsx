import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      if (user) router.replace("../(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign in failed: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#7b2cbf" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Email"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Enter Password"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Sign in</Text>
        </TouchableOpacity>

        <Text style={styles.text}>
          Don't have an account?{" "}
          <Text
            style={{ color: "#ff6d00" }}
            onPress={() => router.push("/(auth)/signUp")}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 30,
    marginTop: 150,
    backgroundColor: "#fff",
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    paddingVertical: 30,
  },
  title: {
    fontSize: 32,
    marginBottom: 24,
    color: "#7b2cbf",
    fontWeight: "600",
  },
  textInput: {
    width: "100%",
    padding: 16,
    marginBottom: 16,
    borderWidth: 0.3,
    borderRadius: 15,
    borderColor: "gray",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#5a189a",
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },

  text: {
    color: "black",
    fontSize: 16,
  },
});
