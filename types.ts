export interface UserProfileData {
  // 1. Perfil do Usuário
  name: string;
  age: number | '';
  gender: 'Masculino' | 'Feminino' | 'Prefiro não informar' | '';
  weight: number | '';
  height: number | '';
  unitType: 'kg/m' | 'lbs/ft' | '';

  // 2. Rotina & Atividade Física
  dailyActivityLevel: 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito ativo' | '';
  practicesSports: 'Sim' | 'Não' | '';
  sportName: string;

  // 3. Objetivos
  goal: 'Perder peso' | 'Ganhar massa muscular' | 'Definir o corpo' | 'Melhorar condicionamento' | 'Manter o peso' | 'Reduzir medidas' | 'Estilo de vida saudável' | '';
  desiredWeight: number | '';
  estimatedDeadline: '30 dias' | '60 dias' | '90 dias' | 'Sem prazo' | '';

  // 4. Estado de Saúde (Opcional)
  healthIssues: string[];
  otherHealthIssue: string; // If 'Outro' is selected for health issues
  allergies: string[];
  otherAllergy: string; // If 'Outro' is selected for allergies

  // 5. Rotina Alimentar
  eatingStyle: 'Normal' | 'Vegetariano' | 'Vegano' | 'Low-carb' | 'Alta proteína' | 'Livre' | '';
  preferences: string[];
  waterConsumption: 'Pouco' | 'Médio' | 'Muito' | '';
  alcoholConsumption: 'Nunca' | 'Às vezes' | 'Frequentemente' | '';

  // 6. Hábitos de Sono
  sleepHours: '<5h' | '5–6h' | '6–7h' | '7–8h' | '>8h' | '';
  sleepQuality: 'Ruim' | 'Média' | 'Boa' | '';

  // 7. Dados Comportamentais
  disciplineLevel: 'Baixa' | 'Média' | 'Alta' | '';
  motivationType: string[];
  notificationPreference: 'Sim' | 'Não' | 'Só lembretes importantes' | '';

  // 8. Privacidade & Personalização
  allowLocalSaving: 'Sim' | 'Não' | '';
  wantAutomaticPersonalization: 'Sim' | 'Não' | '';
}

// Add Toast interface to this file to resolve import errors.
export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
}