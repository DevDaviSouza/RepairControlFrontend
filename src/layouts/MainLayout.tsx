import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/orders', label: 'Ordens de Serviço' },
    { path: '/customers', label: 'Clientes' },
    { path: '/payments', label: 'Pagamentos' },
    { path: '/enterprises', label: 'Empresas' },
  ];

  return (
    <div className="min-h-screen bg-dv-background text-dv-text">
      <nav className="bg-dv-nav shadow-card-dark border-b border-dv-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-dv-red">RepairControl</h1>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive(item.path)
                        ? 'border-dv-gold text-dv-text'
                        : 'border-transparent text-dv-textSoft hover:text-dv-text'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => {
                  localStorage.removeItem('auth_token');
                  window.location.href = '/';
                }}
                className="text-dv-textSoft hover:text-dv-text px-3 py-2 text-sm font-medium"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

