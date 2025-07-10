"use client";
import { useEffect, useState } from "react";
import styles from "./Notification.module.css";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Notification({ 
  message, 
  type, 
  isVisible, 
  onClose, 
  duration = 4000 
}: NotificationProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setTimeout(onClose, 300); // Attendre la fin de l'animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className={`${styles.notification} ${styles[type]} ${isAnimating ? styles.show : styles.hide}`}>
      <div className={styles.icon}>
        {type === "success" && "✓"}
        {type === "error" && "✕"}
        {type === "info" && "ℹ"}
      </div>
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
      </div>
      <button 
        className={styles.closeButton}
        onClick={() => {
          setIsAnimating(false);
          setTimeout(onClose, 300);
        }}
        aria-label="Fermer la notification"
      >
        ×
      </button>
    </div>
  );
} 