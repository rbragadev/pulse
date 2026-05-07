import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Pencil, Check, X } from 'lucide-react';
import api from '@/lib/api';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/useToast';
import { PointRule } from '@/types';

interface RuleForm {
  points: number;
  weeklyLimit: number;
  cooldownHours: number;
}

export default function AdminRules() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<RuleForm>({ points: 1, weeklyLimit: 10, cooldownHours: 0 });

  const { data, isLoading } = useQuery({
    queryKey: ['admin-rules'],
    queryFn: () => api.get('/admin/rules').then((r) => r.data),
  });

  const rules: PointRule[] = data?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: RuleForm }) =>
      api.patch(`/admin/rules/${id}`, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-rules'] });
      toast({ title: 'Regra atualizada!' });
      setEditingId(null);
    },
    onError: () => toast({ title: 'Erro ao atualizar', variant: 'destructive' }),
  });

  const startEdit = (rule: PointRule) => {
    setEditingId(rule.id);
    setForm({ points: rule.points, weeklyLimit: rule.weeklyLimit, cooldownHours: rule.cooldownHours });
  };

  const field = (key: keyof RuleForm, value: number) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Regras de Pontuação</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Configure os pontos e limites por categoria
        </p>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pontos', desc: 'Valor de cada kudos desta categoria' },
          { label: 'Limite semanal', desc: 'Máx. kudos que um usuário pode enviar por semana' },
          { label: 'Cooldown (horas)', desc: 'Espera mínima entre kudos do mesmo tipo' },
        ].map((item) => (
          <div key={item.label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        {rules.map((rule) => (
          <div key={rule.id}>
            {editingId === rule.id ? (
              <div className="bg-secondary/50 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xl">{rule.category?.icon}</span>
                  <p className="font-semibold text-foreground">{rule.category?.name}</p>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label htmlFor={`rule-points-${rule.id}`} className="text-xs text-muted-foreground block mb-1">Pontos</label>
                    <input id={`rule-points-${rule.id}`} type="number" min={1} max={10} value={form.points}
                      onChange={(e) => field('points', +e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label htmlFor={`rule-limit-${rule.id}`} className="text-xs text-muted-foreground block mb-1">Limite semanal</label>
                    <input id={`rule-limit-${rule.id}`} type="number" min={1} max={50} value={form.weeklyLimit}
                      onChange={(e) => field('weeklyLimit', +e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label htmlFor={`rule-cd-${rule.id}`} className="text-xs text-muted-foreground block mb-1">Cooldown (h)</label>
                    <input id={`rule-cd-${rule.id}`} type="number" min={0} max={168} value={form.cooldownHours}
                      onChange={(e) => field('cooldownHours', +e.target.value)}
                      className="w-full bg-card border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button onClick={() => updateMutation.mutate({ id: rule.id, body: form })}
                    disabled={updateMutation.isPending}
                    className="flex items-center gap-1.5 bg-primary text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-all">
                    <Check className="w-3.5 h-3.5" /> Salvar
                  </button>
                  <button onClick={() => setEditingId(null)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg hover:bg-secondary transition-all">
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-xl px-4 py-3.5 flex items-center gap-4 hover:border-primary/20 transition-all">
                <span className="text-xl w-8 text-center shrink-0">{rule.category?.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm">{rule.category?.name}</p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{rule.points}</span> pt/kudos
                    </span>
                    <span className="text-xs text-muted-foreground">
                      limite: <span className="font-semibold text-foreground">{rule.weeklyLimit}</span>/semana
                    </span>
                    <span className="text-xs text-muted-foreground">
                      cooldown: <span className="font-semibold text-foreground">{rule.cooldownHours}h</span>
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="w-3 h-3 rounded-full" style={{ background: rule.category?.color ?? '#888' }} />
                  <button onClick={() => startEdit(rule)}
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
