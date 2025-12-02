// utils/calculations.ts
import { UserProfile } from '../types/user';
import { DailyLog, MealItem } from '../types/meal';

/**
 * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation.
 * @param age in years
 * @param gender 'Masculino' or 'Feminino'
 * @param weight in kg
 * @param height in cm
 * @returns BMR in calories
 */
const calculateBMR = (age: number, gender: UserProfile['gender'], weight: number, height: number): number => {
    if (gender === 'Masculino') {
        return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else { // Feminino or Prefiro não informar (defaulting to female for safety)
        return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
};

/**
 * Calculates Total Daily Energy Expenditure (TDEE).
 * @param bmr Basal Metabolic Rate
 * @param dailyActivityLevel User's daily activity level from onboarding
 * @returns TDEE in calories
 */
const calculateTDEE = (bmr: number, dailyActivityLevel: UserProfile['dailyActivityLevel']): number => {
    let activityFactor: number;
    switch (dailyActivityLevel) {
        case 'Sedentário':
            activityFactor = 1.2;
            break;
        case 'Leve':
            activityFactor = 1.375;
            break;
        case 'Moderado':
            activityFactor = 1.55;
            break;
        case 'Ativo':
            activityFactor = 1.725;
            break;
        case 'Muito ativo':
            activityFactor = 1.9;
            break;
        default: // If not informed, default to sedentary for safety
            activityFactor = 1.2;
    }
    return bmr * activityFactor;
};

/**
 * Calculates daily caloric, macronutrient, and water goals.
 * @param profileData The complete UserProfile data from the onboarding questionnaire.
 * @returns An object with calculated goals
 */
export const calculateGoals = (profileData: UserProfile): Pick<UserProfile, 'caloriesGoal' | 'proteinGoal' | 'carbGoal' | 'fatGoal' | 'waterGoal' | 'activityLevel' | 'goal'> => {
    const { age, gender, weight, height, dailyActivityLevel, goal } = profileData;

    // Ensure numeric values are valid
    const validAge = typeof age === 'number' && age > 0 ? age : 25;
    const validWeight = typeof weight === 'number' && weight > 0 ? weight : 70;
    const validHeight = typeof height === 'number' && height > 0 ? height : 170;


    const bmr = calculateBMR(validAge, gender, validWeight, validHeight);
    let tdee = calculateTDEE(bmr, dailyActivityLevel);

    // Map questionnaire goal to simplified Wellness Tracker goal for TDEE adjustment
    let simplifiedGoal: 'Perder peso' | 'Manter' | 'Ganhar massa';
    if (goal === 'Perder peso' || goal === 'Reduzir medidas') {
        simplifiedGoal = 'Perder peso';
    } else if (goal === 'Ganhar massa muscular') {
        simplifiedGoal = 'Ganhar massa';
    } else { // 'Manter o peso', 'Definir o corpo', 'Melhorar condicionamento', 'Estilo de vida saudável'
        simplifiedGoal = 'Manter';
    }

    // Adjust TDEE based on goal
    let caloriesGoal: number;
    if (simplifiedGoal === 'Perder peso') {
        caloriesGoal = tdee - 500; // Deficit for weight loss
    } else if (simplifiedGoal === 'Ganhar massa') {
        caloriesGoal = tdee + 300; // Surplus for muscle gain
    } else { // Manter
        caloriesGoal = tdee;
    }

    // Ensure calories don't drop too low (minimum 1200 for women, 1500 for men for safety)
    if (gender === 'Feminino' && caloriesGoal < 1200) caloriesGoal = 1200;
    if (gender === 'Masculino' && caloriesGoal < 1500) caloriesGoal = 1500;

    // Macronutrient distribution (example percentages)
    // Protein: 25-35% of calories (4 kcal/g)
    // Carbs: 40-50% of calories (4 kcal/g)
    // Fat: 20-30% of calories (9 kcal/g)
    const proteinGoal = (caloriesGoal * 0.30) / 4; // 30% protein
    const carbGoal = (caloriesGoal * 0.45) / 4;    // 45% carbs
    const fatGoal = (caloriesGoal * 0.25) / 9;     // 25% fat

    // Water goal: ~35ml per kg of body weight, min 2000ml (2L)
    const waterGoal = Math.max(validWeight * 35, 2000); // in ml

    return {
        caloriesGoal: Math.round(caloriesGoal),
        proteinGoal: Math.round(proteinGoal),
        carbGoal: Math.round(carbGoal),
        fatGoal: Math.round(fatGoal),
        waterGoal: Math.round(waterGoal),
        // Map dailyActivityLevel to activityLevel for compatibility with old UserProfile fields if still used
        activityLevel: dailyActivityLevel === '' ? 'Moderado' : dailyActivityLevel,
        goal: simplifiedGoal // Return the simplified goal for the main app
    };
};


/**
 * Calculates total nutrients for a given DailyLog.
 * @param dailyLog The DailyLog object.
 * @returns An object with total consumed calories, protein, carbs, fat.
 */
export const calculateDailyTotals = (dailyLog: DailyLog): {
    caloriesConsumed: number;
    proteinConsumed: number;
    carbsConsumed: number;
    fatConsumed: number;
} => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fat = 0;

    if (!dailyLog || !dailyLog.meals) {
        return { caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0 };
    }

    Object.values(dailyLog.meals).forEach(mealItems => {
        mealItems.forEach((item: MealItem) => {
            calories += item.calories;
            protein += item.protein;
            carbs += item.carbs;
            fat += item.fat;
        });
    });

    return {
        caloriesConsumed: calories,
        proteinConsumed: protein,
        carbsConsumed: carbs,
        fatConsumed: fat,
    };
};

export const getTodayDateString = (): string => {
    return new Date().toISOString().split('T')[0];
};