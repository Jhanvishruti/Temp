import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft } from 'lucide-react';
import { Button } from '../components/Button';
import toast from 'react-hot-toast';
import { getUserRoleFromToken } from '../services/authService';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      email: '',
      password: '',
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch('http://localhost:5247/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(errorData.message || 'Login failed');
          return;
        }

        const data = await response.json();
        document.cookie = `auth=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict; Secure`;

        const userRole = getUserRoleFromToken();
        const dashboardRoute = userRole === 'ProjectOwner' ? '/dashboard/project-owner' : '/dashboard/contributor';

        toast.success('Welcome back!');
        navigate(dashboardRoute);
      } catch (error) {
        console.error('Login error:', error);
        toast.error('An error occurred during login');
      }
    }
  };

  const inputStyles = "mt-1 block w-full rounded-lg border border-gray-600 bg-transparent px-4 py-2 text-white placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500";

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950">
      <button
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 flex items-center gap-2 rounded-lg px-4 py-2 text-blue-300 transition-colors hover:text-blue-200"
      >
        <ArrowLeft className="h-5 w-5" />
        Back to Home
      </button>

      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 shadow-xl backdrop-blur-lg">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
              Welcome back!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              Sign in to continue to your dashboard
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4 rounded-md">
              <div>
                <label className="block text-sm font-medium text-white">Email address *</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`${inputStyles} pl-10`}
                    placeholder="Enter your email"
                    required
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Password *</label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className={`${inputStyles} pl-10`}
                    placeholder="Enter your password"
                    required
                  />
                  {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 font-semibold text-white hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              Sign in
            </Button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/')}
                className="font-medium text-blue-400 transition-colors hover:text-blue-300"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};