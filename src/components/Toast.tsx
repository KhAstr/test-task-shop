import { useEffect, type JSX } from "react";
import "./Toast.css";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  duration?: number;
  onClose: () => void;
}

const Toast = ({ message, type = "success", duration = 3000, onClose }: ToastProps): JSX.Element => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className={`toast toast--${type}`}>
      <span className="toast__icon">
        {type === "success" && "✓"}
        {type === "error" && "✗"}
        {type === "info" && "!"}
      </span>
      <span className="toast__message">{message}</span>
      <button className="toast__close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;