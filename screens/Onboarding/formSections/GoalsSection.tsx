import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import OnboardingInputField from '../components/OnboardingInputField';
import { GOAL_OPTIONS, ESTIMATED_DEADLINE_OPTIONS } from '../../../constants/formConstants';

interface GoalsSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string | number) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onUpdate(name as keyof UserProfile, type === 'number' ? parseFloat(value) || '' : value);
  };

  const getWeightUnit = () => {
    return data.unitType === 'kg/m' ? 'kg' : 'lbs';
  };

  return (
    <>
      <OnboardingRadioGroup
        label="Seu objetivo principal"
        name="goal"
        options={GOAL_OPTIONS}
        selectedValue={data.goal}
        onChange={(value) => onUpdate('goal', value)}
      />

      <OnboardingInputField
        label="Meta: Peso desejado"
        id="desiredWeight"
        name="desiredWeight"
        type="number"
        value={data.desiredWeight}
        onChange={handleInputChange}
        placeholder="Ex: 70"
        unit={getWeightUnit()}
      />

      <OnboardingRadioGroup
        label="Prazo estimado"
        name="estimatedDeadline"
        options={ESTIMATED_DEADLINE_OPTIONS}
        selectedValue={data.estimatedDeadline}
        onChange={(value) => onUpdate('estimatedDeadline', value)}
      />
    </>
  );
};

export default GoalsSection;