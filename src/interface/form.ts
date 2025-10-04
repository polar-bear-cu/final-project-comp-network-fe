export interface FormDataInterface {
  username: string;
  password: string;
}

export interface FormResultInterface {
  pass: boolean;
  field: FormErrorField;
  message: string;
}

export type FormErrorField = "username" | "password" | null;
