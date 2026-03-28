import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const toastVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: 20, scale: 0.95, transition: { duration: 0.2 } },
};

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-rose-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  loading: <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />,
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const updateToast = useCallback((id, message, type = 'info', duration = 4000) => {
    setToasts((prev) => prev.map((toast) => 
      toast.id === id ? { ...toast, message, type } : toast
    ));

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, updateToast }}>
      {children}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 pointer-events-none items-center w-full max-w-sm px-4">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              variants={toastVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className="pointer-events-auto w-full bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 text-zinc-100 shadow-2xl rounded-xl p-4 flex items-center gap-4"
            >
              <div className="shrink-0">{icons[toast.type]}</div>
              <p className="text-sm font-medium flex-1 leading-snug">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-1 -mr-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
