
import React, { useState, useEffect, useCallback } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import AddFoodModal from '../modals/AddFoodModal';
import AIFoodScannerModal from '../modals/AIFoodScannerModal';
import { AuthUser, UserProfile } from '../types/user';
import { DailyLog, MealCategory, MealItem } from '../types/meal';
import { calculateDailyTotals, getTodayDateString } from '../utils/calculations';
import { v4 as uuidv4 } from 'uuid';
import DailyProgressChart from '../components/DailyProgressChart';
import { Toast } from '../types';

interface DashboardScreenProps {
  currentUser: AuthUser;
  userProfile: UserProfile | null;
  dailyLogs: { [date: string]: DailyLog };
  setDailyLogs: React.Dispatch<React.SetStateAction<{ [date: string]: DailyLog }>>;
  showToast: (message: string, type: Toast['type']) => void;
  onChangeView?: (view: any) => void;
}

const DashboardScreen: React.FC<DashboardScreenProps> = ({ currentUser, userProfile, dailyLogs, setDailyLogs, showToast, onChangeView }) => {
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
  const [isAIScannerOpen, setIsAIScannerOpen] = useState(false);
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
    const newItem: MealItem = { 
      ...item, 
      id: uuidv4(), 
      timestamp: new Date().toISOString(),
      source: item.source || 'manual' 
    };
    
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
    
    if (isAddFoodModalOpen) setIsAddFoodModalOpen(false);
    if (isAIScannerOpen) setIsAIScannerOpen(false);
    
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Olá, {userProfile.name}!</h2>
        <div className="flex gap-2">
          {onChangeView && (
            <Button 
              onClick={() => onChangeView('barcode')}
              className="flex items-center space-x-2 bg-gray-800 text-white border-none shadow-md transform hover:scale-105 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M9 17h.01M5 17h.01M3 13h2m0 0v-3m0 0h.01M3 17h.01M21 17h.01M21 13h-2m0 0v-3m0 0h.01M9 4v1m-6 0h2m-2 0v4m20-4h-2m2 0v4m-6-8h-2m-8 0H9" />
              </svg>
              <span className="hidden sm:inline">Código de Barras</span>
            </Button>
          )}
          <Button 
            onClick={() => setIsAIScannerOpen(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-indigo-500 to-purple-600 border-none shadow-lg transform hover:scale-105 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Scanner IA</span>
          </Button>
        </div>
      </div>

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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Resumo do Dia</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Acompanhe suas metas nutricionais.</p>
          </div>
          <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-600 px-3 py-1 rounded-full">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart Section */}
          <div>
            <DailyProgressChart 
              caloriesConsumed={Math.round(caloriesConsumed)}
              caloriesGoal={userProfile.caloriesGoal}
              proteinConsumed={Math.round(proteinConsumed)}
              proteinGoal={userProfile.proteinGoal}
              carbsConsumed={Math.round(carbsConsumed)}
              carbGoal={userProfile.carbGoal}
              fatConsumed={Math.round(fatConsumed)}
              fatGoal={userProfile.fatGoal}
            />
          </div>

          {/* Water Section */}
          <div className="flex flex-col items-center justify-center bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800/50">
            <h4 className="font-semibold text-gray-700 dark:text-gray-200 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd"></path>
              </svg>
              Hidratação
            </h4>
            <div className="relative mb-4">
               {/* Simple visual water representation */}
               <div className="w-24 h-24 rounded-full border-4 border-blue-200 dark:border-blue-800 flex items-center justify-center bg-white dark:bg-gray-800 relative overflow-hidden">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-500 ease-in-out opacity-50"
                    style={{ height: `${Math.min(100, (currentDailyLog.waterIntake / userProfile.waterGoal) * 100)}%` }}
                  ></div>
                  <span className="relative z-10 text-xl font-bold text-blue-600 dark:text-blue-300">
                    {Math.round((currentDailyLog.waterIntake / userProfile.waterGoal) * 100)}%
                  </span>
               </div>
            </div>
            <p className="text-xl font-bold text-gray-800 dark:text-white mb-4">
              {currentDailyLog.waterIntake} <span className="text-sm font-normal text-gray-500">/ {userProfile.waterGoal} ml</span>
            </p>
            <div className="flex space-x-3">
              <button 
                onClick={() => handleWaterChange(-250)} 
                className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 flex items-center justify-center text-lg font-bold"
              >
                -
              </button>
              <Button onClick={() => handleWaterChange(250)} className="px-4 py-2 text-sm shadow-md">
                + Beber 250ml
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
              <h4 className="font-semibold text-gray-800 dark:text-gray-100 flex items-center">
                <span className={`w-2 h-2 rounded-full mr-2 ${
                  category === 'Café da manhã' ? 'bg-orange-400' : 
                  category === 'Almoço' ? 'bg-yellow-400' :
                  category === 'Jantar' ? 'bg-indigo-400' : 'bg-green-400'
                }`}></span>
                {category}
              </h4>
              <Button variant="secondary" onClick={() => handleAddFoodClick(category)} className="px-3 py-1 text-xs">
                + Adicionar
              </Button>
            </div>
            {currentDailyLog.meals[category] && currentDailyLog.meals[category].length > 0 ? (
              <ul className="space-y-2">
                {currentDailyLog.meals[category].map(item => (
                  <li key={item.id} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-600 p-3 rounded-lg border border-gray-100 dark:border-gray-500">
                    <div className="flex items-center">
                      {item.imageUrl && (
                        <div className="w-10 h-10 rounded-md overflow-hidden mr-3 flex-shrink-0">
                          <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.name} 
                          {item.source === 'ai' && <span className="ml-2 text-xs text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-900/30 px-1 rounded">IA</span>}
                          {item.source === 'manual' && <span className="ml-2 text-xs text-gray-500 font-bold bg-gray-100 dark:bg-gray-700 px-1 rounded">Manual</span>}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-300">{item.portion}g • {item.calories} kcal</p>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteFoodItem(category, item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-6 text-center border-2 border-dashed border-gray-100 dark:border-gray-600 rounded-lg">
                <p className="text-gray-400 dark:text-gray-500 text-sm">Nenhum registro</p>
              </div>
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
      
      <AIFoodScannerModal
        isOpen={isAIScannerOpen}
        onClose={() => setIsAIScannerOpen(false)}
        onSave={handleAddFood}
      />
    </div>
  );
};

export default DashboardScreen;
