import { toast as hotToast } from 'react-hot-toast';

export function useToast() {
  return {
    success: (title: string, description: string) => hotToast.success(title),
    error: (title: string, description: string) => hotToast.error(title),
    info: (title: string, description: string) => hotToast(title)
  };
}
