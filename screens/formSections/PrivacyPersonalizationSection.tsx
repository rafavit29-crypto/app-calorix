import React from 'react';
import { UserProfileData } from '../../types';
import RadioGroup from '../../components/RadioGroup';
import { YES_NO_OPTIONS } from '../../constants';

interface PrivacyPersonalizationSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string) => void;
}

const PrivacyPersonalizationSection: React.FC<PrivacyPersonalizationSectionProps> = ({ data, onUpdate }) => {
  return (
    <>
      <RadioGroup
        label="Permitir salvar dados localmente?"
        name="allowLocalSaving"
        options={YES_NO_OPTIONS}
        selectedValue={data.allowLocalSaving}
        onChange={(value) => onUpdate('allowLocalSaving', value)}
      />

      {data.allowLocalSaving === 'Não' && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-6 rounded-md" role="alert">
          <p className="font-bold">Atenção:</p>
          <p className="text-sm">Seus dados não serão salvos no seu dispositivo após fechar o aplicativo.</p>
        </div>
      )}

      <RadioGroup
        label="Deseja personalização automática?"
        name="wantAutomaticPersonalization"
        options={YES_NO_OPTIONS}
        selectedValue={data.wantAutomaticPersonalization}
        onChange={(value) => onUpdate('wantAutomaticPersonalization', value)}
      />
    </>
  );
};

export default PrivacyPersonalizationSection;