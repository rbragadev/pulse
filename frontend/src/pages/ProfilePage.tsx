import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import KudosCard from '@/components/shared/KudosCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { KudosPost, User } from '@/types';
import { MessageSquare } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const userId = id || currentUser?.id;

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.get(`/users/${userId}`).then((r) => r.data),
    enabled: !!userId,
  });

  const user: User | undefined = userData?.data;

  const { data: kudosReceivedData } = useQuery({
    queryKey: ['kudos-received', userId],
    queryFn: () =>
      api.get(`/kudos?recipientId=${userId}&limit=5`).then((r) => r.data),
    enabled: !!userId,
  });

  const { data: kudosSentData } = useQuery({
    queryKey: ['kudos-sent', userId],
    queryFn: () =>
      api.get(`/kudos?authorId=${userId}&limit=5`).then((r) => r.data),
    enabled: !!userId,
  });

  if (userLoading) return <LoadingSpinner />;
  if (!user) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">Usuário não encontrado.</p>
      </div>
    );
  }

  const receivedCount: number = kudosReceivedData?.data?.total || 0;
  const sentCount: number = kudosSentData?.data?.total || 0;
  const recentKudos: KudosPost[] = kudosReceivedData?.data?.posts || [];
  const isOwnProfile = currentUser?.id === userId;

  return (
    <div>
      {/* Profile card */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-8">
        <div className="flex items-start gap-5">
          <UserAvatar name={user.name} avatar={user.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-bold text-foreground">{user.name}</h1>
              <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                {user.role === 'ADMIN' ? 'Admin' : 'Colaborador'}
              </Badge>
              {isOwnProfile && (
                <Badge variant="outline" className="text-xs">
                  Você
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
            {user.department && (
              <p className="text-sm text-muted-foreground">{user.department.name}</p>
            )}

            {/* Stats */}
            <div className="flex gap-6 mt-5 pt-5 border-t border-border">
              <div>
                <p className="text-2xl font-bold text-primary">{receivedCount}</p>
                <p className="text-xs text-muted-foreground">Recebidos</p>
              </div>
              <div className="w-px bg-border" />
              <div>
                <p className="text-2xl font-bold text-foreground">{sentCount}</p>
                <p className="text-xs text-muted-foreground">Enviados</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent kudos */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Reconhecimentos recentes
        </h2>
        {recentKudos.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Nenhum reconhecimento ainda"
            description={
              isOwnProfile
                ? 'Você ainda não recebeu reconhecimentos.'
                : `${user.name} ainda não recebeu reconhecimentos.`
            }
          />
        ) : (
          <div className="space-y-4">
            {recentKudos.map((post) => (
              <KudosCard key={post.id} post={post} currentUserId={currentUser?.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
