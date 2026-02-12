// src/components/auth/SignUpForm.jsx

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom"; // ← NEW: for redirect

import { signUpSchema } from "../../schemas/signUpSchema"; // adjust path

export default function SignUpForm() {
  const navigate = useNavigate(); // ← Hook for navigation

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
    setError, // ← Useful for server-side errors
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  const onSubmit = async (data) => {
    console.log("Valid signup data:", data);

    try {
      // Replace this simulation with your REAL backend call
      // Example with fetch (or use axios):
      // const response = await fetch("/api/auth/signup", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({
      //     email: data.email,
      //     password: data.password,
      //   }),
      // });
      // if (!response.ok) throw new Error("Signup failed");
      // const result = await response.json(); // { token, user }

      // Simulate successful signup + auto-login (backend creates account & returns token)
      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake network delay

      // In real app: get token from API response
      const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // ← replace with real one

      // Store token → this "logs the user in" automatically
      localStorage.setItem("authToken", fakeToken);
      // Optional: store user info too
      // localStorage.setItem("user", JSON.stringify({ email: data.email, name: "New User" }));

      // Success feedback (use toast library in production instead of alert)
      alert("Account created successfully! You're now signed in.");

      // Reset form (optional — usually skipped before redirect)
      reset();

      // Redirect to dashboard/home → auto-logged-in experience
      navigate("/dashboard", { replace: true }); // replace: true → no back button to form
      // or navigate("/") for home page
    } catch (error) {
      console.error("Signup error:", error);

      // Show user-friendly error (e.g. email already exists)
      setError("root.serverError", {
        type: "manual",
        message:
          error.message.includes("exists")
            ? "This email is already registered."
            : "Something went wrong. Please try again later.",
      });

      // Optional: alert for quick testing
      alert("Signup failed. Check console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

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

        {/* Password & Confirm Password (same as before) */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            {...register("password")}
            className={`mt-1 block w-full rounded-md border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
            className={`mt-1 block w-full rounded-md border ${
              errors.confirmPassword ? "border-red-500" : "border-gray-300"
            } px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm`}
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="acceptTerms"
              type="checkbox"
              {...register("acceptTerms")}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </div>
          <label htmlFor="acceptTerms" className="ml-3 text-sm text-gray-600">
            I accept the{" "}
            <a href="#" className="text-blue-600 hover:underline">
              terms and conditions
            </a>
          </label>
        </div>
        {errors.acceptTerms && (
          <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
        )}

        {/* Server-side / general error display */}
        {errors.root?.serverError && (
          <p className="text-sm text-red-600 text-center font-medium">
            {errors.root.serverError.message}
          </p>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
}