import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import FormInput from '../../components/FormInput';
import { GOAL_OPTIONS, ESTIMATED_DEADLINE_OPTIONS } from '../../constants';

interface GoalsSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string | number) => void;
}

const GoalsSection: React.FC<GoalsSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.name as keyof UserProfileData, e.target.value);
  };

  const getWeightUnit = () => {
    return data.unitType === 'kg/m' ? 'kg' : 'lbs';
  };

  return (
    <>
      <RadioGroup
        label="Seu objetivo principal"
        name="goal"
        options={GOAL_OPTIONS}
        selectedValue={data.goal}
        onChange={(value) => onUpdate('goal', value)}
      />

      <FormInput
        label="Meta: Peso desejado"
        id="desiredWeight"
        name="desiredWeight"
        type="number"
        value={data.desiredWeight}
        onChange={handleInputChange}
        placeholder="Ex: 70"
        unit={getWeightUnit()}
      />

      <RadioGroup
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