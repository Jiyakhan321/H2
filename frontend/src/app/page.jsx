'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { LayoutDashboard, LogIn, UserPlus, CheckCircle, Star, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation */}
        <nav className="flex justify-between items-center py-8">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
              TodoPro
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md flex items-center"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-red-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Hero Section */}
        <div className="text-center py-20">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Simplify Your Tasks
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
            Manage your daily tasks efficiently with our intuitive and beautiful task management application.
            Stay organized, boost productivity, and achieve your goals.
          </p>

          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/signup"
                className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center"
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Get Started Free
              </Link>
              <Link
                href="/login"
                className="border-2 border-red-500 text-red-600 hover:bg-red-50 px-8 py-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Management</h3>
            <p className="text-gray-600">
              Easily create, organize, and track your tasks with our intuitive interface and smart features.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Star className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Priority System</h3>
            <p className="text-gray-600">
              Set priorities and deadlines to focus on what matters most and never miss important tasks.
            </p>
          </div>

          <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-red-50 to-pink-50 border border-red-100">
            <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <LayoutDashboard className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Dashboard</h3>
            <p className="text-gray-600">
              Get insights and overview of your tasks with beautiful charts and statistics.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="py-12 border-t border-gray-200">
          <div className="text-center">
            <p className="text-gray-500">
              © 2026 TodoPro. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}