import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href={"/onboarding"}>Go to Onboarding</Link>
    </View>
  );
};

export default SignIn;
