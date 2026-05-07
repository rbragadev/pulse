import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';

export function useRequireAuth() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return useAuthStore();
}

export function useRequireAdmin() {
  const auth = useRequireAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuthenticated && auth.user?.role !== 'ADMIN') {
      navigate('/feed');
    }
  }, [auth.isAuthenticated, auth.user, navigate]);

  return auth;
}
