import { useNotificationStore, AlertData } from '@/store/useNotificationStore';

// Utility function to show custom alerts throughout the application
export const showAlert = (
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) => {
  const alertData: AlertData = {
    title,
    message,
    type
  };
  
  useNotificationStore.getState().showAlert(alertData);
};
