import { FieldError } from "./apiResponse";

export const requiredFields = (
  body: Record<string, unknown>,
  fields: Record<string, string>,
): FieldError[] => {
  return Object.entries(fields)
    .filter(([field]) => !body[field])
    .map(([field, message]) => ({ field, message }));
};

export const isValidEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidRole = (role: string): boolean => {
  return ["customer", "seller", "admin"].includes(role);
};

export const positiveNumberError = (
  value: number | undefined,
  field: string,
  message: string,
): FieldError[] => {
  if (value !== undefined && value <= 0) {
    return [{ field, message }];
  }

  return [];
};
