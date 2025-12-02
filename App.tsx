
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './screens/Auth/LoginScreen';
import RegisterScreen from './screens/Auth/RegisterScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import CommunityScreen from './screens/CommunityScreen';
import RecipesScreen from './screens/RecipesScreen';
import ReportsScreen from './screens/ReportsScreen';
import ChallengesScreen from './screens/ChallengesScreen';
import RemindersScreen from './screens/RemindersScreen';
import FastingScreen from './screens/FastingScreen';
import BarcodeScannerScreen from './screens/BarcodeScannerScreen';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AuthUser, UserProfile } from './types/user';
import { loadAuthUser, saveAuthUser, removeAuthUser, loadUserProfile, saveUserProfile } from './utils/localStorage';
import { calculateGoals } from './utils/calculations';
import { DailyLog, MealItem, MealCategory } from './types/meal';
import { Reminder } from './types/reminder';
import { FastingState } from './types/fasting';
import { Challenge } from './types/challenge';
import NotificationToast from './components/NotificationToast';
import ProfileModal from './modals/ProfileModal';
import { Toast } from './types';
import { v4 as uuidv4 } from 'uuid';
import { getTodayDateString } from './utils/calculations';

// Onboarding screens
import OnboardingLandingScreen from './screens/Onboarding/LandingScreen';
import OnboardingFormContainer from './screens/Onboarding/FormContainer';
import OnboardingSummaryScreen from './screens/Onboarding/SummaryScreen';
import { GENDER_OPTIONS, DAILY_ACTIVITY_LEVEL_OPTIONS, GOAL_OPTIONS, YES_NO_OPTIONS, UNIT_TYPE_OPTIONS } from './constants/formConstants';


type AppView = 'dashboard' | 'profile' | 'community' | 'recipes' | 'reports' | 'challenges' | 'reminders' | 'fasting' | 'barcode';
type AuthView = 'login' | 'register';
type OnboardingStep = 'landing' | 'form' | 'summary';

