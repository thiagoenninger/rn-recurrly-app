import clsx from "clsx";
import React from "react";
import { Text, TextInput, View } from "react-native";

const AuthTextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  keyboardType,
  autoCapitalize = "none",
  autoComplete,
  editable = true,
}: AuthTextFieldProps) => {
  return (
    <View className="auth-field">
      <Text className="auth-label">{label}</Text>
      <TextInput
        className={clsx("auth-input", error && "auth-input-error")}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="rgba(8,17,38,0.4)"
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        editable={editable}
      />
      {error && <Text className="auth-error">{error}</Text>}
    </View>
  );
};

export default AuthTextField;
