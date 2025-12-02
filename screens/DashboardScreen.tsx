import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import AddFoodModal from '../modals/AddFoodModal';
import { AuthUser, UserProfile } from '../types/user';
import { DailyLog, MealCategory, MealItem } from '../types/meal';
import { calculateDailyTotals, getTodayDateString } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import ProgressBar from '../components/ProgressBar';
import { Toast } from '../types';

interface DashboardScreenProps {
  currentUser: AuthUser;
  userProfile: UserProfile | null;
  dailyLogs: { [date: string]: DailyLog };
  setDailyLogs: React.Dispatch<React.SetStateAction<{ [date: string]: DailyLog }>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, userProfile, dailyLogs, setDailyLogs, showToast }) => {
  const today = getTodayDateString();
  const currentDailyLog = dailyLogs[today] || {
    date: today,
    meals: {
      'Café da manhã': [],
      'Almoço': [],
      'Jantar': [],
      'Lanche': [],
    },
    waterIntake: 0,
    caloriesConsumed: 0,
    proteinConsumed: 0,
    carbsConsumed: 0,
    fatConsumed: 0,
  };

  const { caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed } = calculateDailyTotals(currentDailyLog);

  useEffect(() => {
    // Update currentDailyLog's calculated totals
    setDailyLogs(prevLogs => ({
      ...prevLogs,
      [today]: {
        ...currentDailyLog,
        caloriesConsumed,
        proteinConsumed,
        carbsConsumed,
        fatConsumed,
      }
    }));
  }, [caloriesConsumed, proteinConsumed, carbsConsumed, fatConsumed]);


  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false);
  const [selectedMealCategory, setSelectedMealCategory] = useState<MealCategory | null>(null);
  const [showCoachMessage, setShowCoachMessage] = useState(false);

  // Coach Mode Logic (simplified: check if no food logged for 2 days)
  useEffect(() => {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    const twoDaysAgoStr = twoDaysAgo.toISOString().split('T')[0];

    const hasRecentLog = Object.keys(dailyLogs).some(date => date >= twoDaysAgoStr && date !== today && (dailyLogs[date].caloriesConsumed > 0 || dailyLogs[date].waterIntake > 0));
    const hasLogToday = currentDailyLog.caloriesConsumed > 0 || currentDailyLog.waterIntake > 0;

    if (!hasRecentLog && !hasLogToday && currentUser) {
      setShowCoachMessage(true);
    } else {
      setShowCoachMessage(false);
    }
  }, [dailyLogs, today, currentUser, currentDailyLog.caloriesConsumed, currentDailyLog.waterIntake]);


  const handleAddFoodClick = (category: MealCategory) => {
    setSelectedMealCategory(category);
    setIsAddFoodModalOpen(true);
  };

  const handleAddFood = (item: Omit<MealItem, 'id' | 'timestamp'>, category: MealCategory) => {
    const newItem: MealItem = { ...item, id: uuidv4(), timestamp: new Date().toISOString() };
    setDailyLogs(prevLogs => ({
      ...prevLogs,
      [today]: {
        ...prevLogs[today],
        meals: {
          ...prevLogs[today]?.meals,
          [category]: [...(prevLogs[today]?.meals[category] || []), newItem],
        },
      },
    }));
    setIsAddFoodModalOpen(false);
    showToast('Alimento adicionado!', 'success');
  };

  const handleDeleteFoodItem = (category: MealCategory, itemId: string) => {
    setDailyLogs(prevLogs => ({
      ...prevLogs,
      [today]: {
        ...prevLogs[today],
        meals: {
          ...prevLogs[today]?.meals,
          [category]: prevLogs[today]?.meals[category].filter(item => item.id !== itemId) || [],
        },
      },
    }));
    showToast('Item removido.', 'info');
  };

  const handleWaterChange = (amount: number) => {
    setDailyLogs(prevLogs => ({
      ...prevLogs,
      [today]: {
        ...prevLogs[today],
        waterIntake: Math.max(0, (prevLogs[today]?.waterIntake || 0) + amount),
      },
    }));
    showToast(amount > 0 ? `Água adicionada (+${amount}ml)` : `Água removida (${amount}ml)`, 'info');
  };

  if (!userProfile) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Carregando perfil ou perfil não configurado.</div>;
  }

  const mealCategories: MealCategory[] = ['Café da manhã', 'Almoço', 'Jantar', 'Lanche'];

  const calorieProgress = (caloriesConsumed / userProfile.caloriesGoal) * 100;
  const proteinProgress = (proteinConsumed / userProfile.proteinGoal) * 100;
  const carbProgress = (carbsConsumed / userProfile.carbGoal) * 100;
  const fatProgress = (fatConsumed / userProfile.fatGoal) * 100;
  const waterProgress = (currentDailyLog.waterIntake / userProfile.waterGoal) * 100;


  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, {userProfile.name}!</h2>

      {showCoachMessage && (
        <Card className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-100 border-l-4 border-blue-500 flex items-center justify-between">
          <div>
            <p className="font-bold">Modo Coach Ativado!</p>
            <p className="text-sm">Parece que você não tem registrado suas atividades ultimamente. Vamos retomar? Seu bem-estar é importante!</p>
          </div>
          <Button variant="secondary" onClick={() => setShowCoachMessage(false)} className="ml-4 whitespace-nowrap">
            Entendi
          </Button>
        </Card>
      )}

      <Card>
        <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-100">Metas Diárias</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Acompanhe seu progresso hoje.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ProgressBar progress={calorieProgress} label={`Calorias: ${caloriesConsumed}/${userProfile.caloriesGoal} kcal`} />
            <ProgressBar progress={proteinProgress} label={`Proteína: ${proteinConsumed}/${userProfile.proteinGoal}g`} />
            <ProgressBar progress={carbProgress} label={`Carboidratos: ${carbsConsumed}/${userProfile.carbGoal}g`} />
            <ProgressBar progress={fatProgress} label={`Gordura: ${fatConsumed}/${userProfile.fatGoal}g`} />
          </div>
          <div className="flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2">Hidratação</h4>
            <p className="text-3xl font-bold text-primary dark:text-white mb-3">{currentDailyLog.waterIntake} / {userProfile.waterGoal} ml</p>
            <div className="flex space-x-2">
              <Button variant="secondary" onClick={() => handleWaterChange(-250)} className="px-4 py-2 text-sm">
                -250ml
              </Button>
              <Button onClick={() => handleWaterChange(250)} className="px-4 py-2 text-sm">
                +250ml
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4">Suas Refeições</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealCategories.map(category => (
          <Card key={category}>
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold text-gray-800 dark:text-gray-100">{category}</h4>
              <Button variant="secondary" onClick={() => handleAddFoodClick(category)} className="px-4 py-2 text-sm">
                + Adicionar
              </Button>
            </div>
            {currentDailyLog.meals[category] && currentDailyLog.meals[category].length > 0 ? (
              <ul className="space-y-2">
                {currentDailyLog.meals[category].map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-600 p-2 rounded-md">
                    <span className="text-gray-700 dark:text-gray-200">{item.name} ({item.portion}g) - {item.calories}kcal</span>
                    <button onClick={() => handleDeleteFoodItem(category, item.id)} className="text-red-500 hover:text-red-700 dark:hover:text-red-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-sm">Nenhum alimento registrado para esta refeição.</p>
            )}
          </Card>
        ))}
      </div>

      <AddFoodModal
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
        onAddFood={handleAddFood}
        initialMealCategory={selectedMealCategory}
      />
    </div>
  );
};

export default DashboardScreen;