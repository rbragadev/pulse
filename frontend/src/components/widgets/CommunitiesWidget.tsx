import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import api from '@/lib/api';
import { MyCommunities, Community } from '@/types';

export default function CommunitiesWidget() {
  const { data: myData } = useQuery({
    queryKey: ['communities-my'],
    queryFn: () => api.get('/communities/my').then((r) => r.data?.data ?? r.data),
  });

  const { data: allData } = useQuery({
    queryKey: ['communities'],
    queryFn: () => api.get('/communities').then((r) => r.data?.data ?? r.data),
  });

  const myCommunities: MyCommunities | null = myData ?? null;
  const myList: Community[] = [
    ...(myCommunities?.communitiesICreated ?? []),
    ...(myCommunities?.communitiesIMember ?? []),
  ].slice(0, 5);

  const allCommunities: Community[] = Array.isArray(allData) ? allData : [];
  const display = myList.length > 0 ? myList : allCommunities.slice(0, 5);

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-primary" />
          {myList.length > 0 ? 'Minhas comunidades' : 'Comunidades'}
        </h3>
        <span className="text-[10px] text-muted-foreground">{allCommunities.length} total</span>
      </div>

      {display.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">Nenhuma comunidade ainda.</p>
      ) : (
        <div className="space-y-1.5">
          {display.map((c) => (
            <Link
              key={c.id}
              to={`/communities/${c.slug}`}
              className="flex items-center gap-2.5 px-1.5 py-1 rounded-lg hover:bg-secondary/70 transition-colors"
            >
              <div className="w-6 h-6 rounded-md overflow-hidden bg-primary/10 shrink-0 flex items-center justify-center">
                {c.avatarUrl ? (
                  <img src={c.avatarUrl} alt={c.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-bold text-primary">{c.name[0]}</span>
                )}
              </div>
              <p className="text-xs text-foreground flex-1 truncate">{c.name}</p>
              <span className="text-[10px] text-muted-foreground shrink-0">{c._count?.members ?? 0}</span>
            </Link>
          ))}
        </div>
      )}

      <Link
        to="/communities"
        className="block text-center text-xs text-primary hover:underline mt-3 pt-2.5 border-t border-border/50"
      >
        Explorar comunidades →
      </Link>
    </div>
  );
}
