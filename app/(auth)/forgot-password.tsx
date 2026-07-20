import AuthButton from "@/components/AuthButton";
import AuthTextField from "@/components/AuthTextField";
import "@/global.css";
import { navigateAfterAuth } from "@/lib/auth-navigation";
import { getClerkFieldError } from "@/lib/clerk-errors";
import {
  getConfirmPasswordError,
  getEmailError,
  getPasswordError,
} from "@/lib/validation";
import { useSignIn } from "@clerk/expo";
import { Link } from "expo-router";
import { styled } from "nativewind";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const ForgotPassword = () => {
  const { signIn, errors, fetchStatus } = useSignIn();

  const [step, setStep] = useState<"request" | "reset">("request");
  const [touched, setTouched] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [flowError, setFlowError] = useState<string>();

  const emailError = getEmailError(email);
  const newPasswordError = getPasswordError(newPassword);
  const confirmNewPasswordError = getConfirmPasswordError(
    newPassword,
    confirmNewPassword,
  );
  const isResetFormValid = !newPasswordError && !confirmNewPasswordError;
  const isSubmitting = fetchStatus === "fetching";

  const handleRequestCode = async () => {
    setTouched(true);
    setFlowError(undefined);
    if (emailError) return;

    const { error } = await signIn.create({ identifier: email.trim() });
    if (error) return;

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) return;

    setStep("reset");
    setTouched(false);
  };

  const handleResend = async () => {
    setFlowError(undefined);
    const { error } = await signIn.resetPasswordEmailCode.sendCode();
    if (error) {
      setFlowError("Couldn't resend the code. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    setTouched(true);
    setFlowError(undefined);
    if (!isResetFormValid) return;

    const { error: codeError } = await signIn.resetPasswordEmailCode.verifyCode(
      { code },
    );
    if (codeError) return;

    const statusAfterCode: string = signIn.status;
    if (statusAfterCode !== "needs_new_password") {
      setFlowError("Something went wrong. Please request a new code.");
      return;
    }

    const { error: passwordError } =
      await signIn.resetPasswordEmailCode.submitPassword({
        password: newPassword,
        signOutOfOtherSessions: true,
      });
    if (passwordError) return;

    const statusAfterPassword: string = signIn.status;
    if (statusAfterPassword === "complete") {
      await signIn.finalize({ navigate: navigateAfterAuth });
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

            {step === "request" ? (
              <>
                <Text className="auth-title">Reset your password</Text>
                <Text className="auth-subtitle">
                  Enter your email and we&apos;ll send you a reset code
                </Text>
              </>
            ) : (
              <>
                <Text className="auth-title">Set a new password</Text>
                <Text className="auth-subtitle">
                  Enter the code we sent to {email} and choose a new password
                </Text>
              </>
            )}
          </View>

          <View className="auth-card">
            {step === "request" ? (
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

                {flowError && <Text className="auth-error">{flowError}</Text>}

                <AuthButton
                  label="Send reset code"
                  onPress={handleRequestCode}
                  disabled={touched && !!emailError}
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
                <AuthTextField
                  label="New password"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  placeholder="Create a new password"
                  secureTextEntry
                  autoComplete="new-password"
                  error={
                    (touched ? newPasswordError : undefined) ??
                    getClerkFieldError(errors, "password")
                  }
                />
                <AuthTextField
                  label="Confirm new password"
                  value={confirmNewPassword}
                  onChangeText={setConfirmNewPassword}
                  placeholder="Re-enter your new password"
                  secureTextEntry
                  autoComplete="new-password"
                  error={touched ? confirmNewPasswordError : undefined}
                />

                {flowError && <Text className="auth-error">{flowError}</Text>}

                <AuthButton
                  label="Reset password"
                  onPress={handleResetPassword}
                  disabled={touched && !isResetFormValid}
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

          <View className="auth-link-row">
            <Link href="/(auth)/sign-in">
              <Text className="auth-link">Back to sign in</Text>
            </Link>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
