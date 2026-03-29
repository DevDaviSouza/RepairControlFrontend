import { ReactNode, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const navItems = useMemo(
    () => [
      { path: '/dashboard', label: 'Dashboard' },
      { path: '/orders', label: 'Ordens de Servico' },
      { path: '/customers', label: 'Clientes' },
      { path: '/payments', label: 'Pagamentos' },
      { path: '/enterprises', label: 'Empresas' },
    ],
    []
  );

  const logout = () => {
    localStorage.removeItem('auth_token');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-dv-background text-dv-text">
      <div className="min-h-screen md:grid md:grid-cols-[260px,1fr]">
        <aside className="hidden md:flex md:flex-col border-r border-dv-border/70 bg-dv-nav/90 backdrop-blur-xl">
          <div className="h-24 px-6 flex items-center border-b border-dv-border/70">
            <div>
              <h1 className="font-display text-3xl tracking-wide text-white">RepairControl</h1>
              <p className="text-[11px] uppercase tracking-[0.26em] text-dv-textSoft mt-1">
                Industrial Precision
              </p>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center rounded-xl border px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? 'border-dv-blue/50 bg-dv-surfaceAlt text-dv-text shadow-glow-blue'
                    : 'border-transparent text-dv-textMuted hover:border-dv-border hover:bg-dv-surface hover:text-dv-text'
                }`}
              >
                <span className="h-2.5 w-2.5 rounded-full bg-current/80 mr-3 transition-transform group-hover:scale-125" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4">
            <button
              onClick={logout}
              className="w-full rounded-xl border border-dv-border bg-dv-surface px-4 py-3 text-left text-sm font-medium text-dv-textMuted transition-colors hover:text-dv-text hover:border-dv-blue/40"
            >
              Sair
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="h-16 border-b border-dv-border/70 bg-dv-nav/70 backdrop-blur-xl px-4 md:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden rounded-lg border border-dv-border bg-dv-surface px-3 py-2 text-sm font-medium text-dv-text"
              >
                Menu
              </button>
              <div>
                <h2 className="font-display text-xl leading-none text-white">Ordens de Servico</h2>
                <p className="text-xs text-dv-textSoft mt-1">Gestao e controle operacional</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="h-2.5 w-2.5 rounded-full bg-dv-lime animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-dv-textSoft">
                Operational Stability
              </span>
              <button
                onClick={logout}
                className="ml-2 rounded-lg border border-dv-border bg-dv-surface px-3 py-2 text-sm text-dv-textMuted transition-colors hover:text-dv-text"
              >
                Sair
              </button>
            </div>
          </header>

          {mobileMenuOpen && (
            <nav className="md:hidden border-b border-dv-border/70 bg-dv-nav px-4 py-3 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm ${
                    isActive(item.path)
                      ? 'bg-dv-surfaceAlt text-dv-text'
                      : 'text-dv-textMuted hover:bg-dv-surface'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          )}

          <main className="px-4 py-6 md:px-8 md:py-8 lg:px-10">{children}</main>
        </div>
      </div>
    </div>
  );
};
