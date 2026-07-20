import AuthButton from "@/components/AuthButton";
import AuthTextField from "@/components/AuthTextField";
import "@/global.css";
import { getClerkFieldError } from "@/lib/clerk-errors";
import { navigateAfterAuth } from "@/lib/auth-navigation";
import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
} from "@/lib/validation";
import { useSignUp } from "@clerk/expo";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const SignUp = () => {
  const { signUp, errors, fetchStatus } = useSignUp();

  const [step, setStep] = useState<"form" | "verify">("form");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [flowError, setFlowError] = useState<string>();

  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password);
  const confirmPasswordError = getConfirmPasswordError(
    password,
    confirmPassword,
  );
  const isFormValid = !emailError && !passwordError && !confirmPasswordError;
  const isSubmitting = fetchStatus === "fetching";

  const handleSignUp = async () => {
    setTouched(true);
    setFlowError(undefined);
    if (!isFormValid) return;

    const { error } = await signUp.password({
      emailAddress: email.trim(),
      password,
    });
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: navigateAfterAuth });
      return;
    }

    if (signUp.unverifiedFields.includes("email_address")) {
      const { error: sendError } = await signUp.verifications.sendEmailCode();
      if (sendError) return;
      setStep("verify");
    }
  };

  const handleVerify = async () => {
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) return;

    if (signUp.status === "complete") {
      await signUp.finalize({ navigate: navigateAfterAuth });
    }
  };

  const handleResend = async () => {
    setFlowError(undefined);
    const { error } = await signUp.verifications.sendEmailCode();
    if (error) {
      setFlowError("Couldn't resend the code. Please try again.");
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

            {step === "form" ? (
              <>
                <Text className="auth-title">Create your account</Text>
                <Text className="auth-subtitle">
                  Start tracking every subscription in one place
                </Text>
              </>
            ) : (
              <>
                <Text className="auth-title">Verify your email</Text>
                <Text className="auth-subtitle">
                  Enter the 6-digit code we sent to {email}
                </Text>
              </>
            )}
          </View>

          <View className="auth-card">
            {step === "form" ? (
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
                    getClerkFieldError(errors, "emailAddress")
                  }
                />
                <AuthTextField
                  label="Password"
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry
                  autoComplete="new-password"
                  error={
                    (touched ? passwordError : undefined) ??
                    getClerkFieldError(errors, "password")
                  }
                />
                <AuthTextField
                  label="Confirm password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Re-enter your password"
                  secureTextEntry
                  autoComplete="new-password"
                  error={touched ? confirmPasswordError : undefined}
                />

                <View nativeID="clerk-captcha" />

                {flowError && <Text className="auth-error">{flowError}</Text>}

                <AuthButton
                  label="Create account"
                  onPress={handleSignUp}
                  disabled={touched && !isFormValid}
                  loading={isSubmitting}
                />
              </View>
            ) : (
              <View className="auth-form">
                <AuthTextField
                  label="Verification code"
                  value={code}
                  onChangeText={setCode}
                  placeholder="123456"
                  keyboardType="number-pad"
                  error={getClerkFieldError(errors, "code")}
                />

                {flowError && <Text className="auth-error">{flowError}</Text>}

                <AuthButton
                  label="Verify"
                  onPress={handleVerify}
                  disabled={code.length === 0}
                  loading={isSubmitting}
                />
                <AuthButton
                  label="Resend code"
                  variant="secondary"
                  onPress={handleResend}
                  loading={isSubmitting}
                />
              </View>
            )}
          </View>

          {step === "form" && (
            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href="/(auth)/sign-in">
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default SignUp;
