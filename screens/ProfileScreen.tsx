import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import ProfileEditModal from '../modals/ProfileEditModal';
import { AuthUser, UserProfile } from '../types/user';
import { calculateGoals } from '../utils/calculations';
import { Toast } from '../types';

interface ProfileScreenProps {
  currentUser: AuthUser;
  userProfile: UserProfile | null;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  showToast: (message: string, type: Toast['type']) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ currentUser, userProfile, setUserProfile, showToast }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localProfile, setLocalProfile] = useState<UserProfile | null>(userProfile);

  useEffect(() => {
    setLocalProfile(userProfile);
  }, [userProfile]);

  const handleSaveProfile = (updatedProfile: UserProfile) => {
    // Recalculate goals when profile changes
    const newGoals = calculateGoals(updatedProfile);
    const finalProfile = { ...updatedProfile, ...newGoals, onboardingComplete: true }; // Ensure onboardingComplete remains true
    setUserProfile(finalProfile);
    setLocalProfile(finalProfile); // Update local state for immediate display
    setIsEditModalOpen(false);
    showToast('Perfil atualizado com sucesso!', 'success');
  };

  if (!localProfile) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Carregando perfil...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Meu Perfil</h2>

      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Informações Pessoais</h3>
          <Button variant="secondary" onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 text-sm">
            Editar
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p><strong>Nome:</strong> {localProfile.name}</p>
          <p><strong>Email:</strong> {currentUser.email}</p>
          <p><strong>Idade:</strong> {localProfile.age} anos</p>
          <p><strong>Sexo:</strong> {localProfile.gender}</p>
          <p><strong>Peso:</strong> {localProfile.weight} {localProfile.unitType === 'kg/m' ? 'kg' : 'lbs'}</p>
          <p><strong>Altura:</strong> {localProfile.height} {localProfile.unitType === 'kg/m' ? 'cm' : 'ft'}</p>
          <p><strong>Nível de Atividade:</strong> {localProfile.dailyActivityLevel}</p>
          <p><strong>Pratica Esportes:</strong> {localProfile.practicesSports}</p>
          <p><strong>Objetivo:</strong> {localProfile.goal}</p>
          <p><strong>Alergias:</strong> {localProfile.allergies.length > 0 ? localProfile.allergies.join(', ') : 'Nenhuma'}</p>
          <p><strong>Unidade:</strong> {localProfile.unitType}</p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Minhas Metas Diárias</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
          <p><strong>Calorias:</strong> {localProfile.caloriesGoal} kcal</p>
          <p><strong>Proteína:</strong> {localProfile.proteinGoal} g</p>
          <p><strong>Carboidratos:</strong> {localProfile.carbGoal} g</p>
          <p><strong>Gordura:</strong> {localProfile.fatGoal} g</p>
          <p><strong>Água:</strong> {localProfile.waterGoal} ml</p>
        </div>
      </Card>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveProfile}
        initialProfileData={localProfile}
      />
    </div>
  );
};

export default ProfileScreen;