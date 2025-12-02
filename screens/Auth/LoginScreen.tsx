import React, { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Layout from '../../components/Layout';
import { AuthUser } from '../../types/user';
import { validateUser } from '../../utils/auth';

interface LoginScreenProps {
  onLogin: (user: AuthUser) => void;
  onSwitchToRegister: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onSwitchToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const user = validateUser(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Bem-vindo(a) de volta!</h1>
        <p className="text-gray-600 dark:text-gray-300">Faça login para continuar sua jornada de bem-estar.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        <InputField
          label="Senha"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Sua senha"
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" className="w-full">
          Entrar
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
        Não tem uma conta?{' '}
        <button onClick={onSwitchToRegister} className="text-primary hover:underline font-semibold focus:outline-none">
          Cadastre-se
        </button>
      </p>
    </Layout>
  );
};

export default LoginScreen;