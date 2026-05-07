import { Lock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const COMMUNITIES = [
  { id: 1, name: 'Devs OTG', description: 'Engenharia, code review e tech talks internos', icon: '👨‍💻', color: '#6366f1', members: 12, posts: 47, joined: true },
  { id: 2, name: 'Cultura OTG', description: 'Valores, rituais e identidade da empresa', icon: '🏆', color: '#ec4899', members: 20, posts: 83, joined: true },
  { id: 3, name: 'Frontend Lovers', description: 'UI/UX, React, design systems e mais', icon: '🎨', color: '#8b5cf6', members: 8, posts: 24, joined: false },
  { id: 4, name: 'Café e Código', description: 'Para os que programam com cafeína ☕', icon: '☕', color: '#f59e0b', members: 15, posts: 62, joined: false },
  { id: 5, name: 'Produto & Dados', description: 'PMs, analistas e amantes de métricas', icon: '📊', color: '#10b981', members: 10, posts: 35, joined: false },
  { id: 6, name: 'Comercial OTG', description: 'Vendas, clientes e growth hacking', icon: '💼', color: '#3b82f6', members: 9, posts: 28, joined: false },
  { id: 7, name: 'People & Cultura', description: 'RH, desenvolvimento e bem-estar', icon: '💛', color: '#eab308', members: 7, posts: 19, joined: false },
  { id: 8, name: 'Financeiro', description: 'Numbers, relatórios e planejamento', icon: '📈', color: '#14b8a6', members: 5, posts: 12, joined: false },
];

export default function CommunitiesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Comunidades</h1>
            <p className="text-sm text-muted-foreground">Grupos de interesse na OTG</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full bg-yellow-400/10 border border-yellow-400/30">
          <Lock className="w-3 h-3 text-yellow-400" />
          <p className="text-xs text-yellow-400 font-medium">
            Funcionalidade completa chegando em breve
          </p>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-primary">{COMMUNITIES.length}</p>
          <p className="text-xs text-muted-foreground">Comunidades</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {COMMUNITIES.reduce((s, c) => s + c.members, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Membros</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-3 text-center">
          <p className="text-xl font-bold text-foreground">
            {COMMUNITIES.reduce((s, c) => s + c.posts, 0)}
          </p>
          <p className="text-xs text-muted-foreground">Posts</p>
        </div>
      </div>

      {/* Communities grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {COMMUNITIES.map((c) => (
          <div
            key={c.id}
            className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            {/* Background accent */}
            <div
              className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5 -translate-y-6 translate-x-6"
              style={{ backgroundColor: c.color }}
            />

            <div className="relative flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border"
                style={{ backgroundColor: `${c.color}15`, borderColor: `${c.color}30` }}
              >
                {c.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-foreground">{c.name}</h3>
                  {c.joined && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full text-primary bg-primary/10 border border-primary/30 font-medium">
                      Membro
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                  {c.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] text-muted-foreground">
                    👥 {c.members} membros
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    💬 {c.posts} posts
                  </span>
                </div>
              </div>
            </div>

            <button
              disabled
              className={cn(
                'w-full mt-4 py-2 rounded-lg text-xs font-medium transition-all relative z-10',
                c.joined
                  ? 'bg-secondary text-muted-foreground border border-border'
                  : 'bg-primary/10 text-primary border border-primary/30 opacity-60',
              )}
            >
              {c.joined ? '✓ Participando' : 'Entrar — Em breve'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
