import { useClerk } from "@clerk/expo";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const Settings = () => {
  const { signOut } = useClerk();

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="mb-6 text-2xl font-sans-bold text-primary">
        Settings
      </Text>
      <Pressable
        className="items-center rounded-2xl bg-primary py-4"
        onPress={() => signOut()}
      >
        <Text className="font-sans-bold text-background">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default Settings;
