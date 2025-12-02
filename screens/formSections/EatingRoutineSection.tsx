import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import CheckboxGroup from '../../components/CheckboxGroup';
import {
  EATING_STYLE_OPTIONS,
  PREFERENCE_OPTIONS,
  WATER_CONSUMPTION_OPTIONS,
  ALCOHOL_CONSUMPTION_OPTIONS,
} from '../../constants';

interface EatingRoutineSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string | string[]) => void;
}

const EatingRoutineSection: React.FC<EatingRoutineSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <RadioGroup
        label="Estilo alimentar"
        name="eatingStyle"
        options={EATING_STYLE_OPTIONS}
        selectedValue={data.eatingStyle}
        onChange={(value) => onUpdate('eatingStyle', value)}
      />

      <CheckboxGroup
        label="Preferências"
        options={PREFERENCE_OPTIONS}
        selectedValues={data.preferences}
        onChange={(values) => onUpdate('preferences', values)}
      />

      <RadioGroup
        label="Consumo de água"
        name="waterConsumption"
        options={WATER_CONSUMPTION_OPTIONS}
        selectedValue={data.waterConsumption}
        onChange={(value) => onUpdate('waterConsumption', value)}
      />

      <RadioGroup
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