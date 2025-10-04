import type { FormDataInterface, FormErrorField } from "@/interface/form";
import { BASE_URL } from "@/utils/api";
import { checkFormValidation } from "@/utils/function";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

const LoginPage = () => {
  const [formData, setFormData] = useState<FormDataInterface>({
    username: "",
    password: "",
  });
  const [isErrorSending, setErrorSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState<FormErrorField>();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const isValid = checkFormValidation(formData);
    if (isValid.pass) {
      const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setErrorSending(true);
        setErrorMessage("Failed to login. Please try again.");
        setErrorField(null);
        return;
      } else {
        setErrorSending(false);
        window.location.href = "/chat";
        setErrorField(null);
        setFormData({ username: "", password: "" });
      }
    } else {
      setErrorSending(true);
      setErrorMessage(isValid.message);
      setErrorField(isValid.field);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary to-secondary flex justify-center items-center px-4">
      <main className="bg-background w-full max-w-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl text-center font-bold text-primary mb-8">
          Login
        </h1>

        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          {/* Username */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="username"
              className="text-lg font-semibold text-primary"
            >
              Username
            </label>
            <input
              id="username"
              value={formData.username}
              onChange={(e) => {
                setErrorSending(false);
                if (errorField == "username") {
                  setErrorField(null);
                }
                e.preventDefault();
                setFormData({ ...formData, username: e.target.value });
              }}
              type="text"
              placeholder="Enter your username"
              className={`border-2 ${
                errorField == "username"
                  ? "border-destructive"
                  : "border-gray-300"
              } rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition`}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-lg font-semibold text-primary"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                value={formData.password}
                onChange={(e) => {
                  setErrorSending(false);
                  if (errorField === "password") setErrorField(null);
                  e.preventDefault();
                  setFormData({ ...formData, password: e.target.value });
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full border-2 ${
                  errorField === "password"
                    ? "border-destructive"
                    : "border-gray-300"
                } rounded-md px-3 py-2 pr-10 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute cursor-pointer inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary"
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {isErrorSending && (
            <div className="bg-red-100 border border-destructive text-red-700 px-4 py-3 rounded relative mb-4">
              <strong className="font-bold">Error!</strong> {errorMessage}
            </div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="cursor-pointer mt-4 bg-primary text-white py-2 rounded-md text-lg font-semibold hover:bg-primary/90 transition active:scale-95"
          >
            Sign in
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="text-primary underline cursor-pointer"
          >
            Register here
          </Link>
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
