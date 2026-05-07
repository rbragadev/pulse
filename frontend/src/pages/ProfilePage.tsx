import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import api from '@/lib/api';
import UserAvatar from '@/components/shared/UserAvatar';
import KudosCard from '@/components/shared/KudosCard';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { KudosPost, SocialProfile, VoteType, BadgeRarity } from '@/types';
import {
  Award, Star, Users, MessageSquare, TrendingUp,
  Eye, Heart, Zap, Trophy, Shield, Smile, ChevronDown, ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RARITY_CONFIG: Record<BadgeRarity, { label: string; class: string; glow: string }> = {
  COMMON:    { label: 'Comum',     class: 'border-slate-500/50 bg-slate-800/50', glow: '' },
  UNCOMMON:  { label: 'Incomum',   class: 'border-green-500/60 bg-green-900/20', glow: 'shadow-green-500/20' },
  RARE:      { label: 'Raro',      class: 'border-blue-400/70 bg-blue-900/20', glow: 'shadow-blue-400/30' },
  EPIC:      { label: 'Épico',     class: 'border-purple-400/80 bg-purple-900/30', glow: 'shadow-purple-400/40' },
  LEGENDARY: { label: 'Lendário',  class: 'border-yellow-400 bg-gradient-to-br from-yellow-900/40 to-orange-900/40', glow: 'shadow-yellow-400/50' },
};

const VOTE_CONFIG = {
  TRUSTWORTHY:  { label: 'Confiável',    icon: Shield, color: 'text-blue-400' },
  COOL:         { label: 'Legal',        icon: Smile,  color: 'text-green-400' },
  PROFESSIONAL: { label: 'Profissional', icon: Star,   color: 'text-yellow-400' },
} as const;

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuthStore();
  const queryClient = useQueryClient();
  const userId = id || currentUser?.id;
  const isOwnProfile = currentUser?.id === userId;

  const [showAllBadges, setShowAllBadges] = useState(false);
  const [showKudosTab, setShowKudosTab] = useState<'received' | 'sent'>('received');

  const { data: profileData, isLoading } = useQuery({
    queryKey: ['social-profile', userId],
    queryFn: () => api.get(`/social-profile/${userId}`).then((r) => r.data?.data),
    enabled: !!userId,
  });

  const { data: kudosReceivedData } = useQuery({
    queryKey: ['kudos-received', userId],
    queryFn: () => api.get(`/kudos?recipientId=${userId}&limit=8`).then((r) => r.data?.data),
    enabled: !!userId,
  });

  const { data: kudosSentData } = useQuery({
    queryKey: ['kudos-sent', userId],
    queryFn: () => api.get(`/kudos?authorId=${userId}&limit=8`).then((r) => r.data?.data),
    enabled: !!userId,
  });

  const voteMutation = useMutation({
    mutationFn: (type: VoteType) =>
      api.post(`/social-profile/${userId}/vote`, { type }).then((r) => r.data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['social-profile', userId] }),
  });

  if (!userId || isLoading) return <LoadingSpinner />;
  if (!profileData?.user) return <div className="text-center py-20 text-muted-foreground">Usuário não encontrado.</div>;

  const profile: SocialProfile = profileData;
  const { user, stats, badges, achievements, votes, myVotes, recentVisitors, topCategories, fans } = profile;
  const kudosReceived: KudosPost[] = kudosReceivedData?.posts || [];
  const kudosSent: KudosPost[] = kudosSentData?.posts || [];
  const totalVotes = (votes.TRUSTWORTHY || 0) + (votes.COOL || 0) + (votes.PROFESSIONAL || 0);
  const displayedBadges = showAllBadges ? badges : badges.slice(0, 6);

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* ── HERO HEADER ─────────────────────────────────────────────── */}
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
        <div
          className="h-28 w-full"
          style={{
            background: user.department?.color
              ? `linear-gradient(135deg, ${user.department.color}40 0%, ${user.department.color}10 100%)`
              : 'linear-gradient(135deg, hsl(var(--primary)/0.3) 0%, hsl(var(--primary)/0.05) 100%)',
          }}
        />
        <div className="px-6 pb-6">
          <div className="flex items-end gap-5 -mt-12 mb-5">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl border-4 border-card overflow-hidden bg-secondary">
                <UserAvatar name={user.name} avatar={user.avatar} size="xl" className="w-full h-full rounded-xl" />
              </div>
              {badges.some((b) => b.badge.rarity === 'LEGENDARY') && (
                <div className="absolute -top-1 -right-1 text-lg">👑</div>
              )}
            </div>
            <div className="flex-1 mb-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                {user.role === 'ADMIN' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/20 text-primary border border-primary/30">Admin</span>
                )}
                {isOwnProfile && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-secondary text-muted-foreground border border-border">Você</span>
                )}
              </div>
              {user.department && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: user.department.color || '#6366f1' }} />
                  <p className="text-sm text-muted-foreground">{user.department.name}</p>
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
              <p className="text-2xl font-bold text-primary">{stats.kudosReceived}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Kudos recebidos</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
              <p className="text-2xl font-bold text-foreground">{stats.kudosSent}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Kudos enviados</p>
            </div>
            <div className="bg-secondary/50 rounded-xl p-3 text-center border border-border/50">
              <p className="text-2xl font-bold text-yellow-400">{badges.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Badges</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── SIDEBAR ORKUT ───────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Reputação */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-400" />
              Reputação
            </h3>
            <p className="text-xs text-muted-foreground mb-3">{totalVotes} votos recebidos</p>
            {(Object.entries(VOTE_CONFIG) as [VoteType, typeof VOTE_CONFIG[VoteType]][]).map(([type, config]) => {
              const count = votes[type] || 0;
              const pct = totalVotes > 0 ? Math.round((count / totalVotes) * 100) : 0;
              const Icon = config.icon;
              const voted = myVotes[type];
              return (
                <div key={type} className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5">
                      <Icon className={cn('w-3.5 h-3.5', config.color)} />
                      <span className="text-xs text-muted-foreground">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{count}</span>
                      {!isOwnProfile && (
                        <button
                          onClick={() => voteMutation.mutate(type)}
                          className={cn(
                            'text-xs px-2 py-0.5 rounded-full border transition-all',
                            voted
                              ? 'bg-primary/20 border-primary/40 text-primary'
                              : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground',
                          )}
                        >
                          {voted ? '✓' : '+'}
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={cn('h-full rounded-full transition-all duration-500', {
                        'bg-blue-400': type === 'TRUSTWORTHY',
                        'bg-green-400': type === 'COOL',
                        'bg-yellow-400': type === 'PROFESSIONAL',
                      })}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fãs */}
          {fans.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Heart className="w-4 h-4 text-red-400" />
                Fãs
              </h3>
              <div className="space-y-2">
                {fans.filter((f) => f.user).map((fan) => (
                  <Link key={fan.user!.id} to={`/profile/${fan.user!.id}`}
                    className="flex items-center gap-2.5 hover:bg-secondary/50 rounded-lg p-1.5 transition-colors"
                  >
                    <UserAvatar name={fan.user!.name} avatar={fan.user!.avatar} size="sm" />
                    <p className="text-xs font-medium text-foreground flex-1 truncate">{fan.user!.name}</p>
                    <span className="text-xs text-muted-foreground">{fan.count}x</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Visitantes recentes */}
          {recentVisitors.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <Eye className="w-4 h-4 text-muted-foreground" />
                Visitantes Recentes
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentVisitors.map((v) => (
                  <Link key={v.id} to={`/profile/${v.id}`} title={v.name}>
                    <UserAvatar name={v.name} avatar={v.avatar} size="sm" className="hover:ring-2 hover:ring-primary/50 transition-all" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Top categorias */}
          {topCategories.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                Categorias em destaque
              </h3>
              <div className="space-y-2">
                {topCategories.filter((c) => c.category).map((item) => (
                  <div key={item.category!.id} className="flex items-center gap-2">
                    <span className="text-base">{item.category!.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground truncate">{item.category!.name}</p>
                      <div className="h-1 bg-secondary rounded-full mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${Math.min(100, (item.count / (topCategories[0]?.count || 1)) * 100)}%`,
                            backgroundColor: item.category!.color || '#6366f1',
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Badges */}
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                Badges ({badges.length})
              </h3>
              {badges.length > 6 && (
                <button
                  onClick={() => setShowAllBadges((p) => !p)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showAllBadges
                    ? <><ChevronUp className="w-3.5 h-3.5" /> Menos</>
                    : <><ChevronDown className="w-3.5 h-3.5" /> Ver todos</>}
                </button>
              )}
            </div>
            {badges.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nenhuma badge ainda.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {displayedBadges.map(({ badge, unlockedAt }) => {
                  const rarityConfig = RARITY_CONFIG[badge.rarity];
                  return (
                    <div
                      key={badge.id}
                      title={`Desbloqueado em ${new Date(unlockedAt).toLocaleDateString('pt-BR')}`}
                      className={cn(
                        'border rounded-xl p-3 flex items-start gap-3 transition-all',
                        rarityConfig.class,
                        badge.rarity !== 'COMMON' && `shadow-md ${rarityConfig.glow}`,
                      )}
                    >
                      <span className="text-2xl leading-none mt-0.5">{badge.icon}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-foreground leading-tight">{badge.name}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 leading-tight line-clamp-2">{badge.description}</p>
                        <span
                          className={cn(
                            'inline-block mt-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                            {
                              'text-slate-400 bg-slate-800': badge.rarity === 'COMMON',
                              'text-green-400 bg-green-900/40': badge.rarity === 'UNCOMMON',
                              'text-blue-400 bg-blue-900/40': badge.rarity === 'RARE',
                              'text-purple-400 bg-purple-900/40': badge.rarity === 'EPIC',
                              'text-yellow-400 bg-yellow-900/40': badge.rarity === 'LEGENDARY',
                            },
                          )}
                        >
                          {rarityConfig.label}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conquistas */}
          {achievements.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400" />
                Conquistas recentes
              </h3>
              <div className="space-y-2.5">
                {achievements.map(({ achievement, completedAt }) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-2.5 bg-secondary/40 rounded-lg border border-border/50">
                    <span className="text-xl">{achievement.icon || '🏅'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                    {completedAt && (
                      <p className="text-xs text-muted-foreground shrink-0">
                        {new Date(completedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Kudos tabs */}
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="flex border-b border-border">
              {(['received', 'sent'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setShowKudosTab(tab)}
                  className={cn(
                    'flex-1 py-3 text-sm font-medium transition-colors',
                    showKudosTab === tab
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-muted-foreground hover:text-foreground',
                  )}
                >
                  <span className="flex items-center justify-center gap-2">
                    {tab === 'received'
                      ? <><MessageSquare className="w-3.5 h-3.5" /> Recebidos ({stats.kudosReceived})</>
                      : <><Zap className="w-3.5 h-3.5" /> Enviados ({stats.kudosSent})</>}
                  </span>
                </button>
              ))}
            </div>
            <div className="p-4 space-y-3">
              {(() => {
                const activeKudosList = showKudosTab === 'received' ? kudosReceived : kudosSent;
                if (activeKudosList.length === 0) return (
                  <div className="text-center py-8">
                    <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-40" />
                    <p className="text-sm text-muted-foreground">Nenhum reconhecimento ainda.</p>
                  </div>
                );
                return activeKudosList.map((post) => (
                  <KudosCard key={post.id} post={post} currentUserId={currentUser?.id} />
                ));
              })()}
            </div>
          </div>

          {isOwnProfile && (
            <div className="bg-card border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-foreground mb-1 flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                Seu perfil social
              </h3>
              <p className="text-xs text-muted-foreground">
                Membros podem votar na sua reputação e visitar seu perfil.
                <Link to="/hall-of-fame" className="text-primary ml-1 hover:underline">Ver Hall da Fama →</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

