import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingCheckboxGroup from '../components/OnboardingCheckboxGroup';
import { HEALTH_ISSUE_OPTIONS, ALLERGY_OPTIONS } from '../../../constants/formConstants';

interface HealthStatusSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string[] | string) => void;
}

const HealthStatusSection: React.FC<HealthStatusSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <OnboardingCheckboxGroup
        label="Estado de Saúde (Opcional)"
        options={HEALTH_ISSUE_OPTIONS}
        selectedValues={data.healthIssues}
        onChange={(values) => onUpdate('healthIssues', values)}
        otherTextValue={data.otherHealthIssue}
        onOtherTextChange={(value) => onUpdate('otherHealthIssue', value)}
        noneOption="Nenhuma das opções"
      />

      <OnboardingCheckboxGroup
        label="Alergias"
        options={ALLERGY_OPTIONS}
        selectedValues={data.allergies}
        onChange={(values) => onUpdate('allergies', values)}
        otherTextValue={data.otherAllergy}
        onOtherTextChange={(value) => onUpdate('otherAllergy', value)}
        noneOption="Nenhuma"
      />
    </>
  );
};

export default HealthStatusSection;