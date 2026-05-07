import { useAuthStore } from '@/store/auth.store';
import UserAvatar from '@/components/shared/UserAvatar';
import NotificationsDropdown from '@/components/shared/NotificationsDropdown';
import { Link } from 'react-router-dom';

export default function Header() {
  const { user } = useAuthStore();

  return (
    <header className="h-14 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      <div />
      <div className="flex items-center gap-2">
        <NotificationsDropdown />
        {user && (
          <Link to="/profile">
            <UserAvatar name={user.name} avatar={user.avatar} size="sm" className="hover:ring-2 hover:ring-primary/40 transition-all" />
          </Link>
        )}
      </div>
    </header>
  );
}
