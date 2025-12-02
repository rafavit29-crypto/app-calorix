// types/meal.ts
export interface MealItem {
    id: string; // Unique ID for each item
    name: string;
    portion: number; // e.g., grams
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    timestamp: string; // ISO string
    source?: 'manual' | 'ai' | 'recipe'; // Track origin
    imageUrl?: string; // Optional image of the food
}

export type MealCategory = 'Café da manhã' | 'Almoço' | 'Jantar' | 'Lanche';

export interface DailyLog {
    date: string; // YYYY-MM-DD
    meals: {
        'Café da manhã': MealItem[];
        'Almoço': MealItem[];
        'Jantar': MealItem[];
        'Lanche': MealItem[];
    };
    waterIntake: number; // in ml
    caloriesConsumed: number;
    proteinConsumed: number;
    carbsConsumed: number;
    fatConsumed: number;
    notifications?: {
        calorieToastShown?: boolean;
        waterToastShown?: boolean;
        // ... other notification flags
    }
}