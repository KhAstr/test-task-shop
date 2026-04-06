import { useEffect } from "react";
import { useUIStore } from "../stores/uiStore";
import "./Toast.css";

const Toast = () => {
  const { toast, hideToast } = useUIStore();

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        hideToast();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <div className={`toast toast--${toast.type}`}>
      <span className="toast__icon">
        {toast.type === "success" && "✓"}
        {toast.type === "error" && "✗"}
        {toast.type === "info" && "!"}
      </span>
      <span className="toast__message">{toast.message}</span>
      <button className="toast__close" onClick={hideToast}>×</button>
    </div>
  );
};

export default Toast;