import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { auth } from "../../firebaseConfig";
import { router } from "expo-router";
import { getAuth } from "firebase/auth";

export default function SignOutScreen() {
  getAuth().onAuthStateChanged((user) => {
    if (!user) {
      router.replace("/resetToRoot");
    }
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Out</Text>
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.text}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    margin: 10,
  },
  text: {
    color: "white",
  },
});
