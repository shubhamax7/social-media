import { createContext, useCallback, useContext, useState } from "react";
import { MdCheckCircle, MdError, MdInfo, MdClose } from "react-icons/md";

const ToastContext = createContext({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

const ICONS = {
  success: <MdCheckCircle />,
  error: <MdError />,
  info: <MdInfo />,
};

let toastIdCounter = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = "info", title, message, duration = 3500 }) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, type, title, message, exiting: false }]);

    setTimeout(() => {
      // Mark as exiting for exit animation
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 380);
    }, duration);
  }, []);

  const dismiss = (id) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 380);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast ${toast.type}${toast.exiting ? " exiting" : ""}`}
            role="alert"
          >
            <span className="toast-icon">{ICONS[toast.type]}</span>
            <div className="toast-body">
              <div className="toast-title">{toast.title}</div>
              {toast.message && (
                <div className="toast-msg">{toast.message}</div>
              )}
            </div>
            <button
              className="toast-close"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <MdClose />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
