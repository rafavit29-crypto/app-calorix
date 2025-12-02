import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Layout from '../components/Layout';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import { UserProfileData } from '../types';
import { FORM_SECTIONS } from '../constants';

// Import all form sections
import UserProfileSection from './formSections/UserProfileSection';
import ActivityRoutineSection from './formSections/ActivityRoutineSection';
import GoalsSection from './formSections/GoalsSection';
import HealthStatusSection from './formSections/HealthStatusSection';
import EatingRoutineSection from './formSections/EatingRoutineSection';
import SleepHabitsSection from './formSections/SleepHabitsSection';
import BehavioralDataSection from './formSections/BehavioralDataSection';
import PrivacyPersonalizationSection from './formSections/PrivacyPersonalizationSection';

interface FormContainerProps {
  initialData: UserProfileData;
  onFinish: (data: UserProfileData) => void;
  onBackToLanding: () => void;
}

const FormContainer: React.FC<FormContainerProps> = ({ initialData, onFinish, onBackToLanding }) => {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [formData, setFormData] = useState<UserProfileData>(initialData);

  const totalSteps = FORM_SECTIONS.length;

  // Update formData from initialData if it changes (e.g., from an edit action)
  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleUpdate = useCallback(
    (field: keyof UserProfileData, value: string | number | string[]) => {
      setFormData((prevData) => ({
        ...prevData,
        [field]: value,
      }));
    },
    [],
  );

  const handleNext = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    } else {
      onFinish(formData);
    }
  }, [currentStep, totalSteps, formData, onFinish]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prevStep) => prevStep - 1);
    } else {
      onBackToLanding(); // Go back to landing if on the first step
    }
  }, [currentStep, onBackToLanding]);

  const CurrentSectionComponent = useMemo(() => {
    switch (currentStep) {
      case 0:
        return UserProfileSection;
      case 1:
        return ActivityRoutineSection;
      case 2:
        return GoalsSection;
      case 3:
        return HealthStatusSection;
      case 4:
        return EatingRoutineSection;
      case 5:
        return SleepHabitsSection;
      case 6:
        return BehavioralDataSection;
      case 7:
        return PrivacyPersonalizationSection;
      default:
        return () => <div>Seção não encontrada</div>;
    }
  }, [currentStep]);

  return (
    <Layout>
      <ProgressBar
        currentStep={currentStep + 1}
        totalSteps={totalSteps}
        label={FORM_SECTIONS[currentStep]}
      />

      <div className="py-6 min-h-[400px]"> {/* Added min-h to prevent layout shift */}
        <CurrentSectionComponent data={formData} onUpdate={handleUpdate} />
      </div>

      <div className="mt-8 flex justify-between sticky bottom-0 bg-white pt-4 -mx-10 px-10 rounded-b-2xl shadow-inner">
        <Button variant="secondary" onClick={handleBack} disabled={currentStep === 0 && !onBackToLanding}>
          {currentStep === 0 ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block mr-2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h17.25" />
            </svg>
          )}
          Voltar
        </Button>
        <Button onClick={handleNext}>
          {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 inline-block ml-2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </Button>
      </div>
    </Layout>
  );
};

export default FormContainer;