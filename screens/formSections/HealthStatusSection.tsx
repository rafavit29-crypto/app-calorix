import React from 'react';
import { UserProfileData } from '../../types';
import CheckboxGroup from '../../components/CheckboxGroup';
import { HEALTH_ISSUE_OPTIONS, ALLERGY_OPTIONS } from '../../constants';

interface HealthStatusSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string[] | string) => void;
}

const HealthStatusSection: React.FC<HealthStatusSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <CheckboxGroup
        label="Estado de Saúde (Opcional)"
        options={HEALTH_ISSUE_OPTIONS}
        selectedValues={data.healthIssues}
        onChange={(values) => onUpdate('healthIssues', values)}
        otherTextValue={data.otherHealthIssue}
        onOtherTextChange={(value) => onUpdate('otherHealthIssue', value)}
        noneOption="Nenhuma das opções"
      />

      <CheckboxGroup
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