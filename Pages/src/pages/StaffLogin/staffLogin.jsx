import { useState } from "react";
import { Eye, EyeOff, UserCheck, AlertCircle } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StaffLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      setSuccessMessage("");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5150/api/Staff/login",
        {
          email,
          password,
        }
      );

      setSuccessMessage(response.data.message || "Login successful");
      setErrorMessage("");

      setTimeout(() => {
        alert("Redirecting to staff dashboard...");
        navigate("/staff-panel");
      }, 1000);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Login failed. Please try again."
      );
      setSuccessMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-indigo-700 p-6 text-white flex items-center justify-center space-x-2">
          <UserCheck size={24} />
          <h1 className="text-xl font-bold">Staff Login</h1>
        </div>

        {/* Body */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-center text-gray-700 mb-6">
            Sign in to your staff account
          </h2>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 flex items-start text-red-600 bg-red-50 border-l-4 border-red-500 p-2">
              <AlertCircle size={18} className="mt-0.5 mr-2" />
              {errorMessage}
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-500 p-2 text-green-700">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="staff@bookstore.com"
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="********"
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 font-medium transition"
            >
              Login
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 p-4">
          © {new Date().getFullYear()} Kindle-Verse Staff Portal
        </p>
      </div>
    </div>
  );
}
