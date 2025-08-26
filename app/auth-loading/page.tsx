// app/auth-loading/page.tsx - Faster version
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from 'next-auth/jwt';

export default function AuthLoading() {
    const router = useRouter();

    useEffect(() => {
        const determineRedirect = async () => {
            try {
                // Try to get the token and role from API
                const response = await fetch('/api/auth/user');
                if (response.ok) {
                    const userData = await response.json();
                    router.replace(userData.role === 'admin' ? '/dashboard' : '/studentportal');
                } else {
                    // Final fallback: redirect to student portal
                    router.replace('/studentportal');
                }
            } catch (error) {
                console.error('Error determining redirect:', error);
                router.replace('/studentportal');
            }
        };

        determineRedirect();
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Setting up your experience...</p>
                <p className="text-sm text-gray-500">You&apos;ll be redirected in a moment</p>
            </div>
        </div>
    );
}