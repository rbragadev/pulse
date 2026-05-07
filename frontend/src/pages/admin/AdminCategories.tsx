import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Check, X } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { KudosCategory } from '@/types';

interface CategoryFormState {
  name: string;
  description: string;
  icon: string;
  color: string;
  weight: number;
  isActive: boolean;
}

const emptyForm = (): CategoryFormState => ({
  name: '', description: '', icon: '', color: '#6366f1', weight: 1, isActive: true,
});

export default function AdminCategories() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CategoryFormState>(emptyForm());

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/admin/categories').then((r) => r.data),
  });

  const categories: KudosCategory[] = data?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (body: CategoryFormState) => api.post('/admin/categories', body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Categoria criada!' });
      setShowCreate(false);
      setForm(emptyForm());
    },
    onError: () => toast({ title: 'Erro ao criar', variant: 'destructive' }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<CategoryFormState> }) =>
      api.patch(`/admin/categories/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      toast({ title: 'Categoria atualizada!' });
      setEditingId(null);
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  const startEdit = (cat: KudosCategory) => {
    setEditingId(cat.id);
    setForm({
      name: cat.name,
      description: cat.description ?? '',
      icon: cat.icon ?? '',
      color: cat.color ?? '#6366f1',
      weight: cat.weight,
      isActive: cat.isActive,
    });
  };

  const field = (key: keyof CategoryFormState, value: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const formRow = (id: string | null, onSave: () => void, onCancel: () => void) => (
    <div className="bg-secondary/50 border border-primary/20 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="cat-name" className="text-xs text-muted-foreground block mb-1">Nome</label>
          <input id="cat-name" value={form.name} onChange={(e) => field('name', e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label htmlFor="cat-icon" className="text-xs text-muted-foreground block mb-1">Ícone (emoji)</label>
          <input id="cat-icon" value={form.icon} onChange={(e) => field('icon', e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div>
          <label htmlFor="cat-color" className="text-xs text-muted-foreground block mb-1">Cor</label>
          <div className="flex gap-2 items-center">
            <input id="cat-color" type="color" value={form.color} onChange={(e) => field('color', e.target.value)}
              className="h-9 w-12 rounded-lg border border-border bg-card cursor-pointer" />
            <span className="text-xs text-muted-foreground">{form.color}</span>
          </div>
        </div>
        <div>
          <label htmlFor="cat-weight" className="text-xs text-muted-foreground block mb-1">Peso (pontos)</label>
          <input id="cat-weight" type="number" min={1} max={10} value={form.weight} onChange={(e) => field('weight', +e.target.value)}
            className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
      </div>
      <div>
        <label htmlFor="cat-desc" className="text-xs text-muted-foreground block mb-1">Descrição</label>
        <input id="cat-desc" value={form.description} onChange={(e) => field('description', e.target.value)}
          className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
      </div>
      {id && (
        <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
          <input type="checkbox" checked={form.isActive} onChange={(e) => field('isActive', e.target.checked)} className="rounded" />
          Ativa
        </label>
      )}
      <div className="flex gap-2 pt-1">
        <button onClick={onSave} disabled={!form.name}
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Categorias</h1>
          <p className="text-sm text-muted-foreground mt-1">{categories.length} categorias</p>
        </div>
        <button onClick={() => { setShowCreate(true); setEditingId(null); setForm(emptyForm()); }}
          className="flex items-center gap-2 bg-primary text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary/90 transition-all">
          <Plus className="w-4 h-4" /> Nova categoria
        </button>
      </div>

      <div className="space-y-3">
        {showCreate && formRow(null,
          () => createMutation.mutate(form),
          () => { setShowCreate(false); setForm(emptyForm()); },
        )}

        {categories.map((cat) => (
          <div key={cat.id}>
            {editingId === cat.id ? (
              formRow(cat.id,
                () => updateMutation.mutate({ id: cat.id, body: form }),
                () => setEditingId(null),
              )
            ) : (
              <div className={`bg-card border rounded-xl px-4 py-3.5 flex items-center gap-4 transition-all ${cat.isActive ? 'border-border hover:border-primary/20' : 'border-border/50 opacity-60'}`}>
                <span className="text-2xl w-9 text-center shrink-0">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground text-sm">{cat.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: `${cat.color}20`, color: cat.color ?? undefined }}>
                      {cat.weight}pt
                    </span>
                    {!cat.isActive && (
                      <span className="text-xs text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded-full">Inativa</span>
                    )}
                  </div>
                  {cat.description && <p className="text-xs text-muted-foreground mt-0.5">{cat.description}</p>}
                  <p className="text-xs text-muted-foreground mt-0.5">{cat._count?.posts ?? 0} kudos</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ background: cat.color ?? '#888' }} />
                  <button onClick={() => startEdit(cat)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
