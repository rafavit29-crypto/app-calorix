import React from 'react';

interface DailyProgressChartProps {
  caloriesConsumed: number;
  caloriesGoal: number;
  proteinConsumed: number;
  proteinGoal: number;
  carbsConsumed: number;
  carbGoal: number;
  fatConsumed: number;
  fatGoal: number;
}

const DailyProgressChart: React.FC<DailyProgressChartProps> = ({
  caloriesConsumed,
  caloriesGoal,
  proteinConsumed,
  proteinGoal,
  carbsConsumed,
  carbGoal,
  fatConsumed,
  fatGoal,
}) => {
  // Helper to calculate percentage limited to 0-100
  const getPercentage = (consumed: number, goal: number) => {
    if (goal <= 0) return 0;
    return Math.min(100, Math.max(0, (consumed / goal) * 100));
  };

  const caloriePercentage = getPercentage(caloriesConsumed, caloriesGoal);

  // SVG Configuration
  const radius = 70;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (caloriePercentage / 100) * circumference;

  // Macro bar component
  const MacroBar = ({ 
    label, 
    consumed, 
    goal, 
    colorClass, 
    bgClass 
  }: { 
    label: string; 
    consumed: number; 
    goal: number; 
    colorClass: string; 
    bgClass: string;
  }) => {
    const pct = getPercentage(consumed, goal);
    return (
      <div className="mb-3 last:mb-0">
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium text-gray-600 dark:text-gray-300">{label}</span>
          <span className="text-gray-500 dark:text-gray-400">{consumed} / {goal}g</span>
        </div>
        <div className={`w-full h-2 rounded-full ${bgClass}`}>
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${colorClass}`}
            style={{ width: `${pct}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-8 py-2">
      {/* Circular Calorie Chart */}
      <div className="relative flex flex-col items-center justify-center">
        <svg
          height={radius * 2}
          width={radius * 2}
          className="transform -rotate-90"
        >
          {/* Background Circle */}
          <circle
            stroke="currentColor"
            className="text-gray-100 dark:text-gray-700"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress Circle */}
          <circle
            stroke="currentColor"
            className="text-primary transition-all duration-1000 ease-out"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            style={{ strokeDashoffset }}
            strokeLinecap="round"
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-bold text-gray-800 dark:text-white">
            {caloriesConsumed}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            de {caloriesGoal} kcal
          </span>
        </div>
      </div>

      {/* Macros List */}
      <div className="w-full sm:w-1/2 flex flex-col justify-center">
        <MacroBar 
          label="Proteínas" 
          consumed={proteinConsumed} 
          goal={proteinGoal} 
          colorClass="bg-blue-500" 
          bgClass="bg-blue-100 dark:bg-blue-900/30"
        />
        <MacroBar 
          label="Carboidratos" 
          consumed={carbsConsumed} 
          goal={carbGoal} 
          colorClass="bg-amber-400" 
          bgClass="bg-amber-100 dark:bg-amber-900/30"
        />
        <MacroBar 
          label="Gorduras" 
          consumed={fatConsumed} 
          goal={fatGoal} 
          colorClass="bg-rose-400" 
          bgClass="bg-rose-100 dark:bg-rose-900/30"
        />
      </div>
    </div>
  );
};

export default DailyProgressChart;
