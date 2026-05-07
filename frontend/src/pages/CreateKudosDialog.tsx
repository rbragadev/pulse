import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useAuthStore } from '@/store/auth.store';
import { useToast } from '@/hooks/useToast';
import api from '@/lib/api';

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
}

export default function CreateKudosDialog({ open, onClose }: Props) {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const { toast } = useToast();
  const [recipientId, setRecipientId] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');

  const { data: usersData } = useQuery({
    queryKey: ['users-list'],
    queryFn: () => api.get('/users?limit=100').then((r) => r.data),
    enabled: open,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/kudos/categories').then((r) => r.data),
    enabled: open,
  });

  const users = (
    (usersData?.data?.users as Array<{ id: string; name: string; department?: { name: string } }>) ?? []
  ).filter((u) => u.id !== currentUser?.id);

  const categories =
    (categoriesData?.data as Array<{ id: string; name: string; icon?: string }>) ?? [];

  const createMutation = useMutation({
    mutationFn: () => api.post('/kudos', { recipientId, categoryId, message }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kudos'] });
      toast({ title: 'Reconhecimento publicado!', variant: 'default' });
      onClose();
      setRecipientId('');
      setCategoryId('');
      setMessage('');
    },
    onError: () => {
      toast({ title: 'Erro ao publicar', description: 'Tente novamente.', variant: 'destructive' });
    },
  });

  const canSubmit = recipientId && categoryId && message.length >= 10;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reconhecer colega</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          {/* Recipient */}
          <div>
            <label
              htmlFor="kudos-recipient"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2"
            >
              Colaborador
            </label>
            <select
              id="kudos-recipient"
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="">Selecionar colaborador...</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                  {u.department?.name ? ` — ${u.department.name}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="kudos-category"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2"
            >
              Categoria
            </label>
            <select
              id="kudos-category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer"
            >
              <option value="">Selecionar categoria...</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon ? `${c.icon} ` : ''}
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label
              htmlFor="kudos-message"
              className="text-xs font-medium text-muted-foreground uppercase tracking-wider block mb-2"
            >
              Mensagem
            </label>
            <textarea
              id="kudos-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Descreva o reconhecimento... (mínimo 10 caracteres)"
              rows={4}
              className="w-full bg-secondary border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            />
            <p className={`text-xs mt-1 ${message.length >= 10 ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
              {message.length} caracteres
              {message.length > 0 && message.length < 10 ? ' (mínimo 10)' : ''}
            </p>
          </div>

          {/* Submit */}
          <button
            onClick={() => createMutation.mutate()}
            disabled={!canSubmit || createMutation.isPending}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
          >
            {createMutation.isPending ? 'Publicando...' : 'Publicar reconhecimento'}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
