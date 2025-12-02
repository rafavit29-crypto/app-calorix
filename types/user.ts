// types/user.ts
export interface UserProfile {
    name: string;
    age: number;
    gender: 'Masculino' | 'Feminino' | 'Prefiro não informar' | 'Não informado';
    weight: number; // in kg
    height: number; // in cm
    activityLevel: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito ativo';
    practicesSports: 'Sim' | 'Não';
    goal: 'Perder peso' | 'Manter' | 'Ganhar massa';
    allergies: string[];
    unitType: 'kg/m' | 'lbs/ft'; // Unit preference

    // Calculated goals
    caloriesGoal: number;
    proteinGoal: number; // in grams
    carbGoal: number;    // in grams
    fatGoal: number;     // in grams
    waterGoal: number;   // in ml
}

export interface AuthUser {
    email: string;
    // Potentially other auth tokens or user IDs
}
