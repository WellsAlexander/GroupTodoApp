import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { db } from "../../../firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useRouter } from "expo-router";

export default function TabsRootScreen() {
  const [groupName, setGroupName] = useState("");
  const [groups, setGroups] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const groupsCollection = collection(db, "groups");
  const router = useRouter();

  useEffect(() => {
    fetchUserGroups();
  }, [user]);

  // Fetch groups the user has joined
  const fetchUserGroups = async () => {
    if (!user) return;
    const q = query(
      groupsCollection,
      where("members", "array-contains", user.uid)
    );
    const data = await getDocs(q);
    setGroups(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  // Create a new group if the name is unique
  const createGroup = async () => {
    if (!user || groupName.trim() === "") return;

    // Check if group name already exists
    const q = query(groupsCollection, where("name", "==", groupName));
    const existingGroups = await getDocs(q);

    if (!existingGroups.empty) {
      Alert.alert("Group already exists", "Please choose a different name.");
      return;
    }

    // Create new group
    await addDoc(groupsCollection, {
      name: groupName,
      members: [user.uid],
    });

    setGroupName("");
    fetchUserGroups();
  };

  // Join an existing group if the name exists
  const joinGroup = async () => {
    if (!user || groupName.trim() === "") return;

    const q = query(groupsCollection, where("name", "==", groupName));
    const data = await getDocs(q);

    if (data.empty) {
      Alert.alert("Group not found", "Please check the group name.");
      return;
    }

    const groupDoc = data.docs[0];
    const groupRef = doc(db, "groups", groupDoc.id);
    const groupData = groupDoc.data();

    // Check if the user is already in the group
    if (groupData.members.includes(user.uid)) {
      Alert.alert("Already a member", "You have already joined this group.");
      return;
    }

    // Add user to group
    await updateDoc(groupRef, {
      members: [...groupData.members, user.uid],
    });

    setGroupName("");
    fetchUserGroups();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.mainTitle}>Your Groups</Text>

        {/* Create/Join Group Input */}
        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Enter Group Name"
            value={groupName}
            onChangeText={(text) => setGroupName(text)}
            style={styles.input}
          />
          <TouchableOpacity style={styles.addButton} onPress={createGroup}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.joinButton} onPress={joinGroup}>
            <Text style={styles.buttonText}>Join</Text>
          </TouchableOpacity>
        </View>

        {/* List of groups the user has joined */}
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => router.replace(`/todoScreen?groupId=${item.id}`)}
            >
              <Text style={styles.groupText}>{item.name}</Text>
            </TouchableOpacity>
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
  joinButton: {
    backgroundColor: "#28A745",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  groupItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#f8f9fa",
    marginBottom: 5,
    borderRadius: 5,
  },
  groupText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
