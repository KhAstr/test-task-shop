import { useState, useEffect, type JSX, type FormEvent } from "react";
import "./LoginForm.css";

interface LoginFormProps {
  onLoginSuccess: (token: string) => void;
}

const LoginForm = ({ onLoginSuccess }: LoginFormProps): JSX.Element => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; password?: string; general?: string }>({});

  useEffect(() => {
    const savedUsername = localStorage.getItem("savedUsername");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedRememberMe && savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const validate = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    if (!username.trim()) {
      newErrors.username = "Логин обязателен для заполнения";
    }

    if (!password) {
      newErrors.password = "Пароль обязателен для заполнения";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("https://dummyjson.com/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
          expiresInMins: rememberMe ? 30 : 1,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Ошибка авторизации");
      }

      if (rememberMe) {
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("savedUsername", username.trim());
        localStorage.setItem("rememberMe", "true");
      } else {
        sessionStorage.setItem("token", data.accessToken);
        sessionStorage.setItem("refreshToken", data.refreshToken);
        localStorage.removeItem("savedUsername");
        localStorage.removeItem("rememberMe");
      }

      const userInfo = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        gender: data.gender,
        image: data.image,
      };

      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(userInfo));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userInfo));
      }

      onLoginSuccess(data.accessToken);

    } catch (error) {
      setErrors({
        general: error instanceof Error ? error.message : "Ошибка соединения с сервером",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <div className="login-card__outer">
        <div className="login-card">

          <div className="login-logo">
            <div className="login-logo__frame">
              <img src="/logo.svg" alt="Logo" width="35" height="34" />
            </div>
          </div>


          <h1 className="login-title">Добро пожаловать!</h1>
          <p className="login-subtitle">Пожалуйста, авторизуйтесь</p>


          <form onSubmit={handleSubmit} className="login-form">

            <div className="form-field">
              <label htmlFor="login">Логин</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  name="login"
                  type="text"
                  className={`form-input ${errors.username ? "error" : ""}`}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <span className="error-message">{errors.username}</span>
            </div>


            <div className="form-field">
              <label htmlFor="password">Пароль</label>
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="11" width="14" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M8 11V8C8 5.8 9.8 4 12 4C14.2 4 16 5.8 16 8V11" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className={`form-input ${errors.password ? "error" : ""}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                      <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  ) : (

                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  )}
                </button>
              </div>
              <span className="error-message">{errors.password}</span>
            </div>


            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">Запомнить данные</span>
            </label>


            {errors.general && (
              <div className="general-error">{errors.general}</div>
            )}


            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>


          <div className="divider">
            <span className="divider-line"></span>
            <span className="divider-text">или</span>
            <span className="divider-line"></span>
          </div>


          <div className="signup-link">
            <span>Нет аккаунта?</span>
            <a href="#" onClick={(e) => e.preventDefault()}>Создать</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;