import React, { createContext, useContext, useState, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

type ToastVariant = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message: string, variant: ToastVariant = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prevToasts) => [...prevToasts, { id, message, variant }]);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
    
    return id;
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <Toaster toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  );
};

const toastVariantClasses = {
  success: 'bg-green-50 text-green-800 border-green-400',
  error: 'bg-red-50 text-red-800 border-red-400',
  warning: 'bg-amber-50 text-amber-800 border-amber-400',
  info: 'bg-blue-50 text-blue-800 border-blue-400',
};

interface ToasterProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export const Toaster: React.FC<{ toasts?: Toast[]; removeToast?: (id: string) => void }> = ({ 
  toasts = [], 
  removeToast = () => {} 
}) => {
  return (
    <div className="fixed bottom-0 right-0 p-4 z-50 max-w-sm space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'p-4 border rounded-md shadow-md transform transition-all duration-300 ease-in-out',
            toastVariantClasses[toast.variant]
          )}
          style={{ 
            animation: 'slideInUp 0.3s ease forwards, fadeOut 0.3s ease 4.7s forwards'
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-sm">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ))}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeOut {
          from {
            opacity: 1;
          }
          to {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};