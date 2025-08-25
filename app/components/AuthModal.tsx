// components/AuthModal.tsx
'use client';
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser } from "react-icons/fi";
import { signIn, useSession } from 'next-auth/react';

type AuthModalProps = {
    isOpen: boolean;
    onClose: () => void;
    mode: "login" | "signup";
    switchMode: (mode: "login" | "signup") => void;
    onAuthSuccess?: () => void; // Add this prop
};

interface SignupResponse {
    success: boolean;
    message?: string;
    error?: string;
    userId?: string;
    user?: {
        email: string;
        name: string;
    };
}

export default function AuthModal({ isOpen, onClose, mode, switchMode, onAuthSuccess }: AuthModalProps) {
    const { update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleAuthSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Validate passwords match for signup
        if (mode === "signup" && password !== confirmPassword) {
            setError("Passwords do not match");
            setIsLoading(false);
            return;
        }

        try {
            if (mode === "login") {
                // Use signIn with redirect: false to prevent NextAuth from redirecting
                const result = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (result?.error) {
                    throw new Error(result.error);
                }

                if (result?.ok) {
                    // Update session to get the latest data
                    await update();
                    onClose();

                    // Call the success callback if provided
                    if (onAuthSuccess) {
                        onAuthSuccess();
                    }
                }
            } else {
                // Signup logic
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'json',
                    },
                    body: JSON.stringify({ email, password, name }),
                });

                const data: SignupResponse = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || 'Something went wrong');
                }

                // After successful signup, automatically log the user in
                const loginResult = await signIn('credentials', {
                    redirect: false,
                    email,
                    password,
                });

                if (loginResult?.error) {
                    throw new Error(loginResult.error);
                }

                if (loginResult?.ok) {
                    await update();
                    onClose();

                    // Call the success callback if provided
                    if (onAuthSuccess) {
                        onAuthSuccess();
                    }
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setEmail('');
        setPassword('');
        setName('');
        setConfirmPassword('');
        setError('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 20, opacity: 0 }}
                        className="relative bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 w-full max-w-md mx-4 border border-gray-200 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                        >
                            <FiX className="text-gray-500 hover:text-gray-700" size={20} />
                        </button>

                        <div className="text-center">
                            <div className="mx-auto h-16 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center mb-4 shadow-md">
                                <FiUser className="text-white text-2xl" />
                            </div>
                            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                                {mode === "login" ? "Welcome back!" : "Join us today"}
                            </h2>
                            <p className="text-gray-600 mb-6">
                                {mode === "login" ? "Sign in to continue" : "Create your account in seconds"}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded" role="alert">
                                <p>{error}</p>
                            </div>
                        )}

                        <form className="space-y-5" onSubmit={handleAuthSubmit}>
                            {mode === "signup" && (
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            )}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                                    required
                                    minLength={8}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {mode === "signup" && (
                                    <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters</p>
                                )}
                            </div>

                            {mode === "signup" && (
                                <div>
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        minLength={8}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                            )}

                            <div>
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all duration-300 shadow-md flex items-center justify-center"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            {mode === "login" ? "Signing in..." : "Creating account..."}
                                        </>
                                    ) : (
                                        mode === "login" ? "Sign In" : "Sign Up"
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-6 text-center text-sm text-gray-600">
                            {mode === "login" ? (
                                <>
                                    Don&apos;t have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                                        onClick={() => {
                                            resetForm();
                                            switchMode("signup");
                                        }}
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        type="button"
                                        className="text-orange-600 hover:text-orange-800 font-medium transition-colors duration-200"
                                        onClick={() => {
                                            resetForm();
                                            switchMode("login");
                                        }}
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}