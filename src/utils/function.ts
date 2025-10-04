import type { FormDataInterface, FormResultInterface } from "@/interface/form";

export function checkFormValidation(
  data: FormDataInterface
): FormResultInterface {
  if (!data.username) {
    return {
      pass: false,
      field: "username",
      message: "Please enter your username.",
    };
  }
  if (data.username.length < 3) {
    return {
      pass: false,
      field: "username",
      message: "Username must be at least 3 characters.",
    };
  }
  if (!data.password) {
    return {
      pass: false,
      field: "password",
      message: "Please enter your password.",
    };
  }
  if (data.password.length < 6) {
    return {
      pass: false,
      field: "password",
      message: "Password must be at least 6 characters.",
    };
  }
  if (data.password.length > 9) {
    return {
      pass: false,
      field: "password",
      message: "Password must be at most 9 characters.",
    };
  }
  if (!/[A-Z]/.test(data.password)) {
    return {
      pass: false,
      field: "password",
      message: "Password must contain at least one uppercase letter.",
    };
  }
  if (!/[a-z]/.test(data.password)) {
    return {
      pass: false,
      field: "password",
      message: "Password must contain at least one lowercase letter.",
    };
  }
  if (!/[0-9]/.test(data.password)) {
    return {
      pass: false,
      field: "password",
      message: "Password must contain at least one number.",
    };
  }
  return { pass: true, field: null, message: "" };
}
