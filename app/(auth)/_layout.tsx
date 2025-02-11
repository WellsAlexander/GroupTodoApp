import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        statusBarBackgroundColor: "#7b2cbf",
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
};

export default _layout;
