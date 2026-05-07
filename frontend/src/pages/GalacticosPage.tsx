import { useState } from 'react';
import { Star, Trophy } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';
import { RankingItem } from '@/types';

const MEDAL_EMOJI = ['🥇', '🥈', '🥉'];
const medalBg = ['bg-yellow-500/10', 'bg-slate-400/10', 'bg-amber-700/10'];
const medalBorder = ['border-yellow-500/40', 'border-slate-400/30', 'border-amber-700/30'];
const medalColor = ['text-yellow-400', 'text-slate-300', 'text-amber-500'];

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
    tab === 'monthly' ? (data?.data?.ranking ?? []) : (data?.data ?? []);

  const top3 = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  // Olympic podium order: 2nd (left), 1st (center), 3rd (right)
  const podium =
    top3.length === 3
      ? [top3[1], top3[0], top3[2]]
      : top3;
  const podiumHeights = top3.length === 3 ? ['pb-4', 'pb-8', 'pb-0'] : ['pb-4', 'pb-4', 'pb-4'];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
          <Star className="w-5 h-5 text-yellow-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Galácticos</h1>
          <p className="text-sm text-muted-foreground">Colaboradores mais reconhecidos da OTG</p>
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
          {/* Olympic podium */}
          {top3.length > 0 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {podium.map((item, podiumIdx) => {
                const origIdx = top3.findIndex((r) => r.user.id === item.user.id);
                return (
                  <Link
                    key={item.user.id}
                    to={`/profile/${item.user.id}`}
                    className={cn(
                      'flex-1 border rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg group',
                      medalBg[origIdx],
                      medalBorder[origIdx],
                      podiumHeights[podiumIdx],
                      origIdx === 0 && 'shadow-md shadow-yellow-500/10',
                    )}
                  >
                    <div className="text-3xl mb-3">{MEDAL_EMOJI[origIdx]}</div>
                    <UserAvatar
                      name={item.user.name}
                      avatar={item.user.avatar}
                      size={origIdx === 0 ? 'lg' : 'md'}
                      className="mx-auto mb-3 group-hover:ring-2 group-hover:ring-white/20 transition-all"
                    />
                    <p className="font-semibold text-foreground text-sm leading-tight">
                      {item.user.name}
                    </p>
                    {item.user.department && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {item.user.department.name}
                      </p>
                    )}
                    <div className={cn('mt-3 text-2xl font-black', medalColor[origIdx])}>
                      {item.kudosReceived}
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">reconhecimentos</p>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Rest of the list */}
          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((item) => (
                <Link
                  key={item.user.id}
                  to={`/profile/${item.user.id}`}
                  className="flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-3.5 hover:border-primary/30 hover:bg-secondary/30 transition-all group"
                >
                  <span className="text-base font-bold text-muted-foreground w-6 text-center shrink-0">
                    {item.position}
                  </span>
                  <UserAvatar name={item.user.name} avatar={item.user.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm group-hover:text-primary transition-colors">
                      {item.user.name}
                    </p>
                    {item.user.department && (
                      <p className="text-xs text-muted-foreground">{item.user.department.name}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary text-sm">{item.kudosReceived}</span>
                    <p className="text-xs text-muted-foreground">kudos</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
