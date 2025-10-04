export const BASE_URL = "http://localhost:3000/api";

export interface ResponseInterface<T> {
  success: boolean;
  message: T;
}
