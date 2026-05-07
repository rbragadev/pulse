import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Trophy, Crown, Medal, Star, Calendar } from 'lucide-react';
import { Season, SeasonRanking } from '@/types';
import { cn } from '@/lib/utils';

const POSITION_CONFIG = {
  1: { icon: Crown, color: 'text-yellow-400', bg: 'bg-yellow-400/10 border-yellow-400/30', size: 'w-8 h-8', label: '🥇' },
  2: { icon: Medal, color: 'text-slate-300',  bg: 'bg-slate-500/10 border-slate-500/30',   size: 'w-7 h-7', label: '🥈' },
  3: { icon: Medal, color: 'text-amber-600',  bg: 'bg-amber-700/10 border-amber-700/30',   size: 'w-7 h-7', label: '🥉' },
};

function TopThreeCard({ ranking, position }: { readonly ranking: SeasonRanking; readonly position: 1 | 2 | 3 }) {
  const config = POSITION_CONFIG[position];
  const Icon = config.icon;

  return (
    <Link
      to={`/profile/${ranking.user.id}`}
      className={cn(
        'flex flex-col items-center p-5 rounded-2xl border transition-all hover:scale-105',
        config.bg,
        position === 1 ? 'shadow-lg shadow-yellow-400/10' : '',
      )}
    >
      <div className="relative mb-3">
        <UserAvatar name={ranking.user.name} avatar={ranking.user.avatar} size="lg" />
        <div className={cn('absolute -top-2 -right-2 rounded-full p-1', config.bg)}>
          <Icon className={cn(config.size, config.color)} />
        </div>
      </div>
      <p className="text-xs font-bold text-foreground text-center">{ranking.user.name}</p>
      {ranking.user.department && (
        <p className="text-xs text-muted-foreground mt-0.5 text-center">{ranking.user.department?.name}</p>
      )}
      <div className={cn('mt-3 px-3 py-1 rounded-full text-sm font-bold', config.bg, config.color)}>
        {ranking.points} pts
      </div>
      <span className="text-2xl mt-2">{config.label}</span>
    </Link>
  );
}

export default function HallOfFamePage() {
  const { data, isLoading } = useQuery({
    queryKey: ['hall-of-fame'],
    queryFn: () => api.get('/seasons/hall-of-fame').then((r) => r.data?.data),
  });

  const { data: seasonsData } = useQuery({
    queryKey: ['seasons'],
    queryFn: () => api.get('/seasons').then((r) => r.data?.data),
  });

  if (isLoading) return <LoadingSpinner />;

  const hallData = data || { seasons: [], allTime: [] };
  const seasons: Season[] = seasonsData || [];
  const activeSeason = seasons.find((s) => s.active);
  const pastSeasons: Season[] = seasons.filter((s) => !s.active);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <Trophy className="w-8 h-8 text-yellow-400" />
          <h1 className="text-3xl font-bold text-foreground">Hall da Fama</h1>
          <Trophy className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-muted-foreground">Os maiores galácticos de todos os tempos</p>
      </div>

      {/* All Time Top */}
      {hallData.allTime?.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            Maiores Galácticos — Histórico
          </h2>
          <div className="space-y-3">
            {hallData.allTime.map((entry: any) => (
              <Link
                key={entry.user?.id}
                to={`/profile/${entry.user?.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/50 transition-colors border border-transparent hover:border-border"
              >
                <div className="w-8 text-center">
                  {entry.position <= 3 ? (
                    <span className="text-xl">{['🥇', '🥈', '🥉'][entry.position - 1]}</span>
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">#{entry.position}</span>
                  )}
                </div>
                <UserAvatar name={entry.user?.name || ''} avatar={entry.user?.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{entry.user?.name}</p>
                  {entry.user?.department && (
                    <p className="text-xs text-muted-foreground">{entry.user.department.name}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{entry.totalKudos}</p>
                  <p className="text-xs text-muted-foreground">kudos</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Active Season */}
      {activeSeason?.rankings && activeSeason.rankings.length > 0 && (
        <div className="bg-card border border-primary/30 rounded-2xl p-6 shadow-lg shadow-primary/5">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-medium text-green-400 uppercase tracking-wider">Ao Vivo</span>
            </div>
            <h2 className="text-lg font-semibold text-foreground">{activeSeason.name}</h2>
          </div>

          {/* Top 3 podium */}
          {activeSeason.rankings.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {([2, 1, 3] as const).map((pos) => {
                const r = activeSeason.rankings!.find((r) => r.position === pos);
                if (!r) return <div key={pos} />;
                return <TopThreeCard key={pos} ranking={r} position={pos} />;
              })}
            </div>
          )}

          {/* Rest of ranking */}
          {activeSeason.rankings.slice(3).length > 0 && (
            <div className="space-y-2">
              {activeSeason.rankings.slice(3).map((r) => (
                <Link
                  key={r.userId}
                  to={`/profile/${r.userId}`}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <span className="w-6 text-sm font-bold text-muted-foreground text-center">#{r.position}</span>
                  <UserAvatar name={r.user.name} avatar={r.user.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.user.name}</p>
                    {r.user.department && <p className="text-xs text-muted-foreground">{r.user.department.name}</p>}
                  </div>
                  <span className="text-sm font-bold text-primary">{r.points} pts</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Past Seasons */}
      {pastSeasons.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Temporadas Anteriores
          </h2>
          {pastSeasons.map((season) => (
            <div key={season.id} className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400/70" />
                {season.name}
                <span className="text-xs text-muted-foreground ml-auto">
                  {new Date(season.startDate).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </span>
              </h3>
              {season.rankings && season.rankings.length > 0 ? (
                <div className="space-y-2">
                  {season.rankings.slice(0, 5).map((r) => (
                    <Link
                      key={r.userId}
                      to={`/profile/${r.userId}`}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <span className="text-base w-6 text-center">
                        {r.position <= 3 ? (['🥇', '🥈', '🥉'] as const)[r.position - 1] : `#${r.position}`}
                      </span>
                      <UserAvatar name={r.user.name} avatar={r.user.avatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{r.user.name}</p>
                        {r.user.department && <p className="text-xs text-muted-foreground">{r.user.department.name}</p>}
                      </div>
                      <span className="text-sm font-semibold text-muted-foreground">{r.points} pts</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-3">Sem dados para esta temporada.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
