import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
  Bell
} from 'lucide-react';
import axios from 'axios';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [announcementList, setAnnouncementList] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navItems = [
    { label: 'HOME', to: '/' },
    { label: 'SHOP', to: '/shop' },
    { label: 'NEW RELEASES', to: '/new-releases' },
    { label: 'AUTHORS', to: '/authors' },
    { label: 'BLOG', to: '/blog' },
    { label: 'CONTACT', to: '/contact' },
  ];

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  useEffect(() => {
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:5126/api/announcement/get-active");
      setAnnouncementList(res.data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <>
      <header className="sticky top-0 bg-white/90 backdrop-blur-md shadow-sm z-30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold flex items-center">
              <span className="text-blue-700">K</span>indel
              <span className="text-blue-700">V</span>erse
            </div>

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

            <div className="flex items-center space-x-4">
              <button aria-label="Search" className="p-2 hover:bg-neutral-100 rounded-full transition">
                <Search className="h-5 w-5" />
              </button>

              <div className="relative group">
                <button aria-label="Account" className="p-2 hover:bg-neutral-100 rounded-full transition">
                  <User className="h-5 w-5" />
                </button>
                <div className="
                  absolute right-0 mt-2 w-40 bg-white border border-neutral-200
                  shadow-lg rounded-lg opacity-0 group-hover:opacity-100
                  pointer-events-none group-hover:pointer-events-auto
                  transition-opacity
                ">
                  {isLoggedIn ? (
                    <ul>
                      <li>
                        <a href="/profile" className="block px-4 py-2 hover:bg-neutral-100">
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
                        <Link to="/login" className="block px-4 py-2 hover:bg-neutral-100">
                          Login
                        </Link>
                      </li>
                      <li>
                        <Link to="/register" className="block px-4 py-2 hover:bg-neutral-100">
                          Register
                        </Link>
                      </li>
                    </ul>
                  )}
                </div>
              </div>

              <button aria-label="Wishlist" className="p-2 hover:bg-neutral-100 rounded-full transition">
                <Heart className="h-5 w-5" />
              </button>
              <button aria-label="Cart" className="p-2 hover:bg-neutral-100 rounded-full transition">
                <ShoppingCart className="h-5 w-5" />
              </button>

              {/* Bell with dynamic announcement dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(prev => !prev)}
                  aria-label="Notifications"
                  className="p-2 hover:bg-neutral-100 rounded-full transition"
                >
                  <Bell className="h-5 w-5" />
                  {announcementList.length > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {announcementList.length > 9 ? '9+' : announcementList.length}
                    </span>
                  )}
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-80 bg-white border border-neutral-200 shadow-lg rounded-lg z-50 p-4">
                    <h3 className="text-sm font-semibold mb-2">Latest Announcements</h3>
                    {announcementList.length === 0 ? (
                      <p className="text-gray-500 text-sm">No announcements available.</p>
                    ) : (
                      <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {announcementList.map(a => (
                          <li key={a.id} className="border rounded px-3 py-2">
                            <p className="font-medium text-gray-800">{a.title}</p>
                            <p className="text-sm text-gray-600 line-clamp-2">{a.message}</p>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              <button
                className="lg:hidden p-2 hover:bg-neutral-100 rounded-full transition"
                onClick={() => setMobileMenuOpen(v => !v)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>

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
