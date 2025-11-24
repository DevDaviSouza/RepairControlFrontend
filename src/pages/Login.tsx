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
      // Por enquanto, como não há autenticação no backend, vamos simular um login
      // Quando a autenticação for implementada, aqui será feita a chamada real
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simular token (remover quando autenticação real for implementada)
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
    <div className="min-h-screen flex items-center justify-center bg-dv-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-dv-text">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-dv-text">
            RepairControl
          </h2>
          <p className="mt-2 text-center text-sm text-dv-textMuted">
            Sistema de Gestão para Oficinas
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
              className="rounded-t-md"
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="rounded-b-md"
            />
          </div>

          <div>
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              className="w-full"
            >
              Entrar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

