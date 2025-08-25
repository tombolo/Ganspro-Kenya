'use client';
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiUser } from "react-icons/fi";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AuthModal from './AuthModal';

// Define a custom session user type that includes the role property
interface CustomSessionUser {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
}

export default function Header() {
    const { data: session, status, update } = useSession();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [authModalOpen, setAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState<"login" | "signup">("login");
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const router = useRouter();

    // Use the session status to determine if user is authenticated
    const isAuthenticated = status === "authenticated";

    const openAuthModal = (mode: "login" | "signup") => {
        setAuthMode(mode);
        setAuthModalOpen(true);
        setMobileMenuOpen(false);
    };

    const closeAuthModal = () => {
        setAuthModalOpen(false);
    };

    const switchAuthMode = (mode: "login" | "signup") => {
        setAuthMode(mode);
    };

    // Handle successful authentication from AuthModal
    const handleAuthSuccess = () => {
        setShouldRedirect(true);
        closeAuthModal();
    };

    // Redirect user based on role after successful authentication
    useEffect(() => {
        if (shouldRedirect && isAuthenticated && session?.user) {
            const userRole = (session.user as CustomSessionUser).role || 'student';

            // Redirect based on role
            if (userRole === "admin") {
                router.push("/dashboard");
            } else {
                router.push("/studentportal");
            }

            setShouldRedirect(false);
        }
    }, [shouldRedirect, isAuthenticated, session, router]);

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <nav className="mx-auto px-4 sm:px-8 lg:px-10">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo and brand name */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center space-x-3">
                                <Image
                                    src="/LOGO.png"
                                    alt="Ganspro Logo"
                                    width={70}
                                    height={70}
                                    className="rounded-lg"
                                />
                                <span className="text-2xl sm:text-2xl font-bold text-indigo-800">
                                    Ganspro
                                </span>
                            </Link>
                        </div>

                        {/* Desktop navigation */}
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <Link
                                    href="/"
                                    className="text-indigo-700 hover:text-indigo-900 font-medium px-3 py-3 rounded-md text-lg transition-colors duration-200"
                                >
                                    Home
                                </Link>
                                <Link
                                    href="/about"
                                    className="text-gray-600 hover:text-indigo-700 font-medium px-3 py-3 rounded-md text-lg transition-colors duration-200"
                                >
                                    About
                                </Link>
                                <Link
                                    href="/how-it-works"
                                    className="text-gray-600 hover:text-indigo-700 font-medium px-3 py-3 rounded-md text-lg transition-colors duration-200"
                                >
                                    How It Works
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-gray-600 hover:text-indigo-700 font-medium px-3 py-3 rounded-md text-lg transition-colors duration-200"
                                >
                                    Contact
                                </Link>
                            </div>
                        </div>

                        {/* Auth buttons - desktop */}
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6 space-x-4">
                                {!isAuthenticated && (
                                    <>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openAuthModal("login")}
                                            className="px-6 py-2 bg-white text-indigo-700 font-medium rounded-full border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 shadow-sm flex items-center text-lg"
                                        >
                                            <FiUser className="mr-2" />
                                            Login
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => openAuthModal("signup")}
                                            className="px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg text-lg"
                                        >
                                            Sign Up
                                        </motion.button>
                                    </>
                                )}

                                {isAuthenticated && session?.user && (
                                    <Link
                                        href={(session.user as CustomSessionUser).role === "admin" ? "/dashboard" : "/studentportal"}
                                        className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-full transition-all duration-300 shadow-lg text-lg"
                                    >
                                        {(session.user as CustomSessionUser).role === "admin"
                                            ? "Go to Dashboard"
                                            : "Go to Student Portal"}
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Mobile menu button */}
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                aria-expanded="false"
                            >
                                <span className="sr-only">Open main menu</span>
                                {!mobileMenuOpen ? (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="block h-6 w-6"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile menu */}
                <div
                    className={`md:hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                        } overflow-hidden`}
                >
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
                        <Link
                            href="/"
                            className="block px-3 py-2 rounded-md text-base font-medium text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 transition-colors duration-200"
                        >
                            Home
                        </Link>
                        <Link
                            href="/about"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            About
                        </Link>
                        <Link
                            href="/how-it-works"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            How It Works
                        </Link>
                        <Link
                            href="/contact"
                            className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-indigo-700 hover:bg-gray-50 transition-colors duration-200"
                        >
                            Contact
                        </Link>
                        <div className="pt-4 pb-2 border-t border-gray-200">
                            {!isAuthenticated ? (
                                <div className="flex flex-col space-y-3">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => openAuthModal("login")}
                                        className="w-full px-4 py-3 text-center bg-white text-indigo-700 font-medium rounded-lg border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300 shadow-sm flex items-center justify-center"
                                    >
                                        <FiUser className="mr-2" />
                                        Login
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => openAuthModal("signup")}
                                        className="w-full px-4 py-3 text-center bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg"
                                    >
                                        Sign Up
                                    </motion.button>
                                </div>
                            ) : (
                                session?.user && (
                                    <Link
                                        href={(session.user as CustomSessionUser).role === "admin" ? "/dashboard" : "/studentportal"}
                                        className="w-full px-4 py-3 text-center bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg block"
                                    >
                                        {(session.user as CustomSessionUser).role === "admin"
                                            ? "Go to Dashboard"
                                            : "Go to Student Portal"}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={authModalOpen}
                onClose={closeAuthModal}
                mode={authMode}
                switchMode={switchAuthMode}
                onAuthSuccess={handleAuthSuccess}
            />
        </>
    );
}