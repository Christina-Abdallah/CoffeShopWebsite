import { createContext, useContext, useState, useCallback } from "react";
import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "error") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      removeToast(id);
    }, 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all ${
              toast.type === "success"
                ? "bg-[#152e20] text-white border-[#264132]"
                : toast.type === "info"
                ? "bg-white text-[#2e221d] border-[#e9e2d8]"
                : "bg-[#fee2e2] text-[#991b1b] border-[#fecaca]"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 size={18} className="text-[#b55b3e] shrink-0 mt-0.5" />
            ) : toast.type === "info" ? (
              <Info size={18} className="text-[#b55b3e] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={18} className="text-[#991b1b] shrink-0 mt-0.5" />
            )}
            <p className="text-sm font-medium leading-snug flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="opacity-70 hover:opacity-100 transition shrink-0"
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    return {
      showToast: (msg) => console.warn("Toast:", msg),
    };
  }
  return context;
}
