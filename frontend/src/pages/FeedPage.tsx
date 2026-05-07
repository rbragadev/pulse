import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import KudosCard from '@/components/shared/KudosCard';
import FeedComposer from '@/components/shared/FeedComposer';
import EmptyState from '@/components/shared/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import SeasonWidget from '@/components/widgets/SeasonWidget';
import CommunitiesWidget from '@/components/widgets/CommunitiesWidget';
import BirthdaysWidget from '@/components/widgets/BirthdaysWidget';
import EventsWidget from '@/components/widgets/EventsWidget';
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
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6 items-start">
        {/* Feed column */}
        <div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold text-foreground">Feed</h1>
            {total > 0 && (
              <p className="text-sm text-muted-foreground mt-0.5">
                {total} reconhecimentos publicados
              </p>
            )}
          </div>

          <FeedComposer onOpen={() => setIsDialogOpen(true)} />

          {isLoading && (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <Skeleton key={`sk-${i}`} className="h-48 w-full rounded-xl" />
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
                  Reconhecer alguém 🚀
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
        </div>

        {/* Sidebar widgets */}
        <aside className="hidden lg:block space-y-4 sticky top-8">
          <SeasonWidget />
          <CommunitiesWidget />
          <BirthdaysWidget />
          <EventsWidget />
        </aside>
      </div>

      <CreateKudosDialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} />
    </div>
  );
}
