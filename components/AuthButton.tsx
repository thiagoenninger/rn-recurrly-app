import clsx from "clsx";
import React from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";

const AuthButton = ({
  label,
  onPress,
  disabled,
  loading,
  variant = "primary",
}: AuthButtonProps) => {
  const isSecondary = variant === "secondary";
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      onPress={onPress}
      disabled={isDisabled}
      className={clsx(
        isSecondary ? "auth-secondary-button" : "auth-button",
        !isSecondary && isDisabled && "auth-button-disabled",
        isSecondary && isDisabled && "opacity-50",
      )}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isSecondary ? "#ea7a53" : "#081126"}
        />
      ) : (
        <Text
          className={
            isSecondary ? "auth-secondary-button-text" : "auth-button-text"
          }
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
};

export default AuthButton;
