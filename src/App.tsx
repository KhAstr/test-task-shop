import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from './components/LoginForm';
import ProductsList from './components/ProductsList';
import './App.css'

const queryClient = new QueryClient();

const getInitialAuthState = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  return {
    isAuthenticated: !!token,
    token: token
  };
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => getInitialAuthState().isAuthenticated);
  const [token, setToken] = useState<string | null>(() => getInitialAuthState().token);

  const handleLoginSuccess = (newToken: string) => {
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('savedUsername');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('refreshToken');
    sessionStorage.removeItem('user');
    
    setToken(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app-container">
        <button onClick={handleLogout} className="logout-button">
          Выйти
        </button>
        <ProductsList />
      </div>
    </QueryClientProvider>
  )
}

export default App
