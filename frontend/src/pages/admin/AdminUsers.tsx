import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Shield, ShieldOff, UserX, UserCheck } from 'lucide-react';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/useToast';
import { User } from '@/types';

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => api.get(`/admin/users?page=${page}&limit=20`).then((r) => r.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Record<string, unknown> }) =>
      api.patch(`/admin/users/${id}`, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({ title: 'Usuário atualizado' });
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  const users: User[] = data?.data?.users ?? [];
  const total: number = data?.data?.total ?? 0;

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Usuários</h1>
        <p className="text-sm text-muted-foreground mt-1">{total} usuários cadastrados</p>
      </div>

      <div className="space-y-2">
        {users.map((u) => (
          <div
            key={u.id}
            className={`bg-card border rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all ${
              u.isActive ? 'border-border hover:border-primary/20' : 'border-border/50 opacity-60'
            }`}
          >
            <UserAvatar name={u.name} avatar={u.avatar} size="sm" />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium text-foreground text-sm">{u.name}</p>
                <Badge variant={u.role === 'ADMIN' ? 'default' : 'secondary'} className="text-xs">
                  {u.role === 'ADMIN' ? 'Admin' : 'Usuário'}
                </Badge>
                {!u.isActive && (
                  <Badge variant="outline" className="text-xs border-red-500/30 text-red-400">
                    Inativo
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground truncate">{u.email}</p>
              {u.department && (
                <p className="text-xs text-muted-foreground">{u.department.name}</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => updateMutation.mutate({ id: u.id, patch: { isActive: !u.isActive } })}
                disabled={updateMutation.isPending}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-all disabled:opacity-50"
                title={u.isActive ? 'Desativar' : 'Ativar'}
              >
                {u.isActive ? (
                  <UserX className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                )}
                <span className="hidden sm:inline">{u.isActive ? 'Desativar' : 'Ativar'}</span>
              </button>

              <button
                onClick={() =>
                  updateMutation.mutate({
                    id: u.id,
                    patch: { role: u.role === 'ADMIN' ? 'USER' : 'ADMIN' },
                  })
                }
                disabled={updateMutation.isPending}
                className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg text-muted-foreground hover:bg-secondary transition-all disabled:opacity-50"
                title={u.role === 'ADMIN' ? 'Remover admin' : 'Tornar admin'}
              >
                {u.role === 'ADMIN' ? (
                  <ShieldOff className="w-3.5 h-3.5 text-orange-400" />
                ) : (
                  <Shield className="w-3.5 h-3.5 text-violet-400" />
                )}
                <span className="hidden sm:inline">
                  {u.role === 'ADMIN' ? 'Remover admin' : 'Admin'}
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
