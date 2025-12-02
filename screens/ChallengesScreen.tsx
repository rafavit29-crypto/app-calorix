import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import ProgressBar from '../components/ProgressBar';
import { Challenge } from '../types/challenge';
import { AuthUser } from '../types/user';
import { Toast } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { getTodayDateString } from '../utils/calculations';

interface ChallengesScreenProps {
  currentUser: AuthUser;
  challenges: Challenge[];
  setChallenges: React.Dispatch<React.SetStateAction<Challenge[]>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const ChallengesScreen: React.FC<ChallengesScreenProps> = ({ currentUser, challenges, setChallenges, showToast }) => {
  const [isAddChallengeModalOpen, setIsAddChallengeModalOpen] = useState(false);
  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeDescription, setNewChallengeDescription] = useState('');
  const [newChallengeDays, setNewChallengeDays] = useState(7);

  const handleAddChallenge = () => {
    if (newChallengeName.trim() === '' || newChallengeDays <= 0) {
      showToast('Preencha nome e dias válidos.', 'error');
      return;
    }

    const newChallenge: Challenge = {
      id: uuidv4(),
      name: newChallengeName,
      description: newChallengeDescription,
      targetDays: newChallengeDays,
      progress: [],
      isCompleted: false,
      medalEarned: false,
      type: 'custom',
    };

    setChallenges(prev => [...prev, newChallenge]);
    showToast('Desafio adicionado com sucesso!', 'success');
    setIsAddChallengeModalOpen(false);
    setNewChallengeName('');
    setNewChallengeDescription('');
    setNewChallengeDays(7);
  };

  const handleMarkDayCompleted = (challengeId: string) => {
    setChallenges(prev =>
      prev.map(challenge => {
        if (challenge.id === challengeId) {
          const today = getTodayDateString();
          const hasCompletedToday = challenge.progress.some(p => p.date === today && p.completed);

          if (hasCompletedToday) {
            showToast('Você já marcou este desafio como completo hoje!', 'info');
            return challenge;
          }

          const updatedProgress = [...challenge.progress, { date: today, completed: true }];
          const completedCount = updatedProgress.filter(p => p.completed).length;
          const isCompleted = completedCount >= challenge.targetDays;

          if (isCompleted && !challenge.isCompleted) {
            showToast(`Desafio "${challenge.name}" concluído! 🎉`, 'success');
          }

          return {
            ...challenge,
            progress: updatedProgress,
            isCompleted: isCompleted,
            completedDate: isCompleted ? today : challenge.completedDate,
            medalEarned: isCompleted ? true : challenge.medalEarned, // Mark medal earned on completion
          };
        }
        return challenge;
      })
    );
  };

  const getChallengeProgress = (challenge: Challenge) => {
    const completedDays = challenge.progress.filter(p => p.completed).length;
    return (completedDays / challenge.targetDays) * 100;
  };

  const MOCK_STANDARD_CHALLENGES: Challenge[] = [
    {
      id: 'std1',
      name: 'Desafio da Hidratação',
      description: 'Beba 2 litros de água todos os dias por 7 dias.',
      targetDays: 7,
      progress: [], // Will be merged with user's progress if existing
      isCompleted: false,
      medalEarned: false,
      type: 'standard',
    },
    {
      id: 'std2',
      name: 'Sem Açúcar por 5 Dias',
      description: 'Evite consumir qualquer tipo de açúcar adicionado por 5 dias.',
      targetDays: 5,
      progress: [],
      isCompleted: false,
      medalEarned: false,
      type: 'standard',
    },
  ];

  // Merge standard challenges with user's saved challenges, preferring user's progress
  const allChallenges = MOCK_STANDARD_CHALLENGES.map(stdChallenge => {
    const userChallenge = challenges.find(c => c.id === stdChallenge.id);
    return userChallenge ? { ...stdChallenge, ...userChallenge } : stdChallenge;
  }).concat(challenges.filter(c => c.type === 'custom'));


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Meus Desafios</h2>

      <Button onClick={() => setIsAddChallengeModalOpen(true)} className="w-full md:w-auto">
        + Adicionar Novo Desafio
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {allChallenges.length > 0 ? (
          allChallenges.map(challenge => (
            <Card key={challenge.id} className="p-4 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{challenge.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{challenge.description}</p>
                <ProgressBar progress={getChallengeProgress(challenge)} label={`Progresso: ${challenge.progress.filter(p => p.completed).length}/${challenge.targetDays} dias`} />
              </div>
              <div className="mt-4 flex justify-between items-center">
                {!challenge.isCompleted ? (
                  <Button onClick={() => handleMarkDayCompleted(challenge.id)} className="px-4 py-2 text-sm" disabled={challenge.isCompleted}>
                    Marcar Dia Concluído
                  </Button>
                ) : (
                  <span className="text-green-600 dark:text-green-400 font-semibold flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                    Concluído!
                  </span>
                )}
                {challenge.medalEarned && (
                  <span className="text-yellow-500 dark:text-yellow-400 text-2xl" role="img" aria-label="medal">
                    🏅
                  </span>
                )}
              </div>
            </Card>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">Nenhum desafio ativo. Adicione um para começar!</p>
        )}
      </div>

      <Modal isOpen={isAddChallengeModalOpen} onClose={() => setIsAddChallengeModalOpen(false)} title="Adicionar Novo Desafio">
        <InputField
          label="Nome do Desafio"
          id="newChallengeName"
          value={newChallengeName}
          onChange={(e) => setNewChallengeName(e.target.value)}
          placeholder="Ex: Beber 2L de água"
          className="mb-4"
        />
        <InputField
          label="Descrição"
          id="newChallengeDescription"
          value={newChallengeDescription}
          onChange={(e) => setNewChallengeDescription(e.target.value)}
          placeholder="Descrição detalhada do desafio"
          className="mb-4"
        />
        <InputField
          label="Dias para Concluir"
          id="newChallengeDays"
          type="number"
          value={newChallengeDays}
          onChange={(e) => setNewChallengeDays(parseInt(e.target.value) || 0)}
          min="1"
          className="mb-6"
        />
        <Button onClick={handleAddChallenge} className="w-full">
          Criar Desafio
        </Button>
      </Modal>
    </div>
  );
};

export default ChallengesScreen;