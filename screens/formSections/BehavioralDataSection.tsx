import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import CheckboxGroup from '../../components/CheckboxGroup';
import {
  DISCIPLINE_LEVEL_OPTIONS,
  MOTIVATION_TYPE_OPTIONS,
  NOTIFICATION_PREFERENCE_OPTIONS,
} from '../../constants';

interface BehavioralDataSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string | string[]) => void;
}

const BehavioralDataSection: React.FC<BehavioralDataSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <RadioGroup
        label="Nível de disciplina"
        name="disciplineLevel"
        options={DISCIPLINE_LEVEL_OPTIONS}
        selectedValue={data.disciplineLevel}
        onChange={(value) => onUpdate('disciplineLevel', value)}
      />

      <CheckboxGroup
        label="Qual tipo de motivação prefere?"
        options={MOTIVATION_TYPE_OPTIONS}
        selectedValues={data.motivationType}
        onChange={(values) => onUpdate('motivationType', values)}
      />

      <RadioGroup
        label="Preferência por notificações"
        name="notificationPreference"
        options={NOTIFICATION_PREFERENCE_OPTIONS}
        selectedValue={data.notificationPreference}
        onChange={(value) => onUpdate('notificationPreference', value)}
      />
    </>
  );
};

export default BehavioralDataSection;