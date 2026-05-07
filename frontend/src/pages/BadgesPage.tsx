import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { Badge, BadgeRarity } from '@/types';
import { Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const RARITY_ORDER: BadgeRarity[] = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

const RARITY_CONFIG: Record<BadgeRarity, { label: string; class: string; glow: string; titleColor: string }> = {
  LEGENDARY: { label: '✨ Lendário',  class: 'border-yellow-400 bg-gradient-to-br from-yellow-900/40 to-orange-900/30', glow: 'shadow-yellow-400/30', titleColor: 'text-yellow-400' },
  EPIC:      { label: '💜 Épico',     class: 'border-purple-400/80 bg-purple-900/20', glow: 'shadow-purple-500/20', titleColor: 'text-purple-400' },
  RARE:      { label: '💙 Raro',      class: 'border-blue-400/70 bg-blue-900/20', glow: 'shadow-blue-400/20', titleColor: 'text-blue-400' },
  UNCOMMON:  { label: '💚 Incomum',   class: 'border-green-500/50 bg-green-900/10', glow: '', titleColor: 'text-green-400' },
  COMMON:    { label: '⬜ Comum',     class: 'border-slate-600/50 bg-slate-800/30', glow: '', titleColor: 'text-slate-400' },
};

export default function BadgesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['badges'],
    queryFn: () => api.get('/badges').then((r) => r.data?.data),
  });

  if (isLoading) return <LoadingSpinner />;

  const badges: Badge[] = data || [];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
          <Award className="w-7 h-7 text-yellow-400" />
          Catálogo de Badges
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {badges.length} badges disponíveis para conquistar
        </p>
      </div>

      {RARITY_ORDER.map((rarity) => {
        const group = badges.filter((b) => b.rarity === rarity);
        if (group.length === 0) return null;
        const config = RARITY_CONFIG[rarity];

        return (
          <div key={rarity}>
            <h2 className={cn('text-sm font-semibold mb-3', config.titleColor)}>
              {config.label} <span className="text-muted-foreground font-normal">— {group.length} badge{group.length > 1 ? 's' : ''}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {group.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    'border rounded-xl p-4 flex items-start gap-4 transition-all hover:scale-[1.02]',
                    config.class,
                    config.glow && `shadow-md ${config.glow}`,
                  )}
                >
                  <span className="text-3xl leading-none mt-1 shrink-0">{badge.icon}</span>
                  <div className="min-w-0">
                    <p className="font-semibold text-foreground text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{badge.description}</p>
                    <div
                      className="mt-2 inline-block text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ backgroundColor: `${badge.color}20`, color: badge.color, border: `1px solid ${badge.color}40` }}
                    >
                      {config.label.replace(/^[^\s]+\s/, '')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
