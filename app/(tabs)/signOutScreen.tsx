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
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Out</Text>
        <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
          <Text style={styles.text}>Sign Out</Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 45,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    margin: 20,
  },
  button: {
    backgroundColor: "#7b2cbf",
    padding: 10,
    borderRadius: 5,
    marginBottom: 120,
  },
  text: {
    color: "white",
  },
});
