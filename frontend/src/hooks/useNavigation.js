import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { isAuthenticated, hasAnyRole } from '@/lib/auth.js';

/**
 * Hook to protect routes and require authentication
 */
export const useRequireAuth = (requiredRoles = null) => {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    if (requiredRoles && !hasAnyRole(requiredRoles)) {
      router.push('/unauthorized');
    }
  }, [router, requiredRoles]);
};

/**
 * Hook to redirect if already authenticated
 */
export const useRedirectIfAuth = () => {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      router.push('/dashboard');
    }
  }, [router]);
};
