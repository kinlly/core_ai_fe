// ToastContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Toast {
  message: string;
  type?: "success" | "error";
}

interface ToastContextProps {
  showToast: (toast: Toast) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div style={{
          position: "fixed",
          top: 20,
          right: 20,
          padding: "12px 20px",
          borderRadius: "8px",
          background: toast.type === "success" ? "limegreen" : "crimson",
          color: "white",
          fontWeight: 600,
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within a ToastProvider");
  return context;
};
