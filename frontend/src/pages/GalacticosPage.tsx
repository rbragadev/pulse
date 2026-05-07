import { useState } from 'react';
import { Star, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';
import { RankingItem } from '@/types';

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
const medalBg = ['bg-yellow-500/10', 'bg-slate-400/10', 'bg-amber-700/10'];
const medalBorder = ['border-yellow-500/30', 'border-slate-400/30', 'border-amber-700/30'];
const medalRing = ['ring-2 ring-yellow-500/20', '', ''];

export default function GalacticosPage() {
  const [tab, setTab] = useState<'monthly' | 'all-time'>('monthly');

  const { data, isLoading } = useQuery({
    queryKey: ['ranking', tab],
    queryFn: () =>
      api
        .get(tab === 'monthly' ? '/ranking/galacticos' : '/ranking/all-time')
        .then((r) => r.data),
  });

  const ranking: RankingItem[] =
    tab === 'monthly'
      ? (data?.data?.ranking ?? [])
      : (data?.data ?? []);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galácticos</h1>
          <p className="text-sm text-muted-foreground">Colaboradores mais reconhecidos</p>
        </div>
      </div>

      {/* Tab toggle */}
      <div className="flex gap-1 mb-8 bg-secondary rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab('monthly')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            tab === 'monthly'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Este mês
        </button>
        <button
          onClick={() => setTab('all-time')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            tab === 'all-time'
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          Geral
        </button>
      </div>

      {isLoading && <LoadingSpinner />}

      {!isLoading && ranking.length === 0 && (
        <EmptyState
          icon={Trophy}
          title="Nenhum dado disponível"
          description="Sem reconhecimentos neste período. Comece a reconhecer seus colegas!"
        />
      )}

      {!isLoading && ranking.length > 0 && (
        <>
          {/* Top 3 podium */}
          {top3.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {top3.map((item, index) => (
                <div
                  key={item.user.id}
                  className={cn(
                    'border rounded-xl p-6 text-center transition-all',
                    medalBg[index],
                    medalBorder[index],
                    medalRing[index],
                  )}
                >
                  <div
                    className="text-3xl font-black mb-4"
                    style={{ color: medalColors[index] }}
                  >
                    #{item.position}
                  </div>

                  <UserAvatar
                    name={item.user.name}
                    avatar={item.user.avatar}
                    size="lg"
                    className="mx-auto mb-3"
                  />

                  <p className="font-semibold text-foreground text-sm leading-tight">
                    {item.user.name}
                  </p>
                  {item.user.department && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.user.department.name}
                    </p>
                  )}

                  <div
                    className="mt-4 text-3xl font-black"
                    style={{ color: medalColors[index] }}
                  >
                    {item.kudosReceived}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">reconhecimentos</p>
                </div>
              ))}
            </div>
          )}

          {/* Rest of the list (4-10+) */}
          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((item) => (
                <div
                  key={item.user.id}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-3.5 hover:border-primary/20 transition-all"
                >
                  <span className="text-lg font-bold text-muted-foreground w-6 text-center shrink-0">
                    {item.position}
                  </span>
                  <UserAvatar name={item.user.name} avatar={item.user.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{item.user.name}</p>
                    {item.user.department && (
                      <p className="text-xs text-muted-foreground">{item.user.department.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary text-sm">{item.kudosReceived}</span>
                    <p className="text-xs text-muted-foreground">kudos</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
