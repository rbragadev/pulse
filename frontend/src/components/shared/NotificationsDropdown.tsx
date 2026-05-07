import { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Notification {
  readonly id: number;
  readonly icon: string;
  readonly text: string;
  readonly sub: string;
  read: boolean;
  readonly href: string;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, icon: '🔥', text: 'Lucas reagiu ao seu reconhecimento', sub: 'há 5 min', read: false, href: '/feed' },
  { id: 2, icon: '💬', text: 'Ana comentou no seu post', sub: 'há 12 min', read: false, href: '/feed' },
  { id: 3, icon: '🚀', text: 'Carlos te reconheceu em Inovação', sub: 'há 1h', read: false, href: '/profile' },
  { id: 4, icon: '⭐', text: 'Você subiu para TOP 3 do mês!', sub: 'há 2h', read: true, href: '/galacticos' },
  { id: 5, icon: '🏆', text: 'Nova badge desbloqueada: Team Player', sub: 'hoje', read: true, href: '/badges' },
  { id: 6, icon: '👏', text: 'Gabriel e +3 reagiram ao seu post', sub: 'ontem', read: true, href: '/feed' },
  { id: 7, icon: '🎯', text: 'Conquista desbloqueada: Popular!', sub: 'ontem', read: true, href: '/profile' },
];

export default function NotificationsDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const ref = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: number) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        aria-label="Notificações"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary animate-pulse" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-80 bg-card border border-border rounded-2xl shadow-2xl shadow-black/30 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-foreground">Notificações</h3>
              {unread > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                  {unread}
                </span>
              )}
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs text-primary hover:underline"
              >
                Marcar tudo
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <Link
                key={n.id}
                to={n.href}
                onClick={() => {
                  markRead(n.id);
                  setOpen(false);
                }}
                className={cn(
                  'flex items-start gap-3 px-4 py-3 hover:bg-secondary/50 transition-colors border-b border-border/40 last:border-0',
                  !n.read && 'bg-primary/5',
                )}
              >
                <span className="text-lg leading-none mt-0.5 shrink-0">{n.icon}</span>
                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      'text-xs leading-snug',
                      n.read ? 'text-muted-foreground' : 'text-foreground font-medium',
                    )}
                  >
                    {n.text}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.sub}</p>
                </div>
                {!n.read && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                )}
              </Link>
            ))}
          </div>

          <div className="px-4 py-2.5 border-t border-border bg-secondary/30">
            <p className="text-[10px] text-muted-foreground text-center">
              🔔 Notificações em tempo real · em breve
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
