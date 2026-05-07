import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/useToast';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

const CATEGORIES = ['Tecnologia', 'Cultura', 'Diversão', 'Saúde', 'Produto', 'Música', 'Reconhecimento', 'Estilo de Vida'];

interface Props {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onCreated: () => void;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export default function CreateCommunityDialog({ open, onClose, onCreated }: Props) {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManual) setSlug(slugify(val));
  };

  const handleSlugChange = (val: string) => {
    setSlug(slugify(val));
    setSlugManual(true);
  };

  const reset = () => {
    setName('');
    setSlug('');
    setSlugManual(false);
    setDescription('');
    setCategory('');
  };

  const createMutation = useMutation({
    mutationFn: () => api.post('/communities', { name, slug, description, category }),
    onSuccess: () => {
      toast({ title: 'Comunidade criada!' });
      reset();
      onCreated();
    },
    onError: (err: any) => {
      toast({
        title: err?.response?.data?.message ?? 'Erro ao criar comunidade',
        variant: 'destructive',
      });
    },
  });

  const canSubmit = name.trim().length >= 3 && slug.length >= 3 && !createMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Criar comunidade</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              Nome <span className="text-red-400">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              maxLength={80}
              placeholder="Ex: Amantes de Pizza"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">
              URL da comunidade <span className="text-red-400">*</span>
            </label>
            <div className="flex items-center gap-0 bg-secondary border border-border rounded-xl overflow-hidden focus-within:border-primary/50 transition-colors">
              <span className="px-3 text-xs text-muted-foreground border-r border-border py-2 whitespace-nowrap">/communities/</span>
              <input
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                maxLength={100}
                placeholder="amantes-de-pizza"
                className="flex-1 bg-transparent px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
              placeholder="Do que se trata essa comunidade?"
              className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Categoria</label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(category === cat ? '' : cat)}
                  className={cn(
                    'px-2.5 py-1 rounded-full text-xs font-medium border transition-all',
                    category === cat
                      ? 'bg-primary/15 text-primary border-primary/40'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/30 hover:text-foreground',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="flex-1 py-2 rounded-xl text-sm font-medium bg-secondary text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={!canSubmit}
              className="flex-1 py-2 rounded-xl text-sm font-semibold bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? 'Criando...' : 'Criar comunidade'}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
