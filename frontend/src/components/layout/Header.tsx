import { Bell } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import UserAvatar from '@/components/shared/UserAvatar';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all">
          <Bell className="w-4 h-4" />
        </button>
        {user && <UserAvatar name={user.name} avatar={user.avatar} size="sm" />}
      </div>
    </header>
  );
}
