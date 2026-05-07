import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import { Season } from '@/types';

export default function SeasonWidget() {
  const { data } = useQuery({
    queryKey: ['season-widget'],
    queryFn: () => api.get('/seasons/active').then((r) => r.data?.data),
    staleTime: 60_000,
  });

  const season: Season | null = data || null;
  if (!season?.rankings?.length) return null;

  const top5 = season.rankings.slice(0, 5);
  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          {season.name}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[10px] text-green-400 font-medium">Ao Vivo</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {top5.map((r, i) => (
          <Link
            key={r.userId}
            to={`/profile/${r.userId}`}
            className="flex items-center gap-2.5 hover:bg-secondary/60 rounded-lg px-1.5 py-1 -mx-1.5 transition-colors group"
          >
            <span className="w-5 text-center shrink-0">
              {i < 3 ? (
                <span className="text-sm">{medals[i]}</span>
              ) : (
                <span className="text-xs text-muted-foreground font-bold">#{r.position}</span>
              )}
            </span>
            <UserAvatar name={r.user.name} avatar={r.user.avatar} size="xs" />
            <p className="text-xs text-foreground flex-1 truncate group-hover:text-primary transition-colors">
              {r.user.name}
            </p>
            <span className="text-xs font-bold text-primary">{r.points} pts</span>
          </Link>
        ))}
      </div>
      <Link
        to="/hall-of-fame"
        className="block text-center text-xs text-primary hover:underline mt-3 pt-2.5 border-t border-border/50"
      >
        Ver Hall da Fama →
      </Link>
    </div>
  );
}
