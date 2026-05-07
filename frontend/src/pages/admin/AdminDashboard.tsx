import { useQuery } from '@tanstack/react-query';
import { Users, MessageSquare, TrendingUp, UserCheck, Star } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import UserAvatar from '@/components/shared/UserAvatar';
import { AdminStats } from '@/types';

interface StatCardProps {
  readonly title: string;
  readonly value: number;
  readonly icon: React.ElementType;
  readonly colorClass: string;
  readonly sub?: string;
}

function StatCard({ title, value, icon: Icon, colorClass, sub }: StatCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-5 hover:border-primary/20 transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">{title}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value.toLocaleString('pt-BR')}</p>
          {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${colorClass}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });

  const stats: AdminStats | undefined = data?.data;

  if (isLoading) return <LoadingSpinner />;
  if (!stats) return null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Visão geral da plataforma</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Usuários" value={stats.totalUsers} icon={Users} colorClass="bg-violet-500/20 text-violet-400" sub={`${stats.activeUsers} ativos`} />
        <StatCard title="Total Kudos" value={stats.totalKudos} icon={MessageSquare} colorClass="bg-blue-500/20 text-blue-400" />
        <StatCard title="Kudos este mês" value={stats.kudosThisMonth} icon={TrendingUp} colorClass="bg-emerald-500/20 text-emerald-400" />
        <StatCard title="Usuários ativos" value={stats.activeUsers} icon={UserCheck} colorClass="bg-yellow-500/20 text-yellow-400" sub={`de ${stats.totalUsers} total`} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top users this month */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-4 h-4 text-yellow-400" />
            <h2 className="font-semibold text-foreground text-sm">Top Reconhecidos — Este mês</h2>
          </div>
          {stats.topUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados este mês</p>
          ) : (
            <div className="space-y-3">
              {stats.topUsers.map((item, i) => (
                <div key={item.user?.id ?? i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{i + 1}</span>
                  <UserAvatar name={item.user?.name ?? ''} avatar={item.user?.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.user?.name}</p>
                    <p className="text-xs text-muted-foreground">{item.user?.department?.name}</p>
                  </div>
                  <span className="text-sm font-bold text-primary shrink-0">{item.kudosCount}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top categories this month */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-foreground text-sm">Categorias mais usadas — Este mês</h2>
          </div>
          {stats.topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados este mês</p>
          ) : (
            <div className="space-y-3">
              {stats.topCategories.map((item, i) => (
                <div key={item.category?.id ?? i} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{i + 1}</span>
                  <span className="text-lg w-7 text-center shrink-0">{item.category?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">{item.category?.name}</p>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0"
                        style={{ background: item.category?.color ? `${item.category.color}20` : undefined, color: item.category?.color ?? undefined }}>
                        {item.category?.weight}pt
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (item.count / (stats.topCategories[0]?.count || 1)) * 100)}%`, background: item.category?.color ?? 'hsl(var(--primary))' }} />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-foreground shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
