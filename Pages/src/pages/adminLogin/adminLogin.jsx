import { useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = (e) => {
    if (e) e.preventDefault();

    // Simple validation
    if (!email.trim() || (!password.trim() && isLoginView)) {
      setErrorMessage("Please enter both email and password");
      return;
    }

    if (isLoginView) {
      // Here you would connect to your authentication system
      console.log("Login attempt:", { email, password });
      setSuccessMessage("Login successful! Redirecting...");
      setErrorMessage("");
      // Simulate redirect to dashboard
      setTimeout(() => {
        alert("Redirecting to admin dashboard...");
      }, 1500);
    } else {
      // Here you would handle the password reset request
      console.log("Password reset requested for:", email);
      setSuccessMessage("Password reset link sent to your email!");
      setErrorMessage("");
      // Return to login view after reset request
      setTimeout(() => {
        setIsLoginView(true);
        setSuccessMessage("");
      }, 3000);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          {/* Logo Header */}
          <div className="bg-indigo-600 p-6 flex justify-center">
            <div className="flex items-center space-x-2 text-white">
              <BookOpen size={28} />
              <h1 className="text-xl font-bold">BookStore Admin</h1>
            </div>
          </div>

          {/* Form Container */}
          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {isLoginView ? "Admin Login" : "Reset Password"}
            </h2>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start space-x-2">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700">
                <p>{successMessage}</p>
              </div>
            )}

            {/* Login Form */}
            <div>
              {/* Email Input */}
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                  placeholder="admin@bookstore.com"
                />
              </div>

              {/* Password Input (only shown on login view) */}
              {isLoginView && (
                <div className="mb-6">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                      placeholder="********"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                onClick={handleLogin}
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 mb-4 font-medium cursor-pointer"
              >
                {isLoginView ? "Login" : "Check Email for OTP"}
              </button>

              {/* Toggle View */}
              <div className="text-center">
                <button
                  type="button"
                  onClick={toggleView}
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium cursor-pointer"
                >
                  {isLoginView ? "Forgot password?" : "Back to login"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          © {new Date().getFullYear()} BookStore Admin Portal
        </p>
      </div>
    </div>
  );
}
