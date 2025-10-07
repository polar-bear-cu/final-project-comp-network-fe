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
  if (!/^[a-zA-Z0-9-_]+$/.test(data.username)) {
    return {
      pass: false,
      field: "username",
      message:
        "Username must contain only English letters, numbers, hyphens or underscore.",
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

export function convertDateToDateTimeString(dateObject: Date) {
  const date =
    dateObject.getDate() < 10
      ? "0" + dateObject.getDate()
      : dateObject.getDate();
  const month =
    dateObject.getMonth() < 10
      ? "0" + dateObject.getMonth()
      : dateObject.getMonth();
  const year = dateObject.getFullYear() + 543;

  const hour =
    dateObject.getHours() < 10
      ? "0" + dateObject.getHours()
      : dateObject.getHours();

  const minute =
    dateObject.getMinutes() < 10
      ? "0" + dateObject.getMinutes()
      : dateObject.getMinutes();

  return date + "/" + month + "/" + year + " " + hour + ":" + minute;
}
