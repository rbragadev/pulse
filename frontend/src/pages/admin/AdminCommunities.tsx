import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Globe, Lock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { useToast } from '@/hooks/useToast';
import { Community } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'ARCHIVED'] as const;
type CommunityStatus = typeof STATUS_OPTIONS[number];

const STATUS_LABELS: Record<CommunityStatus, string> = {
  ACTIVE: 'Ativa',
  INACTIVE: 'Inativa',
  ARCHIVED: 'Arquivada',
};

const STATUS_STYLES: Record<CommunityStatus, string> = {
  ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
  INACTIVE: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  ARCHIVED: 'bg-red-500/10 text-red-400 border-red-500/20',
};

interface AdminCommunity extends Community {
  createdBy?: { id: string; name: string; avatar?: string };
}

export default function AdminCommunities() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const LIMIT = 15;

  const { data, isLoading } = useQuery({
    queryKey: ['admin-communities', page],
    queryFn: () => api.get(`/admin/communities?page=${page}&limit=${LIMIT}`).then((r) => r.data?.data ?? r.data),
  });

  const communities: AdminCommunity[] = data?.communities ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.ceil(total / LIMIT);

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: CommunityStatus }) =>
      api.patch(`/admin/communities/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-communities'] });
      toast({ title: 'Status atualizado' });
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  const officialMutation = useMutation({
    mutationFn: ({ id, isOfficial }: { id: string; isOfficial: boolean }) =>
      api.patch(`/admin/communities/${id}`, { isOfficial }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-communities'] });
      toast({ title: 'Comunidade atualizada' });
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Comunidades</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} comunidades no total</p>
      </div>

      {communities.length === 0 ? (
        <EmptyState icon={Users} title="Nenhuma comunidade" description="Nenhuma comunidade foi criada ainda." />
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Comunidade</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Membros</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Criador</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Oficial</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {communities.map((community) => (
                  <tr key={community.id} className="hover:bg-secondary/30 transition-colors">
                    {/* Community info */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-secondary shrink-0">
                          {community.avatarUrl ? (
                            <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-sm">
                              {community.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-foreground text-sm truncate">{community.name}</p>
                          <div className="flex items-center gap-1 mt-0.5">
                            {community.visibility === 'PUBLIC'
                              ? <Globe className="w-3 h-3 text-muted-foreground" />
                              : <Lock className="w-3 h-3 text-muted-foreground" />}
                            <span className="text-[10px] text-muted-foreground">{community.category || '—'}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Members */}
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {community._count?.members ?? 0}
                      </span>
                    </td>

                    {/* Creator */}
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-muted-foreground truncate max-w-[120px] block">
                        {community.createdBy?.name ?? '—'}
                      </span>
                    </td>

                    {/* Status selector */}
                    <td className="px-4 py-3">
                      <select
                        value={community.status}
                        onChange={(e) =>
                          statusMutation.mutate({ id: community.id, status: e.target.value as CommunityStatus })
                        }
                        className={cn(
                          'text-xs font-medium px-2 py-0.5 rounded-full border bg-transparent cursor-pointer focus:outline-none',
                          STATUS_STYLES[community.status as CommunityStatus] ?? STATUS_STYLES.ACTIVE,
                        )}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s} className="bg-card text-foreground">
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Official toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => officialMutation.mutate({ id: community.id, isOfficial: !community.isOfficial })}
                        className={cn(
                          'flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-all',
                          community.isOfficial
                            ? 'bg-yellow-400/15 text-yellow-400 border-yellow-400/30 hover:bg-yellow-400/25'
                            : 'bg-secondary text-muted-foreground border-border hover:border-yellow-400/30 hover:text-yellow-400',
                        )}
                      >
                        <Star className="w-3 h-3" />
                        {community.isOfficial ? 'Oficial' : 'Marcar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-muted-foreground">
                Página {page} de {totalPages} · {total} comunidades
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
