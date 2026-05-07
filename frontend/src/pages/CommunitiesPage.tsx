import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, Plus, Star, Lock, Globe } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import EmptyState from '@/components/shared/EmptyState';
import { useToast } from '@/hooks/useToast';
import { Community, MyCommunities } from '@/types';
import { cn } from '@/lib/utils';
import CreateCommunityDialog from '@/components/communities/CreateCommunityDialog';

const CATEGORIES = ['Todas', 'Tecnologia', 'Cultura', 'Diversão', 'Saúde', 'Produto', 'Música', 'Reconhecimento', 'Estilo de Vida'];

function CommunityCard({ community, onJoin, onLeave }: {
  readonly community: Community;
  readonly onJoin: (id: string) => void;
  readonly onLeave: (id: string) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all group">
      {/* Banner */}
      <div className="relative h-20 bg-gradient-to-r from-primary/20 to-primary/5 overflow-hidden">
        {community.bannerUrl && (
          <img
            src={community.bannerUrl}
            alt=""
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent" />
        {community.isOfficial && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-400/20 text-yellow-400 border border-yellow-400/30">
            <Star className="w-2.5 h-2.5" />
            Oficial
          </span>
        )}
      </div>

      <div className="p-4 -mt-6 relative">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-xl border-2 border-card overflow-hidden bg-secondary shadow-lg mb-3">
          {community.avatarUrl ? (
            <img src={community.avatarUrl} alt={community.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-bold text-xl">
              {community.name[0]}
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link to={`/communities/${community.slug}`} className="group/link">
              <h3 className="font-semibold text-foreground text-sm leading-tight group-hover/link:text-primary transition-colors">
                {community.name}
              </h3>
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              {community.visibility === 'PUBLIC' ? (
                <Globe className="w-3 h-3 text-muted-foreground" />
              ) : (
                <Lock className="w-3 h-3 text-muted-foreground" />
              )}
              <span className="text-[10px] text-muted-foreground">{community.category || 'Comunidade'}</span>
            </div>
          </div>
        </div>

        {community.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
            {community.description}
          </p>
        )}

        <div className="flex items-center gap-3 mt-3">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="w-3 h-3" />
            {community._count?.members ?? 0}
          </span>
          <span className="text-xs text-muted-foreground">
            {community._count?.posts ?? 0} tópicos
          </span>
        </div>

        <button
          onClick={() => community.isMember ? onLeave(community.id) : onJoin(community.id)}
          className={cn(
            'w-full mt-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
            community.isMember
              ? 'bg-secondary text-muted-foreground hover:bg-red-500/10 hover:text-red-400 border border-border hover:border-red-500/30'
              : 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30',
          )}
        >
          {community.isMember ? '✓ Participando' : '+ Participar'}
        </button>
      </div>
    </div>
  );
}

type Tab = 'all' | 'mine' | 'created';

function getEmptyTitle(tab: Tab): string {
  if (tab === 'mine') return 'Você ainda não entrou em nenhuma comunidade';
  if (tab === 'created') return 'Você ainda não criou nenhuma comunidade';
  return 'Nenhuma comunidade encontrada';
}

function getEmptyDescription(tab: Tab): string {
  if (tab === 'all') return 'Tente outro filtro ou crie uma nova comunidade.';
  return 'Explore e participe das comunidades disponíveis.';
}

export default function CommunitiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const [tab, setTab] = useState<Tab>('all');
  const [showCreate, setShowCreate] = useState(false);

  const { data: allData, isLoading: allLoading } = useQuery({
    queryKey: ['communities'],
    queryFn: () => api.get('/communities').then((r) => r.data?.data ?? r.data),
  });

  const { data: myData, isLoading: myLoading } = useQuery({
    queryKey: ['communities-my'],
    queryFn: () => api.get('/communities/my').then((r) => r.data?.data ?? r.data),
    enabled: tab === 'mine' || tab === 'created',
  });

  const joinMutation = useMutation({
    mutationFn: (id: string) => api.post(`/communities/${id}/join`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities-my'] });
      toast({ title: 'Você entrou na comunidade!' });
    },
    onError: () => toast({ title: 'Erro ao entrar', variant: 'destructive' }),
  });

  const leaveMutation = useMutation({
    mutationFn: (id: string) => api.post(`/communities/${id}/leave`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['communities'] });
      queryClient.invalidateQueries({ queryKey: ['communities-my'] });
      toast({ title: 'Você saiu da comunidade.' });
    },
    onError: (err: any) => toast({ title: err?.response?.data?.message ?? 'Erro ao sair', variant: 'destructive' }),
  });

  const allCommunities: Community[] = Array.isArray(allData) ? allData : [];
  const myCommunities: MyCommunities | null = myData ?? null;

  const searchLower = search.toLowerCase();
  const filtered = allCommunities.filter((c) => {
    const matchSearch = !search
      || c.name.toLowerCase().includes(searchLower)
      || c.description?.toLowerCase().includes(searchLower);
    const matchCat = category === 'Todas' || c.category === category;
    return matchSearch && matchCat;
  });

  let tabCommunities: Community[] = filtered;
  if (tab === 'mine') tabCommunities = myCommunities?.communitiesIMember ?? [];
  if (tab === 'created') tabCommunities = myCommunities?.communitiesICreated ?? [];

  const isLoading = tab === 'all' ? allLoading : myLoading;
  const totalMembers = allCommunities.reduce((s, c) => s + (c._count?.members ?? 0), 0);
  const officialCount = allCommunities.filter((c) => c.isOfficial).length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <div className="relative bg-card border border-border rounded-2xl overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, hsl(var(--primary)) 0%, transparent 60%), radial-gradient(circle at 80% 20%, hsl(var(--primary)) 0%, transparent 40%)' }} />
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-foreground">Comunidades</h1>
              </div>
              <p className="text-muted-foreground text-sm max-w-lg">
                Encontre sua tribo na OTG. Grupos de interesse, hobbies, times e aquelas comunidades que só fazem sentido pra quem está por dentro.
              </p>
              <div className="flex items-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{allCommunities.length}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Comunidades</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{totalMembers}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Participações</p>
                </div>
                <div className="w-px h-8 bg-border" />
                <div className="text-center">
                  <p className="text-2xl font-bold text-yellow-400">{officialCount}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Oficiais</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Criar comunidade
            </button>
          </div>
        </div>
      </div>

      {/* ── TABS + SEARCH ────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="flex gap-1 bg-secondary rounded-xl p-1">
          {([
            { id: 'all', label: 'Todas' },
            { id: 'mine', label: 'Minhas comunidades' },
            { id: 'created', label: 'Criadas por mim' },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all',
                tab === t.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar comunidade..."
            className="w-full bg-card border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
      </div>

      {/* ── CATEGORY CHIPS ───────────────────────────────────────────────── */}
      {tab === 'all' && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                category === cat
                  ? 'bg-primary/15 text-primary border-primary/40'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground',
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ── GRID ─────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <LoadingSpinner />
      ) : tabCommunities.length === 0 ? (
        <EmptyState
          icon={Users}
          title={getEmptyTitle(tab)}
          description={getEmptyDescription(tab)}
          action={tab === 'created' ? (
            <button
              onClick={() => setShowCreate(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm"
            >
              <Plus className="w-4 h-4" />
              Criar comunidade
            </button>
          ) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {tabCommunities.map((community) => (
            <CommunityCard
              key={community.id}
              community={community}
              onJoin={(id) => joinMutation.mutate(id)}
              onLeave={(id) => leaveMutation.mutate(id)}
            />
          ))}
        </div>
      )}

      <CreateCommunityDialog
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => {
          queryClient.invalidateQueries({ queryKey: ['communities'] });
          queryClient.invalidateQueries({ queryKey: ['communities-my'] });
          setShowCreate(false);
          setTab('created');
        }}
      />
    </div>
  );
}
