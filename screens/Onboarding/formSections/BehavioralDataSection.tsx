import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import OnboardingCheckboxGroup from '../components/OnboardingCheckboxGroup';
import {
  DISCIPLINE_LEVEL_OPTIONS,
  MOTIVATION_TYPE_OPTIONS,
  NOTIFICATION_PREFERENCE_OPTIONS,
} from '../../../constants/formConstants';

interface BehavioralDataSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string | string[]) => void;
}

const BehavioralDataSection: React.FC<BehavioralDataSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <OnboardingRadioGroup
        label="Nível de disciplina"
        name="disciplineLevel"
        options={DISCIPLINE_LEVEL_OPTIONS}
        selectedValue={data.disciplineLevel}
        onChange={(value) => onUpdate('disciplineLevel', value)}
      />

      <OnboardingCheckboxGroup
        label="Qual tipo de motivação prefere?"
        options={MOTIVATION_TYPE_OPTIONS}
        selectedValues={data.motivationType}
        onChange={(values) => onUpdate('motivationType', values)}
      />

      <OnboardingRadioGroup
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