import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import FormInput from '../../components/FormInput';
import {
  DAILY_ACTIVITY_LEVEL_OPTIONS,
  PRACTICES_SPORTS_OPTIONS,
} from '../../constants';

interface ActivityRoutineSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string | number | string[]) => void;
}

const ActivityRoutineSection: React.FC<ActivityRoutineSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.name as keyof UserProfileData, e.target.value);
  };

  return (
    <>
      <RadioGroup
        label="Nível de atividade diária"
        name="dailyActivityLevel"
        options={DAILY_ACTIVITY_LEVEL_OPTIONS}
        selectedValue={data.dailyActivityLevel}
        onChange={(value) => onUpdate('dailyActivityLevel', value)}
      />

      <RadioGroup
        label="Pratica esportes?"
        name="practicesSports"
        options={PRACTICES_SPORTS_OPTIONS}
        selectedValue={data.practicesSports}
        onChange={(value) => onUpdate('practicesSports', value)}
      />

      {data.practicesSports === 'Sim' && (
        <FormInput
          label="Qual esporte?"
          id="sportName"
          name="sportName"
          type="text"
          value={data.sportName}
          onChange={handleInputChange}
          placeholder="Ex: Futebol, Natação, Musculação"
        />
      )}
    </>
  );
};

export default ActivityRoutineSection;