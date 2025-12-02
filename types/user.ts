
// types/user.ts
export interface UserProfile {
    // Core Profile (from original Wellness Tracker)
    name: string;
    avatar?: string; // Base64 string for profile picture
    age: number;
    gender: 'Masculino' | 'Feminino' | 'Prefiro não informar' | 'Não informado';
    weight: number; // in kg
    height: number; // in cm
    activityLevel: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito ativo'; // Will map from dailyActivityLevel if needed, or deprecate this one.
    practicesSports: 'Sim' | 'Não';
    goal: 'Perder peso' | 'Manter' | 'Ganhar massa' | 'Ganhar massa muscular' | 'Definir o corpo' | 'Melhorar condicionamento' | 'Reduzir medidas' | 'Estilo de vida saudável'; // Expanded from questionnaire
    allergies: string[]; // From questionnaire, now also core
    unitType: 'kg/m' | 'lbs/ft'; // Unit preference

    // Additional fields from Questionnaire (full detail)
    dailyActivityLevel: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito ativo' | '';
    sportName: string;
    desiredWeight: number | '';
    estimatedDeadline: '30 dias' | '60 dias' | '90 dias' | 'Sem prazo' | '';
    healthIssues: string[];
    otherHealthIssue: string;
    otherAllergy: string;
    eatingStyle: 'Normal' | 'Vegetariano' | 'Vegano' | 'Low-carb' | 'Alta proteína' | 'Livre' | '';
    preferences: string[];
    waterConsumption: 'Pouco' | 'Médio' | 'Muito' | '';
    alcoholConsumption: 'Nunca' | 'Às vezes' | 'Frequentemente' | '';
    sleepHours: '<5h' | '5–6h' | '6–7h' | '7–8h' | '>8h' | '';
    sleepQuality: 'Ruim' | 'Média' | 'Boa' | '';
    disciplineLevel: 'Baixa' | 'Média' | 'Alta' | '';
    motivationType: string[];
    notificationPreference: 'Sim' | 'Não' | 'Só lembretes importantes' | '';
    allowLocalSaving: 'Sim' | 'Não' | '';
    wantAutomaticPersonalization: 'Sim' | 'Não' | '';

    // Calculated goals (from original Wellness Tracker)
    caloriesGoal: number;
    proteinGoal: number;
    carbGoal: number;
    fatGoal: number;
    waterGoal: number;

    // Onboarding status
    onboardingComplete: boolean;
}

export interface AuthUser {
    email: string;
    // Potentially other auth tokens or user IDs
}
