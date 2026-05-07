import { toast as toastFn, type ToastOptions } from '@/lib/toast';

export function useToast() {
  return { toast: (opts: ToastOptions) => toastFn(opts) };
}
