import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginForm from './components/LoginForm';
import ProductsList from './components/ProductsList';
import Header from './components/Header';
import Modal from './components/Modal';
import AddProductForm from './components/AddProductForm';
import Toast from './components/Toast';
import { useAuthStore } from './stores/authStore';
import { useUIStore } from './stores/uiStore';
import './App.css';

const queryClient = new QueryClient();

function App() {
  const { isAuthenticated, hydrate } = useAuthStore();
  const { isModalOpen, closeModal, toast } = useUIStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <Header />
        <main className="app__main">
          <ProductsList />
        </main>

        <Modal isOpen={isModalOpen} onClose={closeModal} title="Добавление товара">
          <AddProductForm />
        </Modal>

        <Toast />
      </div>
    </QueryClientProvider>
  );
}

export default App;