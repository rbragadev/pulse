import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import UserAvatar from '@/components/shared/UserAvatar';

interface FeedComposerProps {
  readonly onOpen: () => void;
}

export default function FeedComposer({ onOpen }: FeedComposerProps) {
  const { user } = useAuthStore();
  if (!user) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-4 mb-4 hover:border-primary/20 transition-all duration-200">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="shrink-0">
          <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
        </Link>
        <button
          onClick={onOpen}
          className="flex-1 text-left px-4 py-2.5 bg-secondary hover:bg-secondary/70 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-all"
        >
          Reconheça alguém hoje 🚀
        </button>
        <button
          onClick={onOpen}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl transition-all text-sm hover:shadow-lg hover:shadow-primary/25 active:scale-[0.98] shrink-0"
        >
          <Zap className="w-4 h-4" />
          Reconhecer
        </button>
      </div>
    </div>
  );
}
