const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export const isValidEmail = (value: string): boolean =>
  EMAIL_PATTERN.test(value.trim());

export const getEmailError = (value: string): string | undefined => {
  if (!value.trim()) return "Email is required";
  if (!isValidEmail(value)) return "Enter a valid email address";
  return undefined;
};

export const getPasswordError = (value: string): string | undefined => {
  if (!value) return "Password is required";
  if (value.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
  return undefined;
};

export const getConfirmPasswordError = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) return "Confirm your password";
  if (password !== confirmPassword) return "Passwords don't match";
  return undefined;
};
