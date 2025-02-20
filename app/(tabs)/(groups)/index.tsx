import {
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  View,
  Modal,
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
  const [groupInput, setGroupInput] = useState("");
  const [groups, setGroups] = useState<any>([]);
  const auth = getAuth();
  const user = auth.currentUser;
  const groupsCollection = collection(db, "groups");
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

  useEffect(() => {
    if (user) {
      fetchUserGroups();
    }
  }, [user]);

  // Fetch groups the user has joined
  const fetchUserGroups = async () => {
    if (!user) return;

    setRefreshing(true); // Show refresh indicator

    const q = query(
      groupsCollection,
      where("members", "array-contains", user.uid)
    );
    const data = await getDocs(q);
    const fetchedGroups = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Fetch active tasks count for each group
    const updatedGroups = await Promise.all(
      fetchedGroups.map(async (group) => {
        const todosQuery = query(
          collection(db, "todos"),
          where("groupId", "==", group.id),
          where("completed", "==", false)
        );
        const todosSnapshot = await getDocs(todosQuery);
        return { ...group, activeTasks: todosSnapshot.size };
      })
    );

    setGroups(updatedGroups);
    setRefreshing(false); // Hide refresh indicator
  };

  // Create a new group if the name is unique
  const createGroup = async () => {
    setOpenModal(false);
    if (!user || groupInput.trim() === "") return;

    // Check if group name already exists
    const q = query(groupsCollection, where("name", "==", groupInput));
    const existingGroups = await getDocs(q);

    if (!existingGroups.empty) {
      Alert.alert("Group already exists", "Please choose a different name.");
      return;
    }

    // Generate a unique 6-digit code
    let groupCode;
    let codeExists = true;
    while (codeExists) {
      groupCode = Math.floor(100000 + Math.random() * 900000).toString();
      const codeQuery = query(groupsCollection, where("code", "==", groupCode));
      const codeDocs = await getDocs(codeQuery);
      codeExists = !codeDocs.empty;
    }

    // Create new group
    await addDoc(groupsCollection, {
      name: groupInput,
      code: groupCode,
      members: [user.uid],
      activeTasks: 0,
    });

    setGroupInput("");
    fetchUserGroups();
  };

  // Join an existing group if the code exists
  const joinGroup = async () => {
    setOpenModal(false);
    if (!user || groupInput.trim() === "") return;

    const q = query(groupsCollection, where("code", "==", groupInput));
    const data = await getDocs(q);

    if (data.empty) {
      Alert.alert("Group not found", "Please check the group code.");
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

    setGroupInput("");
    fetchUserGroups();
  };

  return (
    <View style={styles.container}>
      <Modal visible={openModal} animationType="fade" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text
                style={{
                  fontSize: 20,
                  marginRight: 10,
                }}
              >
                Add Group
              </Text>
              <TouchableOpacity onPress={() => setOpenModal(false)}>
                <Text
                  style={{
                    color: "#ff6d00",
                    fontWeight: 500,
                    fontSize: 25,
                    marginRight: 10,
                  }}
                >
                  x
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}></View>
            <TextInput
              style={styles.input}
              placeholder="Group Name or Code"
              placeholderTextColor={"#ccc"}
              value={groupInput}
              onChangeText={setGroupInput}
            />
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <TouchableOpacity style={styles.addButton} onPress={createGroup}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.joinButton} onPress={joinGroup}>
                <Text style={styles.buttonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 15,
          marginTop: 45,
        }}
      >
        <Text style={styles.mainTitle}>Your Groups</Text>
        <TouchableOpacity
          style={{
            borderRadius: 6,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
            width: 40,
            height: 40,
            marginRight: 10,
          }}
          onPress={() => setOpenModal(true)}
        >
          <Text style={{ color: "#ff6d00", fontWeight: 500, fontSize: 25 }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.groupListContainer}>
        {/* List of groups the user has joined */}
        <FlatList
          data={groups}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.groupItem}
              onPress={() => router.replace(`/todoScreen?groupId=${item.id}`)}
            >
              <View>
                <Text style={styles.groupText}>{item.name}</Text>
                <Text style={styles.groupLightText}>Today</Text>
              </View>
              <View>
                <Text style={styles.groupLightText}>
                  {item.members.length} members
                </Text>
                <Text
                  style={styles.groupLightText}
                >{`${item.activeTasks} active tasks`}</Text>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          refreshing={refreshing} // Attach refreshing state
          onRefresh={fetchUserGroups} // Attach onRefresh function
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    marginTop: 300,
    padding: 30,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  container: {
    flex: 1,
    backgroundColor: "#7b2cbf",
  },
  groupListContainer: {
    flexGrow: 1,
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#fff",
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    paddingLeft: 5,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  addButton: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#ff8500",
    padding: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  joinButton: {
    flexGrow: 1,
    alignItems: "center",
    backgroundColor: "#ff8500",
    padding: 20,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  groupItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    backgroundColor: "#F5F5F5",
    marginBottom: 10,
    borderRadius: 12,
  },
  groupText: {
    fontSize: 25,
    fontWeight: "bold",
  },
  groupLightText: {
    marginTop: 5,
    fontSize: 14,
    color: "#888",
  },
});
