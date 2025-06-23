import React, { useState, useCallback, useEffect, useRef } from 'react';
// ...existing imports...

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const timeoutRefs = useRef(new Map());

  const removeToast = useCallback((id) => {
    if (timeoutRefs.current.has(id)) {
      clearTimeout(timeoutRefs.current.get(id));
      timeoutRefs.current.delete(id);
    }
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    if (toast.duration && toast.duration > 0) {
      const timeoutId = setTimeout(() => removeToast(id), toast.duration);
      timeoutRefs.current.set(id, timeoutId);
    }
    
    return id;
  }, [removeToast]);

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutRefs.current.clear();
    };
  }, []);

  // ...existing code...
};
