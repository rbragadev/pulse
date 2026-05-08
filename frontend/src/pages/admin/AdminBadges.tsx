import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { Badge, BadgeRarity } from '@/types';

const RARITIES: BadgeRarity[] = ['LEGENDARY', 'EPIC', 'RARE', 'UNCOMMON', 'COMMON'];

const RARITY_LABELS: Record<BadgeRarity, string> = {
  LEGENDARY: 'Lendário',
  EPIC: 'Épico',
  RARE: 'Raro',
  UNCOMMON: 'Incomum',
  COMMON: 'Comum',
};

interface BadgeFormState {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  rarity: BadgeRarity;
}

const emptyForm = (): BadgeFormState => ({
  name: '', slug: '', description: '', icon: '', color: '#6366f1', rarity: 'COMMON',
});

function toSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export default function AdminBadges() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [form, setForm] = useState<BadgeFormState>(emptyForm());

  const { data, isLoading } = useQuery({
    queryKey: ['admin-badges'],
    queryFn: () => api.get('/badges').then((r) => r.data?.data),
  });

  const badges: Badge[] = data ?? [];

  const createMutation = useMutation({
    mutationFn: (body: BadgeFormState) => api.post('/badges', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast({ title: 'Badge criado!' });
      setShowCreate(false);
      setForm(emptyForm());
    },
    onError: () => toast({ title: 'Erro ao criar badge', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<BadgeFormState> }) =>
      api.patch(`/badges/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast({ title: 'Badge atualizado!' });
      setEditingId(null);
    },
    onError: () => toast({ title: 'Erro ao atualizar badge', variant: 'destructive' }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/badges/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-badges'] });
      queryClient.invalidateQueries({ queryKey: ['badges'] });
      toast({ title: 'Badge removido!' });
      setConfirmDelete(null);
    },
    onError: () => toast({ title: 'Erro ao remover badge', variant: 'destructive' }),
  });

  const startEdit = (badge: Badge) => {
    setEditingId(badge.id);
    setShowCreate(false);
    setForm({
      name: badge.name,
      slug: badge.slug,
      description: badge.description,
      icon: badge.icon,
      color: badge.color,
      rarity: badge.rarity,
    });
  };

  const field = <K extends keyof BadgeFormState>(key: K, value: BadgeFormState[K]) =>
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'name') next.slug = toSlug(value as string);
      return next;
    });

  const formRow = (isNew: boolean, onSave: () => void, onCancel: () => void) => (
    <div className="bg-secondary/50 border border-primary/20 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Nome</label>
          <input value={form.name} onChange={(e) => field('name', e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Slug</label>
          <input value={form.slug} onChange={(e) => field('slug', e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Ícone (emoji)</label>
          <input value={form.icon} onChange={(e) => field('icon', e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="🏆" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Raridade</label>
          <select value={form.rarity} onChange={(e) => field('rarity', e.target.value as BadgeRarity)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
            {RARITIES.map((r) => (
              <option key={r} value={r}>{RARITY_LABELS[r]}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-muted-foreground block mb-1">Cor</label>
          <div className="flex gap-2 items-center">
            <input type="color" value={form.color} onChange={(e) => field('color', e.target.value)}
              className="h-9 w-12 rounded-lg border border-border bg-card cursor-pointer" />
            <span className="text-xs text-muted-foreground">{form.color}</span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-xs text-muted-foreground block mb-1">Descrição</label>
        <input value={form.description} onChange={(e) => field('description', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={!form.name || !form.icon}
          className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all">
          <Check className="w-3.5 h-3.5" /> Salvar
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-all">
          <X className="w-3.5 h-3.5" /> Cancelar
        </button>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  const grouped = RARITIES.map((r) => ({ rarity: r, items: badges.filter((b) => b.rarity === r) })).filter((g) => g.items.length > 0 || true);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Badges</h1>
          <p className="text-sm text-muted-foreground mt-1">{badges.length} badge{badges.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => { setShowCreate(true); setEditingId(null); setForm(emptyForm()); }}
          className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all"
        >
          <Plus className="w-4 h-4" /> Novo badge
        </button>
      </div>

      <div className="space-y-6">
        {showCreate && (
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Novo badge</p>
            {formRow(true,
              () => createMutation.mutate(form),
              () => { setShowCreate(false); setForm(emptyForm()); },
            )}
          </div>
        )}

        {grouped.map(({ rarity, items }) => (
          <div key={rarity}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {RARITY_LABELS[rarity]} <span className="font-normal">— {items.length}</span>
            </p>
            <div className="space-y-2">
              {items.map((badge) => (
                <div key={badge.id}>
                  {editingId === badge.id ? (
                    formRow(false,
                      () => updateMutation.mutate({ id: badge.id, body: form }),
                      () => setEditingId(null),
                    )
                  ) : confirmDelete === badge.id ? (
                    <div className="bg-card border border-red-500/30 rounded-xl px-4 py-3.5 flex items-center gap-4">
                      <span className="text-2xl w-9 text-center shrink-0">{badge.icon}</span>
                      <p className="flex-1 text-sm text-foreground">
                        Remover <span className="font-semibold">{badge.name}</span>? Esta ação não pode ser desfeita.
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => deleteMutation.mutate(badge.id)}
                          className="text-xs font-semibold text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded-lg transition-all"
                        >
                          Remover
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg hover:bg-secondary transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-primary/20 transition-all">
                      <span className="text-2xl w-9 text-center shrink-0">{badge.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-foreground text-sm">{badge.name}</p>
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                            style={{ backgroundColor: `${badge.color}20`, color: badge.color, border: `1px solid ${badge.color}40` }}
                          >
                            {RARITY_LABELS[badge.rarity]}
                          </span>
                        </div>
                        {badge.description && <p className="text-xs text-muted-foreground mt-0.5">{badge.description}</p>}
                        <p className="text-xs text-muted-foreground/60 mt-0.5 font-mono">{badge.slug}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-3 h-3 rounded-full" style={{ background: badge.color }} />
                        <button
                          onClick={() => startEdit(badge)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setConfirmDelete(badge.id)}
                          className="p-1.5 rounded-lg text-muted-foreground hover:text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              {items.length === 0 && (
                <p className="text-xs text-muted-foreground/50 px-1">Nenhum badge nessa raridade.</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
