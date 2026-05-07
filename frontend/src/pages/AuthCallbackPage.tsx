import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const token = searchParams.get('token');

  const { data, error } = useQuery({
    queryKey: ['auth-callback', token],
    queryFn: async () => {
      if (!token) throw new Error('No token');
      const res = await api.get('/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (data?.data) {
      setAuth(data.data, token!);
      navigate('/feed');
    }
    if (error || !token) {
      navigate('/login');
    }
  }, [data, error, token, setAuth, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <LoadingSpinner className="py-0 mb-4" />
        <p className="text-sm text-muted-foreground">Autenticando...</p>
      </div>
    </div>
  );
}
