import React from 'react';
import OnboardingLayout from './components/OnboardingLayout';
import Button from '../../components/Button'; // Use main app's Button
import { UserProfile } from '../../types/user';
import { FORM_SECTIONS } from '../../constants/formConstants';

interface OnboardingSummaryScreenProps {
  profileData: UserProfile;
  onEdit: () => void;
  onConfirm: () => void;
  isConfirmed: boolean;
}

const OnboardingSummaryScreen: React.FC<OnboardingSummaryScreenProps> = ({ profileData, onEdit, onConfirm, isConfirmed }) => {
  // Helper function to render a field value
  const renderValue = (value: string | number | string[] | boolean | undefined | null): string => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : 'Não informado';
    }
    if (typeof value === 'boolean') {
      return value ? 'Sim' : 'Não';
    }
    return value ? String(value) : 'Não informado';
  };

  return (
    <OnboardingLayout>
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Resumo do seu Perfil
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Por favor, revise as informações abaixo antes de confirmar.
        </p>
      </div>

      {isConfirmed && (
        <div
          role="alert"
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg relative mb-6 text-center transition-all duration-300 ease-in-out dark:bg-green-900 dark:border-green-600 dark:text-green-200"
        >
          <strong className="font-bold">Sucesso!</strong>
          <span className="block sm:inline ml-2">Perfil de saúde confirmado com sucesso!</span>
        </div>
      )}

      <div className="space-y-6 mb-8 text-left text-gray-700 dark:text-gray-200">
        {/* Section 1: Perfil do Usuário */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[0]}</h2>
          <p><strong>Nome:</strong> {renderValue(profileData.name)}</p>
          <p><strong>Idade:</strong> {renderValue(profileData.age)}</p>
          <p><strong>Sexo:</strong> {renderValue(profileData.gender)}</p>
          <p><strong>Peso atual:</strong> {renderValue(profileData.weight)} {profileData.unitType === 'kg/m' ? 'kg' : 'lbs'}</p>
          <p><strong>Altura:</strong> {renderValue(profileData.height)} {profileData.unitType === 'kg/m' ? 'cm' : 'ft'}</p>
          <p><strong>Tipo de unidade:</strong> {renderValue(profileData.unitType)}</p>
        </div>

        {/* Section 2: Rotina & Atividade Física */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[1]}</h2>
          <p><strong>Nível de atividade diária:</strong> {renderValue(profileData.dailyActivityLevel)}</p>
          <p><strong>Pratica esportes?:</strong> {renderValue(profileData.practicesSports)}</p>
          {profileData.practicesSports === 'Sim' && <p><strong>Qual esporte?:</strong> {renderValue(profileData.sportName)}</p>}
        </div>

        {/* Section 3: Objetivos */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[2]}</h2>
          <p><strong>Objetivo:</strong> {renderValue(profileData.goal)}</p>
          <p><strong>Peso desejado:</strong> {renderValue(profileData.desiredWeight)} {profileData.unitType === 'kg/m' ? 'kg' : 'lbs'}</p>
          <p><strong>Prazo estimado:</strong> {renderValue(profileData.estimatedDeadline)}</p>
        </div>

        {/* Section 4: Estado de Saúde */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[3]}</h2>
          <p><strong>Problemas de saúde:</strong> {renderValue(profileData.healthIssues)}</p>
          {profileData.healthIssues.includes('Outro') && <p><strong>Outro problema de saúde:</strong> {renderValue(profileData.otherHealthIssue)}</p>}
          <p><strong>Alergias:</strong> {renderValue(profileData.allergies)}</p>
          {profileData.allergies.includes('Outro') && <p><strong>Outra alergia:</strong> {renderValue(profileData.otherAllergy)}</p>}
        </div>

        {/* Section 5: Rotina Alimentar */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[4]}</h2>
          <p><strong>Estilo alimentar:</strong> {renderValue(profileData.eatingStyle)}</p>
          <p><strong>Preferências alimentares:</strong> {renderValue(profileData.preferences)}</p>
          <p><strong>Consumo de água:</strong> {renderValue(profileData.waterConsumption)}</p>
          <p><strong>Consumo de álcool:</strong> {renderValue(profileData.alcoholConsumption)}</p>
        </div>

        {/* Section 6: Hábitos de Sono */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[5]}</h2>
          <p><strong>Horas de sono:</strong> {renderValue(profileData.sleepHours)}</p>
          <p><strong>Qualidade do sono:</strong> {renderValue(profileData.sleepQuality)}</p>
        </div>

        {/* Section 7: Dados Comportamentais */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[6]}</h2>
          <p><strong>Nível de disciplina:</strong> {renderValue(profileData.disciplineLevel)}</p>
          <p><strong>Tipo de motivação:</strong> {renderValue(profileData.motivationType)}</p>
          <p><strong>Preferência por notificações:</strong> {renderValue(profileData.notificationPreference)}</p>
        </div>

        {/* Section 8: Privacidade & Personalização */}
        <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-emerald-700 dark:text-emerald-400 mb-4">{FORM_SECTIONS[7]}</h2>
          <p><strong>Permitir salvar dados localmente?:</strong> {renderValue(profileData.allowLocalSaving)}</p>
          <p><strong>Deseja personalização automática?:</strong> {renderValue(profileData.wantAutomaticPersonalization)}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
        <Button variant="secondary" onClick={onEdit}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14.25v4.5m-6.75-9H7.5" />
          </svg>
          Editar
        </Button>
        <Button onClick={onConfirm}>
          Confirmar Perfil
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingSummaryScreen;