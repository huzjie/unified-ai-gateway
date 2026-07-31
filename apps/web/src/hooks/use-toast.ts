import { useNotificationsStore } from '../store/notifications-store';

/** Toast 通知 */
export function useToast() {
  const show = useNotificationsStore((s) => s.show);
  return {
    success: (msg: string) => show('success', msg),
    error: (msg: string) => show('error', msg),
    info: (msg: string) => show('info', msg),
    warning: (msg: string) => show('warning', msg),
  };
}
