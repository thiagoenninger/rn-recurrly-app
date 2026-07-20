import AuthButton from "@/components/AuthButton";
import AuthTextField from "@/components/AuthTextField";
import "@/global.css";
import { navigateAfterAuth } from "@/lib/auth-navigation";
import { getClerkFieldError } from "@/lib/clerk-errors";
import { getEmailError, getPasswordError } from "@/lib/validation";
import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignIn = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [flowError, setFlowError] = useState<string>();

  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password);
  const isFormValid = !emailError && !passwordError;
  const isSubmitting = fetchStatus === "fetching";

  const handleSignIn = async () => {
    setTouched(true);
    setFlowError(undefined);
    if (!isFormValid) return;

    const { error } = await signIn.password({
      emailAddress: email.trim(),
      password,
    });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
      return;
    }

    if (
      signIn.status === "needs_second_factor" ||
      signIn.status === "needs_client_trust"
    ) {
      setFlowError(
        "Additional verification is required for this account, which isn't supported yet. Please contact support.",
      );
    }
  };

  return (
    <SafeAreaView className="auth-safe-area">
      <View className="auth-screen">
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurrly</Text>
                <Text className="auth-wordmark-sub">Smart Billing</Text>
              </View>
            </View>

            <Text className="auth-title">Welcome back</Text>
            <Text className="auth-subtitle">
              Sign in to continue managing your subscriptions
            </Text>
          </View>

          <View className="auth-card">
            <View className="auth-form">
              <AuthTextField
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoComplete="email"
                error={
                  (touched ? emailError : undefined) ??
                  getClerkFieldError(errors, "identifier")
                }
              />
              <AuthTextField
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                secureTextEntry
                autoComplete="current-password"
                error={
                  (touched ? passwordError : undefined) ??
                  getClerkFieldError(errors, "password")
                }
              />

              {flowError && <Text className="auth-error">{flowError}</Text>}

              <AuthButton
                label="Sign in"
                onPress={handleSignIn}
                disabled={touched && !isFormValid}
                loading={isSubmitting}
              />

              <View className="auth-link-row">
                <Link href="/(auth)/forgot-password">
                  <Text className="auth-link">Forgot password?</Text>
                </Link>
              </View>
            </View>
          </View>

          <View className="auth-link-row">
            <Text className="auth-link-copy">New to Recurrly?</Text>
            <Link href="/(auth)/sign-up">
              <Text className="auth-link">Create an account</Text>
            </Link>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
