'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/useAuthStore';

export function AuthMiddleware({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const publicPaths = ['/', '/auth/client/sign-in', '/auth/admin/sign-in', '/auth/client/sign-up', '/auth/admin/sign-up'];
    
    // Allow public paths
    if (publicPaths.includes(pathname)) {
      return;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated()) {
      router.push('/auth/client/sign-in');
      return;
    }

    // Check role-based access
    const isAdminPath = pathname.startsWith('/admin');
    const isClientPath = pathname.startsWith('/client');

    if (isAdminPath && user?.role !== 'nutritionist') {
      router.push('/client/chat');
      return;
    }

    if (isClientPath && user?.role !== 'client') {
      router.push('/admin/chat');
      return;
    }
  }, [isAuthenticated, pathname, user]);

  return <>{children}</>;
} 