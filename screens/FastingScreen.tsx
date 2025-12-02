/// <reference types="node" /> // Fixes Cannot find namespace 'NodeJS' for `NodeJS.Timeout`
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import { FastingState } from '../types/fasting';
import { AuthUser } from '../types/user';
import { Toast } from '../types';

interface FastingScreenProps {
  currentUser: AuthUser;
  fastingState: FastingState | null;
  setFastingState: React.Dispatch<React.SetStateAction<FastingState | null>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const FastingScreen: React.FC<FastingScreenProps> = ({ currentUser, fastingState, setFastingState, showToast }) => {
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [durationInput, setDurationInput] = useState(16); // Default 16 hours
  const [timeRemaining, setTimeRemaining] = useState(0); // in seconds
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const calculateTimeRemaining = useCallback(() => {
    if (fastingState?.isActive && fastingState.endTime) {
      const endTime = new Date(fastingState.endTime).getTime();
      const now = new Date().getTime();
      const remaining = Math.max(0, endTime - now);
      setTimeRemaining(Math.floor(remaining / 1000));

      if (remaining <= 0 && !fastingState.completionNotified) {
        showToast(`Parabéns! Seu jejum de ${fastingState.durationHours}h foi concluído! 🎉`, 'success');
        setFastingState(prev => prev ? { ...prev, isActive: false, completionNotified: true } : null);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    } else {
      setTimeRemaining(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [fastingState, setFastingState, showToast]);

  useEffect(() => {
    calculateTimeRemaining(); // Initial calculation

    if (fastingState?.isActive && fastingState.endTime) {
      intervalRef.current = setInterval(calculateTimeRemaining, 1000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [fastingState, calculateTimeRemaining]);

  const startFasting = () => {
    if (durationInput <= 0) {
      showToast('A duração do jejum deve ser maior que 0 horas.', 'error');
      return;
    }

    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationInput * 60 * 60 * 1000); // duration in milliseconds

    setFastingState({
      isActive: true,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      durationHours: durationInput,
      completionNotified: false,
    });
    setIsStartModalOpen(false);
    showToast(`Jejum de ${durationInput}h iniciado!`, 'info');
  };

  const cancelFasting = () => {
    setFastingState(null);
    showToast('Jejum cancelado.', 'info');
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isFastingActive = fastingState?.isActive && timeRemaining > 0;

  return (
    <div className="space-y-6 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Jejum Intermitente</h2>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Status do Jejum</h3>
        {isFastingActive ? (
          <div>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-2">Jejum de {fastingState?.durationHours} horas ativo!</p>
            <p className="text-5xl font-extrabold text-primary dark:text-white mb-4">
              {formatTime(timeRemaining)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Início: {new Date(fastingState?.startTime || '').toLocaleTimeString()} ({new Date(fastingState?.startTime || '').toLocaleDateString()})</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Fim estimado: {new Date(fastingState?.endTime || '').toLocaleTimeString()} ({new Date(fastingState?.endTime || '').toLocaleDateString()})</p>
            <Button variant="danger" onClick={cancelFasting} className="w-full md:w-auto">
              Cancelar Jejum
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">Nenhum jejum ativo no momento.</p>
            <Button onClick={() => setIsStartModalOpen(true)} className="w-full md:w-auto">
              Iniciar Novo Jejum
            </Button>
            {fastingState?.completionNotified && (
              <p className="mt-4 text-green-600 dark:text-green-400 font-medium">Jejum anterior concluído!</p>
            )}
          </div>
        )}
      </Card>

      <Modal isOpen={isStartModalOpen} onClose={() => setIsStartModalOpen(false)} title="Iniciar Jejum">
        <p className="text-gray-700 dark:text-gray-200 mb-4">Selecione a duração do seu jejum em horas:</p>
        <InputField
          label="Duração (horas)"
          id="fastingDuration"
          type="number"
          value={durationInput}
          onChange={(e) => setDurationInput(parseInt(e.target.value) || 0)}
          min="1"
          max="24"
          className="mb-6"
        />
        <Button onClick={startFasting} className="w-full">
          Confirmar
        </Button>
      </Modal>
    </div>
  );
};

export default FastingScreen;