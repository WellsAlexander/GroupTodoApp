import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot, // Import real-time listener
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function TodosScreen() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<any[]>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();

  const { groupId } = useLocalSearchParams(); // Get groupId from URL params
  const todosCollection = collection(db, "todos");

  useEffect(() => {
    if (!user || !groupId) return;

    const q = query(todosCollection, where("groupId", "==", groupId));

    // 🔥 Real-time listener
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTodos(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return () => unsubscribe(); // Cleanup listener when component unmounts
  }, [user, groupId]);

  const addTodo = async () => {
    if (user && groupId && task.trim() !== "") {
      await addDoc(todosCollection, {
        task,
        completed: false,
        userId: user.uid,
        groupId,
      });
      setTask("");
    }
  };

  const updateTodo = async (id: string, completed: boolean) => {
    const todoDoc = doc(db, "todos", id);
    await updateDoc(todoDoc, { completed: !completed });
  };

  const deleteTodo = async (id: string) => {
    const todoDoc = doc(db, "todos", id);
    await deleteDoc(todoDoc);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Group Todos</Text>
        <TouchableOpacity onPress={() => router.replace("../(groups)/")}>
          <Text style={styles.backButton}>← Back to Groups</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="New Task"
            value={task}
            onChangeText={(text) => setTask(text)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={addTodo}>
            <Text style={styles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={todos}
          renderItem={({ item }) => (
            <View style={styles.todoContainer}>
              <Text
                style={{
                  textDecorationLine: item.completed ? "line-through" : "none",
                  flex: 1,
                }}
              >
                {item.task}
              </Text>
              <TouchableOpacity
                style={styles.button}
                onPress={() => updateTodo(item.id, item.completed)}
              >
                <Text style={styles.buttonText}>
                  {item.completed ? "Undo" : "Complete"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteTodo(item.id)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
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
    padding: 20,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 16,
    color: "#007BFF",
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  todoContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
  },
  button: {
    marginLeft: 10,
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 5,
  },
});
