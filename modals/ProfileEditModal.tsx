import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { UserProfile } from '../types/user';
import { calculateGoals } from '../utils/calculations';
import { GENDER_OPTIONS, DAILY_ACTIVITY_LEVEL_OPTIONS, GOAL_OPTIONS, YES_NO_OPTIONS, UNIT_TYPE_OPTIONS, ALLERGY_OPTIONS } from '../constants/formConstants';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfileData: UserProfile;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave, initialProfileData }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfileData);

  useEffect(() => {
    if (isOpen) {
      // Ensure initialProfileData has all necessary fields, providing defaults if not present
      const defaultValues: Partial<UserProfile> = {
        name: '', age: 0, gender: 'Não informado', weight: 0, height: 0, unitType: 'kg/m',
        dailyActivityLevel: 'Moderado', practicesSports: 'Não', sportName: '',
        goal: 'Manter', desiredWeight: '', estimatedDeadline: 'Sem prazo',
        healthIssues: [], otherHealthIssue: '', allergies: [], otherAllergy: '',
        eatingStyle: 'Normal', preferences: [], waterConsumption: 'Médio', alcoholConsumption: 'Nunca',
        sleepHours: '7–8h', sleepQuality: 'Boa',
        disciplineLevel: 'Média', motivationType: [], notificationPreference: 'Sim',
        allowLocalSaving: 'Sim', wantAutomaticPersonalization: 'Sim',
        caloriesGoal: 0, proteinGoal: 0, carbGoal: 0, fatGoal: 0, waterGoal: 0,
        onboardingComplete: false
      };
      setProfile({ ...defaultValues, ...initialProfileData });
    }
  }, [isOpen, initialProfileData]);

  const handleChange = (field: keyof UserProfile, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleAllergyChange = (allergy: string, isChecked: boolean) => {
    const newAllergies = isChecked
      ? [...profile.allergies, allergy]
      : profile.allergies.filter(a => a !== allergy);
    handleChange('allergies', newAllergies);
  };

  const handleSubmit = () => {
    // Basic validation
    if (!profile.name || (typeof profile.age === 'number' && profile.age <= 0) || (typeof profile.weight === 'number' && profile.weight <= 0) || (typeof profile.height === 'number' && profile.height <= 0)) {
      alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
      return;
    }

    onSave(profile);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Meu Perfil">
      <div className="space-y-4">
        <InputField label="Nome" id="name" value={profile.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Seu nome" />
        <InputField label="Idade" id="age" type="number" value={profile.age} onChange={(e) => handleChange('age', parseInt(e.target.value) || 0)} min="0" />
        
        {/* Gender Radio Group */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Sexo</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {GENDER_OPTIONS.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`gender-${option}`}
                  name="gender"
                  value={option}
                  checked={profile.gender === option}
                  onChange={() => handleChange('gender', option)}
                  className="form-radio h-4 w-4 text-primary transition-colors duration-200"
                />
                <label htmlFor={`gender-${option}`} className="ml-2 text-gray-700 dark:text-gray-200">{option}</label>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Type Radio */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Tipo de Unidade</label>
          <div className="flex gap-x-4">
            {UNIT_TYPE_OPTIONS.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`unit-${option}`}
                  name="unitType"
                  value={option}
                  checked={profile.unitType === option}
                  onChange={() => handleChange('unitType', option as UserProfile['unitType'])}
                  className="form-radio h-4 w-4 text-primary transition-colors duration-200"
                />
                <label htmlFor={`unit-${option}`} className="ml-2 text-gray-700 dark:text-gray-200">{option}</label>
              </div>
            ))}
          </div>
        </div>

        <InputField label={`Peso (${profile.unitType === 'kg/m' ? 'kg' : 'lbs'})`} id="weight" type="number" value={profile.weight} onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)} min="0" />
        <InputField label={`Altura (${profile.unitType === 'kg/m' ? 'cm' : 'ft'})`} id="height" type="number" value={profile.height} onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)} min="0" />
        
        {/* Activity Level Select */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Nível de Atividade Diária</label>
          <select
            className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200 text-gray-800 dark:text-white"
            value={profile.dailyActivityLevel}
            onChange={(e) => handleChange('dailyActivityLevel', e.target.value as UserProfile['dailyActivityLevel'])}
          >
            {DAILY_ACTIVITY_LEVEL_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* Practices Sports Radio */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Pratica esportes?</label>
          <div className="flex gap-x-4">
            {YES_NO_OPTIONS.map(option => (
              <div key={option} className="flex items-center">
                <input
                  type="radio"
                  id={`sports-${option}`}
                  name="practicesSports"
                  value={option}
                  checked={profile.practicesSports === option}
                  onChange={() => handleChange('practicesSports', option as UserProfile['practicesSports'])}
                  className="form-radio h-4 w-4 text-primary transition-colors duration-200"
                />
                <label htmlFor={`sports-${option}`} className="ml-2 text-gray-700 dark:text-gray-200">{option}</label>
              </div>
            ))}
          </div>
        </div>
        {profile.practicesSports === 'Sim' && (
          <InputField label="Qual esporte?" id="sportName" value={profile.sportName} onChange={(e) => handleChange('sportName', e.target.value)} placeholder="Ex: Futebol, Natação" />
        )}

        {/* Goal Select */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Objetivo</label>
          <select
            className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200 text-gray-800 dark:text-white"
            value={profile.goal}
            onChange={(e) => handleChange('goal', e.target.value as UserProfile['goal'])}
          >
            {GOAL_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <InputField label={`Peso Desejado (${profile.unitType === 'kg/m' ? 'kg' : 'lbs'})`} id="desiredWeight" type="number" value={profile.desiredWeight} onChange={(e) => handleChange('desiredWeight', parseFloat(e.target.value) || '')} min="0" />
        
        {/* Allergies (using CheckboxGroup logic for simplicity) */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Alergias</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {ALLERGY_OPTIONS.filter(opt => opt !== 'Nenhuma' && opt !== 'Outro').map(allergy => (
              <div key={allergy} className="flex items-center">
                <input
                  type="checkbox"
                  id={`allergy-${allergy}`}
                  checked={profile.allergies.includes(allergy)}
                  onChange={(e) => handleAllergyChange(allergy, e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded transition-colors duration-200"
                />
                <label htmlFor={`allergy-${allergy}`} className="ml-2 text-gray-700 dark:text-gray-200">{allergy}</label>
              </div>
            ))}
             <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allergy-none"
                  checked={profile.allergies.includes('Nenhuma')}
                  onChange={(e) => handleAllergyChange('Nenhuma', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded transition-colors duration-200"
                />
                <label htmlFor="allergy-none" className="ml-2 text-gray-700 dark:text-gray-200">Nenhuma</label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="allergy-other"
                  checked={profile.allergies.includes('Outro')}
                  onChange={(e) => handleAllergyChange('Outro', e.target.checked)}
                  className="form-checkbox h-4 w-4 text-primary rounded transition-colors duration-200"
                />
                <label htmlFor="allergy-other" className="ml-2 text-gray-700 dark:text-gray-200">Outro</label>
              </div>
          </div>
          {profile.allergies.includes('Outro') && (
            <InputField
              label="Especifique outra alergia"
              id="otherAllergy"
              value={profile.otherAllergy}
              onChange={(e) => handleChange('otherAllergy', e.target.value)}
              placeholder="Ex: Soja"
              className="mt-3"
            />
          )}
        </div>
        
        <Button onClick={handleSubmit} className="w-full mt-6">
          Salvar Perfil
        </Button>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;