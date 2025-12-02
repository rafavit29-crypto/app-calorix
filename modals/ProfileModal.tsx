
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { UserProfile } from '../types/user';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedProfile: Partial<UserProfile>) => void;
  userProfile: UserProfile;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose, onSave, userProfile }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: 0,
    weight: 0,
    height: 0,
    caloriesGoal: 0,
    avatar: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && userProfile) {
      setFormData({
        name: userProfile.name,
        age: userProfile.age,
        weight: userProfile.weight,
        height: userProfile.height,
        caloriesGoal: userProfile.caloriesGoal,
        avatar: userProfile.avatar || '',
      });
    }
  }, [isOpen, userProfile]);

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      alert('O nome é obrigatório.');
      return;
    }
    
    // Pass only the fields managed by this modal
    onSave({
      name: formData.name,
      age: Number(formData.age),
      weight: Number(formData.weight),
      height: Number(formData.height),
      caloriesGoal: Number(formData.caloriesGoal),
      avatar: formData.avatar,
    });
    onClose();
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Perfil">
      <div className="flex flex-col items-center mb-6">
        <div className="relative group cursor-pointer" onClick={triggerFileSelect}>
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 shadow-md">
            {formData.avatar ? (
              <img src={formData.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>
        <p className="text-sm text-primary mt-2 cursor-pointer font-medium" onClick={triggerFileSelect}>Alterar foto</p>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload} 
        />
      </div>

      <div className="space-y-4">
        <InputField 
          label="Nome" 
          id="profile-name" 
          value={formData.name} 
          onChange={(e) => handleChange('name', e.target.value)} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <InputField 
            label="Idade" 
            id="profile-age" 
            type="number" 
            value={formData.age} 
            onChange={(e) => handleChange('age', e.target.value)} 
          />
           <InputField 
            label="Meta Calórica" 
            id="profile-cals" 
            type="number" 
            value={formData.caloriesGoal} 
            onChange={(e) => handleChange('caloriesGoal', e.target.value)} 
            unit="kcal"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <InputField 
            label="Peso (kg)" 
            id="profile-weight" 
            type="number" 
            value={formData.weight} 
            onChange={(e) => handleChange('weight', e.target.value)} 
          />
          <InputField 
            label="Altura (cm)" 
            id="profile-height" 
            type="number" 
            value={formData.height} 
            onChange={(e) => handleChange('height', e.target.value)} 
          />
        </div>

        <Button onClick={handleSave} className="w-full mt-6">
          Salvar Alterações
        </Button>
      </div>
    </Modal>
  );
};

export default ProfileModal;
