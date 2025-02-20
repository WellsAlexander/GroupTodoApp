import React from "react";
import { StatusBar, View } from "react-native"; // Import View for background workaround
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={18} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <>
      {/* Wrapper to simulate a background color for iOS */}
      <View style={{ backgroundColor: "#7b2cbf", height: 55 }} />

      {/* Set status bar appearance */}
      <StatusBar barStyle="light-content" />

      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#f4f4f4",
            borderTopColor: "#ccc",
            borderWidth: 0,
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            height: 85,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingBottom: 20,
            paddingTop: 5,
            shadowRadius: 8,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            elevation: 10,
          },
          tabBarActiveTintColor: "#7b2cbf",
          tabBarInactiveTintColor: "#888",
        }}
      >
        <Tabs.Screen
          name="(groups)"
          options={{
            title: "Groups",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="users" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="storageScreen"
          options={{
            title: "Storage",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="database" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="functionScreen"
          options={{
            title: "Functions",
            tabBarIcon: ({ color }) => <TabBarIcon name="cogs" color={color} />,
          }}
        />
        <Tabs.Screen
          name="signOutScreen"
          options={{
            title: "Sign Out",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="sign-out" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
