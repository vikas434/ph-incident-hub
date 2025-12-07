"use client";

import Link from "next/link";
import { Camera, User, Building2 } from "lucide-react";

export default function NavigationBar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Partner Home */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                Partner Home
              </span>
              <span className="text-xs text-gray-500 -mt-1">
                XYZ Supplier
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/analytics"
              className="text-gray-700 hover:text-purple-600 transition-colors font-medium"
            >
              Analytics
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600 font-medium">XYZ Supplier</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

