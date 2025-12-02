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
 * @param activityLevel User's activity level
 * @returns TDEE in calories
 */
const calculateTDEE = (bmr: number, activityLevel: UserProfile['activityLevel']): number => {
    let activityFactor: number;
    switch (activityLevel) {
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
        default:
            activityFactor = 1.2;
    }
    return bmr * activityFactor;
};

/**
 * Calculates daily caloric, macronutrient, and water goals.
 * @param age in years
 * @param gender User's gender
 * @param weight in kg
 * @param height in cm
 * @param activityLevel User's activity level
 * @param goal User's fitness goal
 * @returns An object with calculated goals
 */
export const calculateGoals = (
    age: number,
    gender: UserProfile['gender'],
    weight: number,
    height: number,
    activityLevel: UserProfile['activityLevel'],
    goal: UserProfile['goal'],
): Omit<UserProfile, 'name' | 'allergies' | 'unitType' | 'practicesSports'> => {
    const bmr = calculateBMR(age, gender, weight, height);
    let tdee = calculateTDEE(bmr, activityLevel);

    // Adjust TDEE based on goal
    let caloriesGoal: number;
    if (goal === 'Perder peso') {
        caloriesGoal = tdee - 500; // Deficit for weight loss
    } else if (goal === 'Ganhar massa') {
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
    const waterGoal = Math.max(weight * 35, 2000); // in ml

    return {
        age,
        gender,
        weight,
        height,
        activityLevel,
        goal,
        caloriesGoal: Math.round(caloriesGoal),
        proteinGoal: Math.round(proteinGoal),
        carbGoal: Math.round(carbGoal),
        fatGoal: Math.round(fatGoal),
        waterGoal: Math.round(waterGoal),
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
