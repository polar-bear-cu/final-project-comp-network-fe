import ConnectionCheck from "@/components/connection";
import { Button } from "@/components/ui/button";
import type { ResponseInterface } from "@/interface/api";
import type { FormDataInterface, FormErrorField } from "@/interface/form";
import { BASE_API_PATH } from "@/utils/const";
import { checkFormValidation } from "@/utils/function";
import { Eye, EyeOff, Loader } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormDataInterface>({
    username: "",
    password: "",
  });
  const [isLoading, setLoading] = useState(false);
  const [isErrorSending, setErrorSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorField, setErrorField] = useState<FormErrorField>();
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const isValid = checkFormValidation(formData);
    if (!isValid.pass) {
      setErrorSending(true);
      setErrorMessage(isValid.message);
      setErrorField(isValid.field);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_API_PATH}/v1/user/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include",
      });

      const data: ResponseInterface<string> = await response.json();

      if (!data.success) {
        setErrorSending(true);
        setErrorMessage(data.message);
        setErrorField(null);
      } else {
        setErrorSending(false);
        setErrorField(null);
        setFormData({ username: "", password: "" });
        window.location.href = "/login";
      }
    } catch (error) {
      setErrorSending(true);
      setErrorMessage("Something went wrong. Please try again.");
      setErrorField(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-primary to-secondary flex justify-center items-center px-4">
      <ConnectionCheck />
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
                e.preventDefault();
                setErrorSending(false);
                if (errorField === "username") setErrorField(null);
                setFormData({ ...formData, username: e.target.value });
              }}
              disabled={isLoading}
              type="text"
              placeholder="Enter your username"
              className={`border-2 ${
                errorField === "username"
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
                  e.preventDefault();
                  setErrorSending(false);
                  if (errorField === "password") setErrorField(null);
                  setFormData({ ...formData, password: e.target.value });
                }}
                disabled={isLoading}
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
                className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-primary"
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
          <Button
            disabled={isLoading}
            className={`mt-4 bg-primary text-white py-2 rounded-md text-lg font-semibold hover:bg-primary/90 transition active:scale-95 flex justify-center items-center ${
              isLoading ? "" : "cursor-pointer"
            }`}
          >
            {isLoading && <Loader size={20} className="animate-spin mr-2" />}
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <button
            disabled={isLoading}
            onClick={() => {
              navigate("/login");
            }}
            className={isLoading ? "" : "text-primary underline cursor-pointer"}
          >
            Login here
          </button>
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;
