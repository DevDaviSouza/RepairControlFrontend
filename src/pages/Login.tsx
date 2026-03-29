import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components';
import { Button } from '@/components';
import { useToast } from '@/hooks/useToast';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      localStorage.setItem('auth_token', 'mock_token');

      showToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (error) {
      showToast('Erro ao fazer login. Tente novamente.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-3xl border border-dv-border bg-gradient-to-b from-dv-surface to-dv-backgroundSoft p-8 shadow-card-dark text-dv-text">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-dv-textSoft">Sistema industrial</p>
          <h2 className="mt-2 font-display text-5xl leading-none text-white">RepairControl</h2>
          <p className="mt-3 text-sm text-dv-textMuted">Acesse para gerenciar ordens, clientes e pagamentos.</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="********"
          />

          <Button type="submit" variant="primary" isLoading={isLoading} className="w-full py-3">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};
