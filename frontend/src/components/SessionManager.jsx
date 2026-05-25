import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const SESSION_LIMIT = 5 * 60 * 1000; // 5 minutos
const LAST_ACTIVITY_KEY = "foodhub_last_activity";

function SessionManager() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    if (!user || !token) {
      return;
    }

    const updateLastActivity = () => {
      localStorage.setItem(LAST_ACTIVITY_KEY, Date.now().toString());
    };

    const checkSession = () => {
      const lastActivity = localStorage.getItem(LAST_ACTIVITY_KEY);

      if (!lastActivity) {
        updateLastActivity();
        return;
      }

      const inactiveTime = Date.now() - Number(lastActivity);

      if (inactiveTime >= SESSION_LIMIT) {
        logout();
        localStorage.removeItem(LAST_ACTIVITY_KEY);

        alert("A sua sessão expirou, faça login novamente.");

        navigate("/login");
      }
    };

    updateLastActivity();

    const events = [
      "mousemove",
      "mousedown",
      "keydown",
      "click",
      "scroll",
      "touchstart"
    ];

    events.forEach((event) => {
      window.addEventListener(event, updateLastActivity);
    });

    const interval = setInterval(checkSession, 10000);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, updateLastActivity);
      });

      clearInterval(interval);
    };
  }, [user, token, logout, navigate]);

  return null;
}

export default SessionManager;