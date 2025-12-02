import React from 'react';
import { UserProfileData } from '../../types';
import FormInput from '../../components/FormInput';
import RadioGroup from '../../components/RadioGroup';
import { GENDER_OPTIONS, UNIT_TYPE_OPTIONS } from '../../constants';

interface UserProfileSectionProps {
  data: UserProfileData;
  onUpdate: (field: keyof UserProfileData, value: string | number) => void;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ data, onUpdate }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onUpdate(name as keyof UserProfileData, type === 'number' ? parseFloat(value) || '' : value);
  };

  const getWeightUnit = () => {
    return data.unitType === 'kg/m' ? 'kg' : 'lbs';
  };

  const getHeightUnit = () => {
    return data.unitType === 'kg/m' ? 'cm' : 'ft'; // Assuming cm for kg/m for simplicity, could be m too
  };

  return (
    <>
      <FormInput
        label="Nome"
        id="name"
        name="name"
        type="text"
        value={data.name}
        onChange={handleInputChange}
        placeholder="Seu nome"
        required
      />

      <FormInput
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

      <RadioGroup
        label="Sexo"
        name="gender"
        options={GENDER_OPTIONS}
        selectedValue={data.gender}
        onChange={(value) => onUpdate('gender', value)}
      />

      <RadioGroup
        label="Tipo de unidade"
        name="unitType"
        options={UNIT_TYPE_OPTIONS}
        selectedValue={data.unitType}
        onChange={(value) => onUpdate('unitType', value)}
      />

      <FormInput
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

      <FormInput
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