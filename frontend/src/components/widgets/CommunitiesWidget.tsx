import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const COMMUNITIES = [
  { id: 1, name: 'Devs OTG', icon: '👨‍💻', members: 12, color: '#6366f1' },
  { id: 2, name: 'Cultura OTG', icon: '🏆', members: 20, color: '#ec4899' },
  { id: 3, name: 'Frontend Lovers', icon: '🎨', members: 8, color: '#8b5cf6' },
  { id: 4, name: 'Café e Código', icon: '☕', members: 15, color: '#f59e0b' },
  { id: 5, name: 'Produto & Dados', icon: '📊', members: 10, color: '#10b981' },
];

export default function CommunitiesWidget() {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          Comunidades
        </h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-400/10 text-yellow-500 border border-yellow-400/30 font-medium">
          Em breve
        </span>
      </div>
      <div className="space-y-1.5">
        {COMMUNITIES.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-2.5 px-1.5 py-1 rounded-lg opacity-75"
          >
            <span
              className="w-6 h-6 rounded-md flex items-center justify-center text-sm shrink-0"
              style={{ backgroundColor: `${c.color}20` }}
            >
              {c.icon}
            </span>
            <p className="text-xs text-foreground flex-1 truncate">{c.name}</p>
            <span className="text-[10px] text-muted-foreground">{c.members}</span>
          </div>
        ))}
      </div>
      <Link
        to="/communities"
        className="block text-center text-xs text-primary hover:underline mt-3 pt-2.5 border-t border-border/50"
      >
        Explorar comunidades →
      </Link>
    </div>
  );
}
