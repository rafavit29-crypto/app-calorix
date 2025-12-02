// types/recipe.ts
import { MealItem } from './meal';

export interface Recipe {
    id: string;
    name: string;
    description: string;
    ingredients: string[]; // List of ingredients (e.g., "2 ovos", "100g de frango")
    preparation: string[]; // Steps of preparation
    nutritionalInfo: { // Per serving
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
    };
    imageUrl?: string;
    mealItems: Omit<MealItem, 'id' | 'timestamp'>[]; // Items to add to meal log
}
