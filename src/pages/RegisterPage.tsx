import type { FormDataInterface, FormResultInterface } from "@/interface/form";
import { BASE_URL } from "@/utils/api";
import { useState } from "react";
import { Link } from "react-router";

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormDataInterface>({
    username: "",
    password: "",
  });
  const [isErrorSending, setErrorSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function checkFormValidation(data: FormDataInterface): FormResultInterface {
    if (data.username.length < 3) {
      return {
        pass: false,
        message: "Username must be at least 3 characters.",
      };
    } else if (data.password.length < 6) {
      return {
        pass: false,
        message: "Password must be at least 6 characters.",
      };
    }
    return { pass: true, message: "" };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validForm = checkFormValidation(formData);
    if (validForm.pass) {
      const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        setErrorSending(true);
        setErrorMessage("Failed to register. Please try again.");
        return;
      } else {
        setErrorSending(false);
        window.location.href = "/login";
        setFormData({ username: "", password: "" });
      }
    } else {
      setErrorSending(true);
      setErrorMessage(validForm.message);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary to-secondary flex justify-center items-center px-4">
      <main className="bg-background w-full max-w-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-4xl text-center font-bold text-primary mb-8">
          Register
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
                e.preventDefault();
                setFormData({ ...formData, username: e.target.value });
              }}
              type="text"
              placeholder="Enter your username"
              className="border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition"
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
            <input
              id="password"
              value={formData.password}
              onChange={(e) => {
                setErrorSending(false);
                e.preventDefault();
                setFormData({ ...formData, password: e.target.value });
              }}
              type="password"
              placeholder="Enter your password"
              className="border-2 border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary transition"
            />
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
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link to={"/login"} className="text-primary underline cursor-pointer">
            Login here
          </Link>
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;
