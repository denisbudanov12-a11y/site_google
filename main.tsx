import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import Admin from './admin/Admin.tsx';
import { ContentProvider } from './content/ContentProvider.tsx';
import './index.css';

const isAdminHash = () => window.location.hash.startsWith('#/admin');

function Root() {
  const [admin, setAdmin] = useState(isAdminHash());
  useEffect(() => {
    const h = () => setAdmin(isAdminHash());
    window.addEventListener('hashchange', h);
    return () => window.removeEventListener('hashchange', h);
  }, []);
  // Админка загружает данные сама, публичный сайт — через ContentProvider.
  if (admin) return <Admin />;
  return (
    <ContentProvider>
      <App />
    </ContentProvider>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);
