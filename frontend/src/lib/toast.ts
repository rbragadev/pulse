export interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
}

export interface ToastItem extends ToastOptions {
  id: string;
}

type Listener = (toasts: ToastItem[]) => void;

let toasts: ToastItem[] = [];
const listeners = new Set<Listener>();

function notify() {
  listeners.forEach((l) => l([...toasts]));
}

export function toast(opts: ToastOptions) {
  const id = Math.random().toString(36).slice(2);
  const item: ToastItem = { id, duration: 4000, ...opts };
  toasts = [...toasts, item];
  notify();

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    notify();
  }, item.duration);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function getToasts() {
  return toasts;
}
