import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import { SLEEP_HOURS_OPTIONS, SLEEP_QUALITY_OPTIONS } from '../../../constants/formConstants';

interface SleepHabitsSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string) => void;
}

const SleepHabitsSection: React.FC<SleepHabitsSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <OnboardingRadioGroup
        label="Horas de sono por noite"
        name="sleepHours"
        options={SLEEP_HOURS_OPTIONS}
        selectedValue={data.sleepHours}
        onChange={(value) => onUpdate('sleepHours', value)}
      />

      <OnboardingRadioGroup
        label="Qualidade do sono"
        name="sleepQuality"
        options={SLEEP_QUALITY_OPTIONS}
        selectedValue={data.sleepQuality}
        onChange={(value) => onUpdate('sleepQuality', value)}
      />
    </>
  );
};

export default SleepHabitsSection;