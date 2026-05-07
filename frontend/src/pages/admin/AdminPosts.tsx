import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Heart } from 'lucide-react';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { formatRelativeTime } from '@/lib/utils';
import { KudosPost } from '@/types';
import { MessageSquare } from 'lucide-react';

export default function AdminPosts() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-posts', page],
    queryFn: () =>
      api.get(`/kudos?page=${page}&limit=20`).then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-posts'] }),
  });

  const posts: KudosPost[] = data?.data?.posts || [];
  const total: number = data?.data?.total || 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Posts</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} reconhecimentos publicados</p>
      </div>

      {posts.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title="Nenhum post ainda"
          description="Nenhum reconhecimento foi publicado ainda."
        />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-card border border-border rounded-xl p-4 hover:border-primary/20 transition-all"
            >
              <div className="flex items-start gap-3">
                {/* Author avatar */}
                <UserAvatar name={post.author.name} avatar={post.author.avatar} size="sm" />

                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground text-sm">
                        {post.author.name}
                      </span>
                      <span className="text-muted-foreground text-xs">→</span>
                      <span className="font-medium text-primary text-sm">
                        {post.recipient.name}
                      </span>
                      {/* Category */}
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
                        style={{
                          backgroundColor: post.category.color
                            ? `${post.category.color}20`
                            : 'hsl(var(--secondary))',
                          borderColor: post.category.color
                            ? `${post.category.color}40`
                            : 'hsl(var(--border))',
                          color: post.category.color || 'hsl(var(--muted-foreground))',
                        }}
                      >
                        {post.category.icon && <span>{post.category.icon}</span>}
                        {post.category.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(post.createdAt)}
                      </span>
                      <button
                        onClick={() => {
                          if (confirm('Tem certeza que deseja remover este post?')) {
                            deleteMutation.mutate(post.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                        title="Remover post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-2">
                    {post.message}
                  </p>

                  {/* Meta */}
                  <div className="mt-2 flex items-center gap-3">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Heart className="w-3 h-3" />
                      {post._count.likes}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > page * 20 && (
        <button
          onClick={() => setPage((p) => p + 1)}
          className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 rounded-xl transition-all"
        >
          Carregar mais
        </button>
      )}
    </div>
  );
}
