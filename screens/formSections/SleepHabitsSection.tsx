import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import { SLEEP_HOURS_OPTIONS, SLEEP_QUALITY_OPTIONS } from '../../constants';

interface SleepHabitsSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string) => void;
}

const SleepHabitsSection: React.FC<SleepHabitsSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <RadioGroup
        label="Horas de sono por noite"
        name="sleepHours"
        options={SLEEP_HOURS_OPTIONS}
        selectedValue={data.sleepHours}
        onChange={(value) => onUpdate('sleepHours', value)}
      />

      <RadioGroup
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