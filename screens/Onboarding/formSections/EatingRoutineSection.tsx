import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import OnboardingCheckboxGroup from '../components/OnboardingCheckboxGroup';
import {
  EATING_STYLE_OPTIONS,
  PREFERENCE_OPTIONS,
  WATER_CONSUMPTION_OPTIONS,
  ALCOHOL_CONSUMPTION_OPTIONS,
} from '../../../constants/formConstants';

interface EatingRoutineSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string | string[]) => void;
}

const EatingRoutineSection: React.FC<EatingRoutineSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <OnboardingRadioGroup
        label="Estilo alimentar"
        name="eatingStyle"
        options={EATING_STYLE_OPTIONS}
        selectedValue={data.eatingStyle}
        onChange={(value) => onUpdate('eatingStyle', value)}
      />

      <OnboardingCheckboxGroup
        label="Preferências"
        options={PREFERENCE_OPTIONS}
        selectedValues={data.preferences}
        onChange={(values) => onUpdate('preferences', values)}
      />

      <OnboardingRadioGroup
        label="Consumo de água"
        name="waterConsumption"
        options={WATER_CONSUMPTION_OPTIONS}
        selectedValue={data.waterConsumption}
        onChange={(value) => onUpdate('waterConsumption', value)}
      />

      <OnboardingRadioGroup
        label="Consumo de álcool"
        name="alcoholConsumption"
        options={ALCOHOL_CONSUMPTION_OPTIONS}
        selectedValue={data.alcoholConsumption}
        onChange={(value) => onUpdate('alcoholConsumption', value)}
      />
    </>
  );
};

export default EatingRoutineSection;