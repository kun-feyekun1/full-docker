// src/components/auth/SignInForm.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema } from "../../schemas/signInSchema"; // adjust path

// Assume you have an auth context or hook to set token/user
// For now we'll simulate with localStorage + redirect
import { useNavigate } from "react-router-dom"; // if using react-router

export default function SignInForm() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    setError,
  } = useForm({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    console.log("Login attempt:", data);

    try {
      // Replace with your real API call
      // const response = await fetch("/api/auth/login", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(data),
      // });
      // const result = await response.json();

      // Simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1200));

      // In real app: store token
      // localStorage.setItem("token", result.token);
      // or use context: setAuth({ user: result.user, token: result.token });

      console.log("Login successful!");
      alert("Welcome back!"); // replace with toast

      // Redirect to dashboard/home
      navigate("/dashboard"); // or "/"
    } catch (err) {
      console.error("Login failed:", err);

      // Show server-side error (example: wrong credentials)
      setError("root", {
        type: "manual",
        message: "Invalid email or password. Please try again.",
      });
      // or field-specific: setError("email", { message: "..." })
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className={`mt-1 block w-full rounded-md border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register("password")}
            className={`mt-1 block w-full rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Server / general error */}
        {errors.root && (
          <p className="text-sm text-red-600 text-center">{errors.root.message}</p>
        )}

        {/* Forgot password link */}
        <div className="flex items-center justify-between text-sm">
          <a href="#" className="text-blue-600 hover:underline">
            Forgot password?
          </a>
          <a href="/signup" className="text-blue-600 hover:underline">
            Don't have an account? Sign up
          </a>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}