import { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import KudosCard from '@/components/shared/KudosCard';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import CreateKudosDialog from './CreateKudosDialog';
import { KudosPost } from '@/types';

export default function FeedPage() {
  const { user } = useAuthStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['kudos', page],
    queryFn: () => api.get(`/kudos/feed?page=${page}&limit=20`).then((r) => r.data),
  });

  const posts: KudosPost[] = data?.data?.posts || [];
  const total: number = data?.data?.total || 0;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {total > 0 ? `${total} reconhecimentos publicados` : 'Sem reconhecimentos ainda'}
          </p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Reconhecer
        </button>
      </div>

      {/* Content */}
      {isLoading && (
        <div className="space-y-4">
          {new Array(5).fill(null).map((_, i) => (
            // eslint-disable-next-line react/no-array-index-key
            <Skeleton key={`skeleton-${i}`} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && posts.length === 0 && (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum reconhecimento ainda"
          description="Seja o primeiro a reconhecer um colega!"
          action={
            <button
              onClick={() => setIsDialogOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Criar reconhecimento
            </button>
          }
        />
      )}

      {!isLoading && posts.length > 0 && (
        <div className="space-y-4">
          {posts.map((post) => (
            <KudosCard key={post.id} post={post} currentUserId={user?.id} />
          ))}
          {total > page * 20 && (
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-full py-3 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 rounded-xl transition-all"
            >
              Carregar mais
            </button>
          )}
        </div>
      )}

      <CreateKudosDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}
