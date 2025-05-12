import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminResetPassword() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = (e) => {
    e.preventDefault();

    if (!otp || !newPassword || !confirmPassword) {
      setErrorMessage("All fields are required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    // Simulate OTP verification and reset
    console.log("Resetting password with OTP:", otp);
    setSuccessMessage("Password reset successful! Redirecting...");
    setErrorMessage("");

    setTimeout(() => {
      navigate("/admin/login"); // adjust route if needed
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="bg-indigo-600 p-6 flex justify-center">
            <div className="flex items-center space-x-2 text-white">
              <Lock size={24} />
              <h1 className="text-xl font-bold">Reset Admin Password</h1>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Enter OTP & Set New Password
            </h2>

            {/* Error */}
            {errorMessage && (
              <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start space-x-2">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{errorMessage}</p>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-start space-x-2">
                <CheckCircle size={18} className="mt-0.5 flex-shrink-0" />
                <p>{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleReset}>
              {/* OTP */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter OTP from your email"
                />
              </div>

              {/* New Password */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Re-enter password"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition font-medium"
              >
                Reset Password
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          &copy; {new Date().getFullYear()} BookStore Admin Portal
        </p>
      </div>
    </div>
  );
}
