import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { UserProfile } from '../types/user';
import { calculateGoals } from '../utils/calculations';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (profile: UserProfile) => void;
  initialProfileData: UserProfile;
}

const GENDER_OPTIONS = ['Masculino', 'Feminino', 'Prefiro não informar', 'Não informado'];
const ACTIVITY_LEVEL_OPTIONS = ['Sedentário', 'Leve', 'Moderado', 'Ativo', 'Muito ativo'];
const GOAL_OPTIONS = ['Perder peso', 'Manter', 'Ganhar massa'];
const YES_NO_OPTIONS = ['Sim', 'Não'];
const UNIT_TYPE_OPTIONS = ['kg/m', 'lbs/ft'];


const ProfileEditModal: React.FC<ProfileEditModalProps> = ({ isOpen, onClose, onSave, initialProfileData }) => {
  const [profile, setProfile] = useState<UserProfile>(initialProfileData);

  useEffect(() => {
    if (isOpen) {
      setProfile(initialProfileData);
    }
  }, [isOpen, initialProfileData]);

  const handleChange = (field: keyof UserProfile, value: string | number | string[]) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!profile.name || profile.age <= 0 || profile.weight <= 0 || profile.height <= 0) {
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

        <InputField label="Peso (kg)" id="weight" type="number" value={profile.weight} onChange={(e) => handleChange('weight', parseFloat(e.target.value) || 0)} min="0" />
        <InputField label="Altura (cm)" id="height" type="number" value={profile.height} onChange={(e) => handleChange('height', parseFloat(e.target.value) || 0)} min="0" />
        
        {/* Activity Level Select */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Nível de Atividade</label>
          <select
            className="block w-full px-4 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-lg shadow-sm focus:ring-primary focus:border-primary sm:text-sm transition-colors duration-200 text-gray-800 dark:text-white"
            value={profile.activityLevel}
            onChange={(e) => handleChange('activityLevel', e.target.value as UserProfile['activityLevel'])}
          >
            {ACTIVITY_LEVEL_OPTIONS.map(option => (
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
        
        {/* Allergies (simplified checkbox group for demo) */}
        <div>
          <label className="block text-gray-700 dark:text-gray-300 text-sm font-semibold mb-2">Alergias (seleção múltipla)</label>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {['Lactose', 'Glúten', 'Amendoim', 'Ovos', 'Frutos do mar'].map(allergy => (
              <div key={allergy} className="flex items-center">
                <input
                  type="checkbox"
                  id={`allergy-${allergy}`}
                  checked={profile.allergies.includes(allergy)}
                  onChange={(e) => {
                    const newAllergies = e.target.checked
                      ? [...profile.allergies, allergy]
                      : profile.allergies.filter(a => a !== allergy);
                    handleChange('allergies', newAllergies);
                  }}
                  className="form-checkbox h-4 w-4 text-primary rounded transition-colors duration-200"
                />
                <label htmlFor={`allergy-${allergy}`} className="ml-2 text-gray-700 dark:text-gray-200">{allergy}</label>
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
        
        <Button onClick={handleSubmit} className="w-full mt-6">
          Salvar Perfil
        </Button>
      </div>
    </Modal>
  );
};

export default ProfileEditModal;