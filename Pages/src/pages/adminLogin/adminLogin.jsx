import axios from "axios";
import { useState } from "react";
import { Eye, EyeOff, BookOpen, AlertCircle } from "lucide-react";

export default function AdminLogin() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoginView, setIsLoginView] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleLogin = async (e) => {
        if (e) e.preventDefault();

        if (
            (isLoginView && (!username.trim() || !password.trim())) ||
            (!isLoginView && !email.trim())
        ) {
            setErrorMessage("Please fill all required fields");
            return;
        }

        if (isLoginView) {
            try {
                const res = await axios.post("http://localhost:5150/api/admin/login", {
                    username,
                    password,
                });

                localStorage.setItem("token", res.data.token);
                setSuccessMessage("Login successful! Redirecting...");
                setErrorMessage("");

                setTimeout(() => {
                    window.location.href = "/admin/home";
                }, 1500);
            } catch (err) {
                setErrorMessage(
                    err.response?.data?.message || "Invalid login credentials"
                );
                setSuccessMessage("");
            }
        } else {
            try {
                await axios.post("http://localhost:5150/api/admin/forgot-password", {
                    email,
                });

                setSuccessMessage("Password reset link sent to your email!");
                setErrorMessage("");

                setTimeout(() => {
                    setIsLoginView(true);
                    setSuccessMessage("");
                }, 3000);
            } catch (err) {
                setErrorMessage(
                    err.response?.data?.message || "An error occurred. Please try again."
                );
                setSuccessMessage("");
            }
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
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-indigo-600 p-6 flex justify-center">
                        <div className="flex items-center space-x-2 text-white">
                            <BookOpen size={28} />
                            <h1 className="text-xl font-bold">BookStore Admin</h1>
                        </div>
                    </div>

                    {/* Form Body */}
                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                            {isLoginView ? "Admin Login" : "Reset Password"}
                        </h2>

                        {errorMessage && (
                            <div className="mb-4 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start space-x-2">
                                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                                <p>{errorMessage}</p>
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-4 p-2 bg-green-50 border-l-4 border-green-500 text-green-700">
                                <p>{successMessage}</p>
                            </div>
                        )}

                        <form onSubmit={handleLogin}>
                            {isLoginView ? (
                                <>
                                    {/* Username Input */}
                                    <div className="mb-4">
                                        <label
                                            htmlFor="username"
                                            className="block text-sm font-medium text-gray-700 mb-1"
                                        >
                                            Username
                                        </label>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                                            placeholder="admin"
                                            required
                                        />
                                    </div>

                                    {/* Password Input */}
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
                                                required
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
                                </>
                            ) : (
                                <>
                                    {/* Email Input for Forgot Password */}
                                    <div className="mb-6">
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
                                            required
                                        />
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 mb-4 font-medium"
                            >
                                {isLoginView ? "Login" : "Send OTP"}
                            </button>
                        </form>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={toggleView}
                                className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                            >
                                {isLoginView ? "Forgot password?" : "Back to login"}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-600 text-sm mt-6">
                    © {new Date().getFullYear()} BookStore Admin Portal
                </p>
            </div>
        </div>
    );
}
