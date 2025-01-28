import React, { useEffect } from 'react';

interface NotificationToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  onClose: () => void;
  duration?: number;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  message,
  type = 'info',
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-yellow-500',
  };

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-up`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold hover:opacity-80">
          ×
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;

