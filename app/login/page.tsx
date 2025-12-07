"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lock, Mail } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("xyz@xyz.com");
  const [password, setPassword] = useState("PartnerHome2025!");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Simulate login delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulate authentication - accept any email/password for demo
    // In production, this would call an API
    if (email && password) {
      // Store authentication state
      localStorage.setItem("supplier_authenticated", "true");
      localStorage.setItem("supplier_email", email);
      localStorage.setItem("supplier_name", "XYZ Supplier");
      
      // Redirect to dashboard
      router.push("/");
      router.refresh();
    } else {
      setError("Please enter both email and password");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo and Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Partner Home
          </h2>
          <p className="text-sm text-gray-600">
            Supplier Portal Login
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl border border-purple-100 p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
                  placeholder="xyz@xyz.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-400"
                  placeholder="PartnerHome2025!"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in to Partner Home"
                )}
              </button>
            </div>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-center text-gray-500 mb-2">
              Demo Mode: Credentials pre-filled for quick access
            </p>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span className="font-mono">xyz@xyz.com</span>
              </div>
              <div className="flex items-center justify-between mt-1">
                <span className="font-medium">Password:</span>
                <span className="font-mono">PartnerHome2025!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Partner Home. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}

