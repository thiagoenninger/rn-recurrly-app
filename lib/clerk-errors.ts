type FieldErrorLike = { message: string } | null | undefined;

export const getClerkFieldError = <T>(
  errors: { fields: T },
  field: keyof T,
): string | undefined => {
  const value = errors.fields[field] as unknown as FieldErrorLike;
  return value?.message;
};
