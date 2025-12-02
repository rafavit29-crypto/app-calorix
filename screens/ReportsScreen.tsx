import React from 'react';
import Card from '../components/Card';
import { DailyLog } from '../types/meal';
import { UserProfile } from '../types/user';

interface ReportsScreenProps {
  dailyLogs: { [date: string]: DailyLog };
  userProfile: UserProfile | null;
}

const ReportsScreen: React.FC<ReportsScreenProps> = ({ dailyLogs, userProfile }) => {
  const dates = Object.keys(dailyLogs).sort();
  const last7DaysDates = dates.slice(Math.max(dates.length - 7, 0));

  // Calculate averages for last 7 days
  let totalCalories = 0;
  let totalWater = 0;
  let loggedDays = 0;

  last7DaysDates.forEach(date => {
    const log = dailyLogs[date];
    if (log) {
      totalCalories += log.caloriesConsumed;
      totalWater += log.waterIntake;
      loggedDays++;
    }
  });

  const avgCalories = loggedDays > 0 ? (totalCalories / loggedDays).toFixed(0) : 'N/A';
  const avgWater = loggedDays > 0 ? (totalWater / loggedDays).toFixed(0) : 'N/A';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Seus Relatórios</h2>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Resumo Semanal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-gray-600 dark:text-gray-300">Calorias Médias (últimos 7 dias):</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{avgCalories} kcal</p>
            {userProfile && <p className="text-sm text-gray-500 dark:text-gray-400">Meta: {userProfile.caloriesGoal} kcal</p>}
          </div>
          <div>
            <p className="text-gray-600 dark:text-gray-300">Água Média (últimos 7 dias):</p>
            <p className="text-2xl font-bold text-primary dark:text-white">{avgWater} ml</p>
            {userProfile && <p className="text-sm text-gray-500 dark:text-gray-400">Meta: {userProfile.waterGoal} ml</p>}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Gráfico de Progresso (Exemplo)</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Aqui você veria gráficos detalhados do seu progresso de calorias, macros e hidratação ao longo do tempo.
        </p>
        <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-500">
          <p>Gráfico Placeholder (implementação futura)</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Histórico Diário</h3>
        {last7DaysDates.length > 0 ? (
          <ul className="space-y-2 text-gray-700 dark:text-gray-200">
            {last7DaysDates.map(date => (
              <li key={date} className="flex justify-between items-center bg-gray-50 dark:bg-gray-600 p-2 rounded-md">
                <span className="font-medium">{new Date(date).toLocaleDateString()}</span>
                <span>{dailyLogs[date]?.caloriesConsumed || 0} kcal | {dailyLogs[date]?.waterIntake || 0} ml</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Nenhum dado disponível para os últimos 7 dias.</p>
        )}
      </Card>
    </div>
  );
};

export default ReportsScreen;