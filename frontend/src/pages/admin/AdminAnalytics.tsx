import { useQuery } from '@tanstack/react-query';
import { BarChart3, Users, Award, Building2 } from 'lucide-react';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { RankingItem } from '@/types';

interface CategoryStat {
  category: { id: string; name: string; icon?: string; color?: string; weight: number };
  count: number;
}

export default function AdminAnalytics() {
  const { data: rankingData, isLoading: rankingLoading } = useQuery({
    queryKey: ['analytics-ranking'],
    queryFn: () => api.get('/ranking/galacticos').then((r) => r.data),
  });

  const { data: allTimeData, isLoading: allTimeLoading } = useQuery({
    queryKey: ['analytics-alltime'],
    queryFn: () => api.get('/ranking/all-time').then((r) => r.data),
  });

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['analytics-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  });

  const monthlyRanking: RankingItem[] = rankingData?.data?.ranking ?? [];
  const allTimeRanking: RankingItem[] = allTimeData?.data ?? [];
  const topCategories: CategoryStat[] = dashData?.data?.topCategories ?? [];

  const isLoading = rankingLoading || allTimeLoading || dashLoading;
  if (isLoading) return <LoadingSpinner />;

  const maxPoints = allTimeRanking[0]?.kudosReceived ?? 1;

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Métricas e tendências da plataforma</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Monthly top — points */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Award className="w-4 h-4 text-yellow-400" />
            <h2 className="font-semibold text-foreground text-sm">Top Galácticos — Este mês (pontos)</h2>
          </div>
          {monthlyRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados este mês</p>
          ) : (
            <div className="space-y-3">
              {monthlyRanking.map((item, i) => {
                const pct = Math.max(8, (item.kudosReceived / (monthlyRanking[0]?.kudosReceived || 1)) * 100);
                const medals = ['🥇', '🥈', '🥉'];
                return (
                  <div key={item.userId} className="flex items-center gap-3">
                    <span className="text-base w-6 text-center shrink-0">{medals[i] ?? `${i + 1}`}</span>
                    <UserAvatar name={item.user?.name ?? ''} avatar={item.user?.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{item.user?.name}</p>
                        <span className="text-xs font-bold text-primary shrink-0 ml-2">{item.kudosReceived}pts</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* All-time ranking */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-5">
            <Users className="w-4 h-4 text-violet-400" />
            <h2 className="font-semibold text-foreground text-sm">Ranking geral (todos os tempos)</h2>
          </div>
          {allTimeRanking.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados</p>
          ) : (
            <div className="space-y-3">
              {allTimeRanking.map((item, i) => {
                const pct = Math.max(8, (item.kudosReceived / maxPoints) * 100);
                return (
                  <div key={item.userId} className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground w-5 text-center shrink-0">{i + 1}</span>
                    <UserAvatar name={item.user?.name ?? ''} avatar={item.user?.avatar} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-foreground truncate">{item.user?.name}</p>
                        <span className="text-xs font-bold text-foreground shrink-0 ml-2">{item.kudosReceived}pts</span>
                      </div>
                      <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Categories usage */}
        <div className="bg-card border border-border rounded-xl p-5 md:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <h2 className="font-semibold text-foreground text-sm">Categorias mais usadas — Este mês</h2>
          </div>
          {topCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">Sem dados este mês</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topCategories.map((item) => (
                <div key={item.category?.id} className="bg-secondary/50 rounded-xl p-4 flex items-center gap-3">
                  <span className="text-2xl">{item.category?.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.category?.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-bold text-foreground">{item.count}</span>
                      <span className="text-xs text-muted-foreground">kudos</span>
                      <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                        style={{ background: `${item.category?.color}20`, color: item.category?.color ?? undefined }}>
                        {item.category?.weight}pt
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
