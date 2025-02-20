import {
  StyleSheet,
  Image,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { storage, auth } from "../../firebaseConfig";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  listAll,
  deleteObject,
} from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { User, onAuthStateChanged } from "firebase/auth";

export default function StorageScreen() {
  const [image, setImage] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchImages(currentUser.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchImages = async (userId: any) => {
    try {
      const storageRef = ref(storage, `images/${userId}`);
      const result = await listAll(storageRef);
      const urls = await Promise.all(
        result.items.map((itemRef) => getDownloadURL(itemRef))
      );
      setImages(urls);
    } catch (error) {
      console.error("Error fetching images: ", error);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log(result, "the result");
      setImage(imageUri);
      console.log("Image picked: ", imageUri);
    }
  };

  const uploadImage = async () => {
    if (!user || !image) {
      console.log(`User: ${user}, Image: ${image}`); // Add logging to check values
      Alert.alert("No user or image found!");
      return;
    }

    console.log("Attempting to upload image: ", image); // Log the image URI for debugging

    try {
      const response = await fetch(image);
      const blob = await response.blob();

      console.log("Blob created: ", blob); // Log the blob for debugging

      const storageRef = ref(storage, `images/${user.uid}/${Date.now()}`);
      await uploadBytes(storageRef, blob);

      const url = await getDownloadURL(storageRef);
      setImages((images) => [...images, url]);
      setImage(null); // Reset the image state
      console.log("Image uploaded and URL retrieved: ", url);
    } catch (error: any) {
      console.error("Error uploading image: ", error);
      Alert.alert("Upload failed!", error.message);
    }
  };

  const deleteImage = async (url: any) => {
    if (!user) {
      Alert.alert("No user found!");
      return;
    }

    try {
      const storageRef = ref(storage, url);
      await deleteObject(storageRef);
      setImages(images.filter((img) => img !== url));
    } catch (error: any) {
      console.error("Error deleting image: ", error);
      Alert.alert("Delete failed!", error.message);
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Storage</Text>
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Pick an image from camera roll</Text>
        </TouchableOpacity>
        {image && (
          <>
            <Image source={{ uri: image }} style={styles.image} />
            <TouchableOpacity style={styles.button} onPress={uploadImage}>
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </>
        )}
        <FlatList
          data={images}
          renderItem={({ item }) => (
            <View style={styles.imageContainer}>
              <Image source={{ uri: item }} style={styles.image} />
              <TouchableOpacity
                style={styles.button}
                onPress={() => deleteImage(item)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginTop: 45,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#7b2cbf",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "cover",
    marginTop: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