const App: React.FC = () => {
  const [currentAuthView, setCurrentAuthView] = useState<AuthView>('login');
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [dailyLogs, setDailyLogs] = useState<{ [date: string]: DailyLog }>({});
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [fastingState, setFastingState] = useState<FastingState | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Onboarding states
  const [isOnboardingNeeded, setIsOnboardingNeeded] = useState(true);
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('landing');
  const [onboardingProfileData, setOnboardingProfileData] = useState<UserProfile | null>(null);
  const [isSummaryConfirmed, setIsSummaryConfirmed] = useState(false);


  const initializeUserProfile = (email: string, existingProfile?: UserProfile | null): UserProfile => {
    // Default initial profile for onboarding
    const defaultProfile: UserProfile = {
      name: email.split('@')[0],
      age: 25,
      // Fix: Explicitly cast to the correct literal type
      gender: GENDER_OPTIONS[0] as 'Masculino' | 'Feminino' | 'Prefiro não informar' | 'Não informado', // Masculino
      weight: 70,
      height: 170,
      // Fix: Explicitly cast to the correct literal type
      unitType: UNIT_TYPE_OPTIONS[0] as 'kg/m' | 'lbs/ft', // kg/m
      
      // Fix: Explicitly cast to the correct literal type
      dailyActivityLevel: DAILY_ACTIVITY_LEVEL_OPTIONS[2] as 'Sedentário' | 'Leve' | 'Moderado' | 'Ativo' | 'Muito ativo' | '', // Moderado
      // Fix: Explicitly cast to the correct literal type
      practicesSports: YES_NO_OPTIONS[1] as 'Sim' | 'Não', // Não
      sportName: '',

      // Fix: Explicitly cast to the correct literal type
      goal: GOAL_OPTIONS[0] as 'Perder peso' | 'Manter' | 'Ganhar massa' | 'Ganhar massa muscular' | 'Definir o corpo' | 'Melhorar condicionamento' | 'Reduzir medidas' | 'Estilo de vida saudável', // Perder peso
      desiredWeight: '',
      estimatedDeadline: 'Sem prazo',

      healthIssues: [],
      otherHealthIssue: '',
      allergies: [],
      otherAllergy: '',

      eatingStyle: 'Normal',
      preferences: [],
      waterConsumption: 'Médio',
      alcoholConsumption: 'Nunca',

      sleepHours: '7–8h',
      sleepQuality: 'Boa',

      disciplineLevel: 'Média',
      motivationType: [],
      notificationPreference: 'Sim',

      allowLocalSaving: 'Sim',
      wantAutomaticPersonalization: 'Sim',
      
      // These will be calculated
      activityLevel: 'Moderado', // Placeholder, will be overwritten by calculatedGoals
      caloriesGoal: 0,
      proteinGoal: 0,
      carbGoal: 0,
      fatGoal: 0,
      waterGoal: 0,

      onboardingComplete: false,
    };

    // Merge with existing profile or defaults
    const profileToInit = { ...defaultProfile, ...existingProfile };

    // Calculate goals based on the (potentially partial) profile
    const calculatedGoals = calculateGoals(profileToInit);
    return { ...profileToInit, ...calculatedGoals };
  };

  useEffect(() => {
    // Load auth user from local storage
    const user = loadAuthUser();
    if (user) {
      setCurrentUser(user);
      const storedProfile = loadUserProfile(user.email);
      
      if (storedProfile && storedProfile.onboardingComplete) {
        setUserProfile(storedProfile);
        setIsOnboardingNeeded(false);
      } else {
        // If profile doesn't exist or onboarding isn't complete, start onboarding
        setIsOnboardingNeeded(true);
        setOnboardingProfileData(initializeUserProfile(user.email, storedProfile));
        setOnboardingStep('landing');
      }

      // Load other user-specific data
      const storedDailyLogs = JSON.parse(localStorage.getItem(`dailyLogs_${user.email}`) || '{}');
      setDailyLogs(storedDailyLogs);
      const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`) || '[]');
      setReminders(storedReminders);
      const storedFastingState = JSON.parse(localStorage.getItem(`fasting_${user.email}`) || 'null');
      setFastingState(storedFastingState);
      const storedChallenges = JSON.parse(localStorage.getItem(`challenges_${user.email}`) || '[]');
      setChallenges(storedChallenges);

    } else {
      setIsOnboardingNeeded(false); // No user, no onboarding yet
    }

    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save user profile whenever it changes
  useEffect(() => {
    if (currentUser && userProfile) {
      saveUserProfile(currentUser.email, userProfile);
    }
  }, [userProfile, currentUser]);

  // Save daily logs whenever it changes
  useEffect(() => {
    if (currentUser && dailyLogs) {
      localStorage.setItem(`dailyLogs_${currentUser.email}`, JSON.stringify(dailyLogs));
    }
  }, [dailyLogs, currentUser]);

  // Save reminders whenever they change
  useEffect(() => {
    if (currentUser && reminders) {
      localStorage.setItem(`reminders_${currentUser.email}`, JSON.stringify(reminders));
    }
  }, [reminders, currentUser]);

  // Save fasting state whenever it changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`fasting_${currentUser.email}`, JSON.stringify(fastingState));
    }
  }, [fastingState, currentUser]);

  // Save challenges whenever they change
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`challenges_${currentUser.email}`, JSON.stringify(challenges));
    }
  }, [challenges, currentUser]);

  const handleLogin = (user: AuthUser) => {
    saveAuthUser(user);
    setCurrentUser(user);
    const storedProfile = loadUserProfile(user.email);
    if (storedProfile && storedProfile.onboardingComplete) {
      setUserProfile(storedProfile);
      setIsOnboardingNeeded(false);
      setCurrentView('dashboard');
    } else {
      setIsOnboardingNeeded(true);
      setOnboardingProfileData(initializeUserProfile(user.email, storedProfile));
      setOnboardingStep('landing');
    }
    // Load other data
    const storedDailyLogs = JSON.parse(localStorage.getItem(`dailyLogs_${user.email}`) || '{}');
    setDailyLogs(storedDailyLogs);
    const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`) || '[]');
    setReminders(storedReminders);
    const storedFastingState = JSON.parse(localStorage.getItem(`fasting_${user.email}`) || 'null');
    setFastingState(storedFastingState);
    const storedChallenges = JSON.parse(localStorage.getItem(`challenges_${user.email}`) || '[]');
    setChallenges(storedChallenges);
  };

  const handleRegister = (user: AuthUser) => {
    // After registration, immediately log in and start onboarding
    handleLogin(user); 
  };

  const handleLogout = () => {
    removeAuthUser();
    setCurrentUser(null);
    setUserProfile(null);
    setDailyLogs({});
    setReminders([]);
    setFastingState(null);
    setChallenges([]);
    setCurrentView('dashboard'); // Reset view
    setIsOnboardingNeeded(false); // Reset onboarding state
    setOnboardingProfileData(null);
    setIsSummaryConfirmed(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const changeView = (view: AppView) => {
    setCurrentView(view);
    setIsSidebarOpen(false); // Close sidebar after navigation
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      return newMode;
    });
  };

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    const timer = setTimeout(() => setToast(null), 3000); // Hide toast after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleQuickProfileUpdate = (updatedFields: Partial<UserProfile>) => {
    if (userProfile && currentUser) {
      const updatedProfile = { ...userProfile, ...updatedFields };
      // If weight/height/age changed, ideally recalculate goals, but we'll stick to simple update for now
      // or re-run calculation if those fields exist
      if (updatedFields.weight || updatedFields.height || updatedFields.age || updatedFields.gender || updatedFields.dailyActivityLevel) {
          const newGoals = calculateGoals(updatedProfile);
          Object.assign(updatedProfile, newGoals);
      }
      
      setUserProfile(updatedProfile);
      saveUserProfile(currentUser.email, updatedProfile);
      showToast('Perfil atualizado!', 'success');
    }
  };

  // Simplified Notification Check Logic (for demonstration)
  useEffect(() => {
    if (currentUser && userProfile && userProfile.onboardingComplete) { // Only check if onboarding is complete
      const today = new Date().toISOString().split('T')[0];
      const currentDailyLog = dailyLogs[today];

      if (currentDailyLog) {
        // Check for calorie goal (simplified: just a toast once)
        if (currentDailyLog.caloriesConsumed >= userProfile.caloriesGoal * 0.9 && !currentDailyLog.notifications?.calorieToastShown) {
          if (currentDailyLog.caloriesConsumed >= userProfile.caloriesGoal) {
            showToast('Parabéns! Você atingiu sua meta de calorias 🎉', 'success');
          } else {
            showToast('Quase lá! Falta pouco para sua meta de calorias ⚡', 'info');
          }
          setDailyLogs(prev => ({
            ...prev,
            [today]: {
              ...prev[today],
              notifications: { ...prev[today]?.notifications, calorieToastShown: true }
            }
          }));
        }

        // Check for water goal (simplified: just a toast once)
        if (currentDailyLog.waterIntake >= userProfile.waterGoal && !currentDailyLog.notifications?.waterToastShown) {
          showToast('Excelente! Você atingiu sua meta de água 💧', 'success');
          setDailyLogs(prev => ({
            ...prev,
            [today]: {
              ...prev[today],
              notifications: { ...prev[today]?.notifications, waterToastShown: true }
            }
          }));
        }
      }
    }
  }, [dailyLogs, userProfile, currentUser, showToast]);

  // Handle onboarding completion
  const handleOnboardingFinish = useCallback((data: UserProfile) => {
    if (!currentUser) return;

    const finalProfile: UserProfile = {
      ...data,
      ...calculateGoals(data), // Recalculate goals with complete data
      onboardingComplete: true, // Mark onboarding as complete
    };
    setUserProfile(finalProfile);
    saveUserProfile(currentUser.email, finalProfile);
    setIsSummaryConfirmed(true); // Show confirmation message
    // Optionally, navigate directly to dashboard after a short delay or user interaction
    setTimeout(() => {
      setIsOnboardingNeeded(false);
      setCurrentView('dashboard');
    }, 1500); // Short delay for user to see confirmation
  }, [currentUser, setUserProfile]);

  const handleEditOnboarding = useCallback(() => {
    setIsSummaryConfirmed(false); // Hide confirmation if editing
    setOnboardingStep('form');
  }, []);

  // Handle saving food from Barcode Scanner
  const handleSaveScannedFood = (item: Omit<MealItem, 'id' | 'timestamp'>, category: MealCategory) => {
    const today = getTodayDateString();
    const newItem: MealItem = {
      ...item,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      source: 'manual' // Barcode scan results are saved as user entries
    };

    setDailyLogs(prevLogs => ({
      ...prevLogs,
      [today]: {
        ...prevLogs[today] || {
          date: today,
          meals: { 'Café da manhã': [], 'Almoço': [], 'Jantar': [], 'Lanche': [] },
          waterIntake: 0,
          caloriesConsumed: 0, proteinConsumed: 0, carbsConsumed: 0, fatConsumed: 0
        },
        meals: {
          ...prevLogs[today]?.meals,
          [category]: [...(prevLogs[today]?.meals[category] || []), newItem],
        },
      },
    }));
    setCurrentView('dashboard');
    showToast('Produto adicionado com sucesso!', 'success');
  };


  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-800 transition-colors duration-300">
        {currentAuthView === 'login' ? (
          <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setCurrentAuthView('register')} />
        ) : (
          <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => setCurrentAuthView('login')} />
        )}
      </div>
    );
  }

  // Render onboarding flow if needed
  if (isOnboardingNeeded && onboardingProfileData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-emerald-50 dark:bg-gray-900 transition-colors duration-300 p-4">
        {onboardingStep === 'landing' && (
          <OnboardingLandingScreen onStart={() => setOnboardingStep('form')} />
        )}
        {onboardingStep === 'form' && (
          <OnboardingFormContainer
            initialData={onboardingProfileData}
            onFinish={(data) => { setOnboardingProfileData(data); setOnboardingStep('summary'); }}
            onBackToLanding={() => setOnboardingStep('landing')}
          />
        )}
        {onboardingStep === 'summary' && (
          <OnboardingSummaryScreen
            profileData={onboardingProfileData}
            onEdit={handleEditOnboarding}
            onConfirm={() => handleOnboardingFinish(onboardingProfileData)}
            isConfirmed={isSummaryConfirmed}
          />
        )}
      </div>
    );
  }


  const currentScreenTitle = {
    dashboard: 'Dashboard',
    profile: 'Meu Perfil',
    community: 'Comunidade',
    recipes: 'Receitas',
    reports: 'Relatórios',
    challenges: 'Desafios',
    reminders: 'Lembretes',
    fasting: 'Jejum Intermitente',
    barcode: 'Scanner de Código de Barras'
  }[currentView];

  const renderScreen = () => {
    if (!userProfile) { // Should not happen if onboarding is complete, but for safety
      return <div className="text-center text-gray-600 dark:text-gray-300">Carregando perfil ou perfil não configurado.</div>;
    }
    switch (currentView) {
      case 'dashboard':
        return <DashboardScreen currentUser={currentUser} userProfile={userProfile} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} showToast={showToast} onChangeView={changeView} />;
      case 'profile':
        return <ProfileScreen currentUser={currentUser} userProfile={userProfile} setUserProfile={setUserProfile} showToast={showToast} />;
      case 'community':
        return <CommunityScreen />;
      case 'recipes':
        return <RecipesScreen dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} currentUser={currentUser} showToast={showToast} />;
      case 'reports':
        return <ReportsScreen dailyLogs={dailyLogs} userProfile={userProfile} />;
      case 'challenges':
        return <ChallengesScreen challenges={challenges} setChallenges={setChallenges} showToast={showToast} currentUser={currentUser}/>;
      case 'reminders':
        return <RemindersScreen reminders={reminders} setReminders={setReminders} showToast={showToast} currentUser={currentUser}/>;
      case 'fasting':
        return <FastingScreen fastingState={fastingState} setFastingState={setFastingState} showToast={showToast} currentUser={currentUser}/>;
      case 'barcode':
        return <BarcodeScannerScreen onSave={handleSaveScannedFood} onCancel={() => setCurrentView('dashboard')} showToast={showToast} />;
      default:
        return <DashboardScreen currentUser={currentUser} userProfile={userProfile} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} showToast={showToast} onChangeView={changeView} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      {currentView !== 'barcode' && (
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} changeView={changeView} onLogout={handleLogout} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      )}
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${currentView === 'barcode' ? 'w-full' : ''}`}>
        {currentView !== 'barcode' && (
           <Header 
            title={currentScreenTitle} 
            toggleSidebar={toggleSidebar} 
            userProfile={userProfile}
            onOpenProfile={() => setIsProfileModalOpen(true)}
          />
        )}
        <main className={`flex-1 ${currentView !== 'barcode' ? 'p-4 md:p-6' : ''} bg-gray-50 dark:bg-gray-800 transition-colors duration-300 overflow-y-auto`}>
          {renderScreen()}
        </main>
      </div>
      {toast && <NotificationToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {userProfile && (
        <ProfileModal 
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          onSave={handleQuickProfileUpdate}
          userProfile={userProfile}
        />
      )}
    </div>
  );
};

export default App;
