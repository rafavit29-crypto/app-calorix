import React from 'react';
import { UserProfile } from '../../../types/user';
import OnboardingInputField from '../components/OnboardingInputField';
import OnboardingRadioGroup from '../components/OnboardingRadioGroup';
import { GENDER_OPTIONS, UNIT_TYPE_OPTIONS } from '../../../constants/formConstants';

interface UserProfileSectionProps {
  data: UserProfile;
  onUpdate: (field: keyof UserProfile, value: string | number) => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onUpdate(name as keyof UserProfile, type === 'number' ? parseFloat(value) || '' : value);
  };

  const getWeightUnit = () => {
    return data.unitType === 'kg/m' ? 'kg' : 'lbs';
  };

  const getHeightUnit = () => {
    return data.unitType === 'kg/m' ? 'cm' : 'ft'; // Assuming cm for kg/m for simplicity, could be m too
  };

  return (
    <>
      <OnboardingInputField
        label="Nome"
        id="name"
        name="name"
        type="text"
        value={data.name}
        onChange={handleInputChange}
        placeholder="Seu nome"
        required
      />

      <OnboardingInputField
        label="Idade"
        id="age"
        name="age"
        type="number"
        value={data.age}
        onChange={handleInputChange}
        placeholder="Sua idade"
        min="0"
        required
      />

      <OnboardingRadioGroup
        label="Sexo"
        name="gender"
        options={GENDER_OPTIONS}
        selectedValue={data.gender}
        onChange={(value) => onUpdate('gender', value)}
      />

      <OnboardingRadioGroup
        label="Tipo de unidade"
        name="unitType"
        options={UNIT_TYPE_OPTIONS}
        selectedValue={data.unitType}
        onChange={(value) => onUpdate('unitType', value)}
      />

      <OnboardingInputField
        label="Peso atual"
        id="weight"
        name="weight"
        type="number"
        value={data.weight}
        onChange={handleInputChange}
        placeholder="Seu peso atual"
        unit={getWeightUnit()}
        required
      />

      <OnboardingInputField
        label="Altura"
        id="height"
        name="height"
        type="number"
        value={data.height}
        onChange={handleInputChange}
        placeholder="Sua altura"
        unit={getHeightUnit()}
        required
      />
    </>
  );
};

export default UserProfileSection;