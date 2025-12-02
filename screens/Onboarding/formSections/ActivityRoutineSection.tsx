import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import OnboardingInputField from '../components/OnboardingInputField';
import {
  DAILY_ACTIVITY_LEVEL_OPTIONS,
  PRACTICES_SPORTS_OPTIONS,
} from '../../../constants/formConstants';

interface ActivityRoutineSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string | number | string[]) => void;
}

const ActivityRoutineSection: React.FC<ActivityRoutineSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate(e.target.name as keyof UserProfile, e.target.value);
  };

  return (
    <>
      <OnboardingRadioGroup
        label="Nível de atividade diária"
        name="dailyActivityLevel"
        options={DAILY_ACTIVITY_LEVEL_OPTIONS}
        selectedValue={data.dailyActivityLevel}
        onChange={(value) => onUpdate('dailyActivityLevel', value)}
      />

      <OnboardingRadioGroup
        label="Pratica esportes?"
        name="practicesSports"
        options={PRACTICES_SPORTS_OPTIONS}
        selectedValue={data.practicesSports}
        onChange={(value) => onUpdate('practicesSports', value)}
      />

      {data.practicesSports === 'Sim' && (
        <OnboardingInputField
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