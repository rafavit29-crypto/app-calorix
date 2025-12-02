import React, { useState } from 'react';
import Button from '../../components/Button';
import InputField from '../../components/InputField';
import Layout from '../../components/Layout';
import { AuthUser } from '../../types/user';
import { registerUser } from '../../utils/auth';

interface RegisterScreenProps {
  onRegister: (user: AuthUser) => void;
  onSwitchToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onSwitchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    // Basic password strength check (for demo)
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const isRegistered = registerUser(email, password);
    if (isRegistered) {
      onRegister({ email });
    } else {
      setError('Este email já está registrado.');
    }
  };

  return (
    <Layout>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Crie sua conta</h1>
        <p className="text-gray-600 dark:text-gray-300">Comece sua jornada de bem-estar hoje!</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <InputField
          label="Email"
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
        />
        <InputField
          label="Senha"
          id="register-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Crie uma senha"
          required
        />
        <InputField
          label="Confirmar Senha"
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirme sua senha"
          required
        />
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <Button type="submit" className="w-full">
          Registrar
        </Button>
      </form>
      <p className="mt-6 text-center text-gray-600 dark:text-gray-300">
        Já tem uma conta?{' '}
        <button onClick={onSwitchToLogin} className="text-primary hover:underline font-semibold focus:outline-none">
          Fazer Login
        </button>
      </p>
    </Layout>
  );
};

export default RegisterScreen;