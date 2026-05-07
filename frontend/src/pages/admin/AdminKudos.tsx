import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, EyeOff, Trash2, RotateCcw, Heart, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { formatRelativeTime } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';
import { KudosPost, KudosPostStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_LABELS: Record<KudosPostStatus, string> = {
  ACTIVE: 'Ativo',
  HIDDEN: 'Oculto',
  REMOVED: 'Removido',
};

const STATUS_COLORS: Record<KudosPostStatus, string> = {
  ACTIVE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  HIDDEN: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  REMOVED: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function AdminKudos() {
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<KudosPostStatus | ''>('');
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-kudos', page, filterStatus],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' });
      if (filterStatus) params.set('status', filterStatus);
      return api.get(`/admin/kudos?${params}`).then((r) => r.data);
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: KudosPostStatus }) =>
      api.patch(`/admin/kudos/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-kudos'] });
      toast({ title: 'Status atualizado' });
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  const posts: KudosPost[] = data?.data?.posts ?? [];
  const total: number = data?.data?.total ?? 0;

  const filters: Array<{ value: KudosPostStatus | ''; label: string }> = [
    { value: '', label: 'Todos' },
    { value: 'ACTIVE', label: 'Ativos' },
    { value: 'HIDDEN', label: 'Ocultos' },
    { value: 'REMOVED', label: 'Removidos' },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Moderação de Kudos</h1>
          <p className="text-sm text-muted-foreground mt-1">{total} reconhecimentos</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 bg-secondary rounded-xl p-1 w-fit">
        {filters.map((f) => (
          <button key={f.value} onClick={() => { setFilterStatus(f.value); setPage(1); }}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filterStatus === f.value ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}>
            {f.label}
          </button>
        ))}
      </div>

      {posts.length === 0 ? (
        <EmptyState icon={MessageSquare} title="Nenhum post encontrado" description="Nenhum reconhecimento neste filtro." />
      ) : (
        <div className="space-y-3">
          {posts.map((post) => (
            <div key={post.id} className={cn('bg-card border rounded-xl p-4 transition-all', post.status !== 'ACTIVE' && 'opacity-60')}>
              <div className="flex items-start gap-3">
                <UserAvatar name={post.author.name} avatar={post.author.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-foreground text-sm">{post.author.name}</span>
                      <span className="text-muted-foreground text-xs">→</span>
                      <span className="font-medium text-primary text-sm">{post.recipient.name}</span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border"
                        style={{ background: `${post.category.color}20`, borderColor: `${post.category.color}40`, color: post.category.color ?? undefined }}>
                        {post.category.icon} {post.category.name}
                      </span>
                      <span className={cn('text-xs px-2 py-0.5 rounded-full border font-medium', STATUS_COLORS[post.status])}>
                        {STATUS_LABELS[post.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-xs text-muted-foreground mr-1">{formatRelativeTime(post.createdAt)}</span>

                      {post.status !== 'ACTIVE' && (
                        <button onClick={() => statusMutation.mutate({ id: post.id, status: 'ACTIVE' })}
                          disabled={statusMutation.isPending}
                          className="p-1.5 rounded-lg text-emerald-400 hover:bg-emerald-500/10 transition-all"
                          title="Restaurar">
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {post.status === 'ACTIVE' && (
                        <button onClick={() => statusMutation.mutate({ id: post.id, status: 'HIDDEN' })}
                          disabled={statusMutation.isPending}
                          className="p-1.5 rounded-lg text-yellow-400 hover:bg-yellow-500/10 transition-all"
                          title="Ocultar">
                          <EyeOff className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {post.status !== 'REMOVED' && (
                        <button onClick={() => statusMutation.mutate({ id: post.id, status: 'REMOVED' })}
                          disabled={statusMutation.isPending}
                          className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                          title="Remover">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {post.status === 'REMOVED' && (
                        <button onClick={() => statusMutation.mutate({ id: post.id, status: 'HIDDEN' })}
                          disabled={statusMutation.isPending}
                          className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-all"
                          title="Ocultar">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-foreground/80 leading-relaxed line-clamp-2">{post.message}</p>
                  <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                    <Heart className="w-3 h-3" />
                    <span>{post._count.likes}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {total > page * 20 && (
        <button onClick={() => setPage((p) => p + 1)}
          className="w-full mt-4 py-3 text-sm text-muted-foreground hover:text-foreground border border-border hover:border-primary/30 rounded-xl transition-all">
          Carregar mais
        </button>
      )}
    </div>
  );
}
