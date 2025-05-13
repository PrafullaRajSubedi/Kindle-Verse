import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, User, Heart, ShoppingCart, Menu, X, Bell } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3); // Example notification count
  const navItems = [
    { label: "HOME", to: "/" },
    { label: "SHOP", to: "/shop" },
    { label: "NEW RELEASES", to: "/new-releases" },
    { label: "AUTHORS", to: "/authors" },
    { label: "BLOG", to: "/blog" },
    { label: "CONTACT", to: "/contact" },
  ];

  useEffect(() => {
    // sync login state
    setIsLoggedIn(!!localStorage.getItem("token"));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // stays on Home
  };

  return (
    <>
      {/* Main Header / Navbar */}
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="text-2xl font-bold flex items-center">
              <span className="text-blue-700">K</span>indel
              <span className="text-blue-700">V</span>erse
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className="font-medium text-sm hover:text-blue-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* Icons + profile */}
            <div className="flex items-center space-x-4">
              <button
                aria-label="Search"
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Profile dropdown */}
              <div className="relative group">
                <button
                  aria-label="Account"
                  className="p-2 hover:bg-neutral-100 rounded-full transition"
                >
                  <User className="h-5 w-5" />
                </button>
                <div
                  className="
                  absolute right-0 mt-2 w-40 bg-white border border-neutral-200
                  shadow-lg rounded-lg opacity-0 group-hover:opacity-100
                  pointer-events-none group-hover:pointer-events-auto
                  transition-opacity
                "
                >
                  {isLoggedIn ? (
                    <ul>
                      <li>
                        <a
                          href="/profile"
                          className="block px-4 py-2 hover:bg-neutral-100"
                        >
                          My Profile
                        </a>
                      </li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-100"
                        >
                          Logout
                        </button>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      <li>
                        <Link
                          to="/login"
                          className="block px-4 py-2 hover:bg-neutral-100"
                        >
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/register"
                          className="block px-4 py-2 hover:bg-neutral-100"
                        >
                          Register
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Wishlist Icon */}
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <Heart className="h-5 w-5" />
              </Link>

              <button
                aria-label="Cart"
                className="p-2 hover:bg-neutral-100 rounded-full transition"
              >
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Notification Icon - Added after cart */}
              <div className="relative">
                <button
                  aria-label="Notifications"
                  className="p-2 hover:bg-neutral-100 rounded-full transition"
                >
                  <Bell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  )}
                </button>

                {/* Notification dropdown - optional */}
                <div
                  className="
                  absolute right-0 mt-2 w-64 bg-white border border-neutral-200
                  shadow-lg rounded-lg hidden group-hover:block
                "
                >
                  {/* You can add notification items here if needed */}
                </div>
              </div>

              {/* Mobile menu toggle */}
              <button
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-full transition"
                onClick={() => setMobileMenuOpen((v) => !v)}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-neutral-200 shadow-lg">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navItems.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-medium text-sm hover:text-blue-900 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
