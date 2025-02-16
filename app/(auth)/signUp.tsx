import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { auth } from "../../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const signUp = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, email, password);
      if (user) router.replace("../(tabs)");
    } catch (error: any) {
      console.log(error);
      alert("Sign up failed: " + error.message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#7b2cbf" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Create your Account</Text>
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
        <TextInput
          style={styles.textInput}
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={signUp}>
          <Text style={styles.buttonText}>Sign up</Text>
        </TouchableOpacity>

        <Text style={styles.text}>
          Already have an account?{" "}
          <Text
            style={{ color: "#ff6d00" }}
            onPress={() => router.push("/(auth)/signIn")}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignUp;

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
