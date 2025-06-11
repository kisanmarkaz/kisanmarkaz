import React, { useState } from 'react';
import { Eye, EyeOff, Facebook, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Button variant="ghost" asChild>
            <Link to="/">Back to Kisan Markaz</Link>
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Kisan Markaz</h1>
            <p className="mt-2 text-gray-600">Sign in to your account</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Login' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Create an account to start buying and selling'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form className="space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <Input placeholder="Enter your full name" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email or Phone
                </label>
                <Input placeholder="Enter email or phone number" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <Input type="password" placeholder="Confirm your password" />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
                    Forgot password?
                  </Link>
                </div>
              )}

              <Button className="w-full bg-green-600 hover:bg-green-700">
                {isLogin ? 'Login' : 'Create Account'}
              </Button>
            </form>

            <Separator className="my-4" />

            <Button variant="outline" className="w-full">
              <Facebook className="h-4 w-4 mr-2" />
              Continue with Facebook
            </Button>

            <div className="text-center">
              <span className="text-sm text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </div>

            {!isLogin && (
              <p className="text-xs text-gray-500 text-center">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-700">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-green-600 hover:text-green-700">
                  Privacy Policy
                </Link>
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
