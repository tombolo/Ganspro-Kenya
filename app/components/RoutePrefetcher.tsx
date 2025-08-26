// components/RoutePrefetcher.tsx
'use client';
import { useEffect } from 'react';

export default function RoutePrefetcher() {
    useEffect(() => {
        // Prefetch critical routes on app load
        const prefetchRoutes = async () => {
            try {
                // Use Promise.all to prefetch multiple routes in parallel
                await Promise.all([
                    // Prefetch the HTML pages
                    fetch('/dashboard', { method: 'HEAD' }).catch(() => { }),
                    fetch('/studentportal', { method: 'HEAD' }).catch(() => { }),

                    // Prefetch the API endpoint
                    fetch('/api/auth/user', { method: 'HEAD' }).catch(() => { })
                ]);

                console.log('Critical routes prefetched successfully');
            } catch (error) {
                // Silent fail - this is just for optimization
                console.log('Route prefetching completed (some routes may not have been available)');
            }
        };

        // Prefetch routes after a short delay to avoid blocking initial render
        const timer = setTimeout(() => {
            prefetchRoutes();
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return null; // This component doesn't render anything
}