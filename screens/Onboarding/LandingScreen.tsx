import React from 'react';
import OnboardingLayout from './components/OnboardingLayout';
import Button from '../../components/Button'; // Use main app's Button

interface OnboardingLandingScreenProps {
  onStart: () => void;
}

const OnboardingLandingScreen: React.FC<OnboardingLandingScreenProps> = ({ onStart }) => {
  return (
    <OnboardingLayout>
      <div className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6">
          Seu Perfil de Saúde
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 leading-relaxed">
          Crie seu perfil detalhado para um estilo de vida mais saudável e personalizado.
          Sua jornada de bem-estar começa aqui!
        </p>
        <Button onClick={onStart}>
          Começar
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </div>
    </OnboardingLayout>
  );
};

export default OnboardingLandingScreen;