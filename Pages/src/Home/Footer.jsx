import React from 'react';
import {
  Facebook,
  Twitter,
  Instagram,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Branding & social */}
          <div>
            <div className="text-2xl font-bold mb-6">
              <span className="text-blue-700">K</span>indel
              <span className="text-blue-700">V</span>erse
            </div>
            <p className="text-neutral-400 mb-6">
              Your premier destination for the latest books, exclusive author content, and literary community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-neutral-800 hover:blue-900 p-2 rounded-full transition-colors">
                <Facebook className="h-5 w-5"/>
              </a>
              <a href="#" className="bg-neutral-800 hover:bg-blue-900 p-2 rounded-full transition-colors">
                <Twitter className="h-5 w-5"/>
              </a>
              <a href="#" className="bg-neutral-800 hover:bg-blue-900 p-2 rounded-full transition-colors">
                <Instagram className="h-5 w-5"/>
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Shop</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-400 hover:text-white">New Releases</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Best Sellers</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Fiction</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Non-Fiction</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Children’s Books</a></li>
            </ul>
          </div>

          {/* About links */}
          <div>
            <h3 className="text-lg font-bold mb-6">About</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-neutral-400 hover:text-white">Our Story</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Blog</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Authors</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Events</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white">Careers</a></li>
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-lg font-bold mb-6">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-700 mr-2"/>
                <span className="text-neutral-400">Kamal Margh, Kathmandu</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-blue-700 mr-2"/>
                <span className="text-neutral-400">+977 9889213122</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-blue-700 mr-2"/>
                <span className="text-neutral-400">hello@kindelverse.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & legal */}
        <div className="border-t border-neutral-800 pt-8 text-center">
          <p className="text-neutral-400">&copy; 2025 KindelVerse. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="text-neutral-400 hover:text-white">Privacy Policy</a>
            <a href="#" className="text-neutral-400 hover:text-white">Terms of Service</a>
            <a href="#" className="text-neutral-400 hover:text-white">Shipping Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
