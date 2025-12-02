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
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { AuthUser, UserProfile } from './types/user';
import { loadAuthUser, saveAuthUser, removeAuthUser, loadUserProfile, saveUserProfile } from './utils/localStorage';
import { calculateGoals } from './utils/calculations';
import { DailyLog } from './types/meal';
import { Reminder } from './types/reminder';
import { FastingState } from './types/fasting';
import { Challenge } from './types/challenge';
import NotificationToast from './components/NotificationToast';
import { Toast } from './types';

type AppView = 'dashboard' | 'profile' | 'community' | 'recipes' | 'reports' | 'challenges' | 'reminders' | 'fasting';
type AuthView = 'login' | 'register';

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

  useEffect(() => {
    // Load auth user from local storage
    const user = loadAuthUser();
    if (user) {
      setCurrentUser(user);
      // Load user profile and other data specific to this user
      const storedProfile = loadUserProfile(user.email);
      if (storedProfile) {
        setUserProfile(storedProfile);
      } else {
        // If no profile, navigate to profile setup or a default.
        // For now, setting a default and letting user edit
        setUserProfile({
          name: user.email.split('@')[0], // Default name
          age: 25,
          gender: 'Não informado',
          weight: 70,
          height: 170,
          activityLevel: 'Moderado',
          practicesSports: 'Não',
          goal: 'Manter',
          allergies: [],
          unitType: 'kg/m',
          ...calculateGoals(25, 'Não informado', 70, 170, 'Moderado', 'Manter'), // Calculate initial goals
        });
      }
      // Load daily logs, reminders, etc.
      // Example for daily logs (needs to be keyed by user email)
      const storedDailyLogs = JSON.parse(localStorage.getItem(`dailyLogs_${user.email}`) || '{}');
      setDailyLogs(storedDailyLogs);
      const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`) || '[]');
      setReminders(storedReminders);
      const storedFastingState = JSON.parse(localStorage.getItem(`fasting_${user.email}`) || 'null');
      setFastingState(storedFastingState);
      const storedChallenges = JSON.parse(localStorage.getItem(`challenges_${user.email}`) || '[]');
      setChallenges(storedChallenges);

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
    // Reload user-specific data after login
    const storedProfile = loadUserProfile(user.email);
    if (storedProfile) {
      setUserProfile(storedProfile);
    } else {
      setUserProfile({
        name: user.email.split('@')[0], // Default name
        age: 25,
        gender: 'Não informado',
        weight: 70,
        height: 170,
        activityLevel: 'Moderado',
        practicesSports: 'Não',
        goal: 'Manter',
        allergies: [],
        unitType: 'kg/m',
        ...calculateGoals(25, 'Não informado', 70, 170, 'Moderado', 'Manter'),
      });
    }
    const storedDailyLogs = JSON.parse(localStorage.getItem(`dailyLogs_${user.email}`) || '{}');
    setDailyLogs(storedDailyLogs);
    const storedReminders = JSON.parse(localStorage.getItem(`reminders_${user.email}`) || '[]');
    setReminders(storedReminders);
    const storedFastingState = JSON.parse(localStorage.getItem(`fasting_${user.email}`) || 'null');
    setFastingState(storedFastingState);
    const storedChallenges = JSON.parse(localStorage.getItem(`challenges_${user.email}`) || '[]');
    setChallenges(storedChallenges);
    setCurrentView('dashboard'); // Navigate to dashboard after login
  };

  const handleRegister = (user: AuthUser) => {
    handleLogin(user); // Log in immediately after registration
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

  // Simplified Notification Check Logic (for demonstration)
  useEffect(() => {
    if (currentUser && userProfile) {
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

  const currentScreenTitle = {
    dashboard: 'Dashboard',
    profile: 'Meu Perfil',
    community: 'Comunidade',
    recipes: 'Receitas',
    reports: 'Relatórios',
    challenges: 'Desafios',
    reminders: 'Lembretes',
    fasting: 'Jejum Intermitente',
  }[currentView];

  const renderScreen = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardScreen currentUser={currentUser} userProfile={userProfile} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} showToast={showToast} />;
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
      default:
        return <DashboardScreen currentUser={currentUser} userProfile={userProfile} dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} showToast={showToast} />;
    }
  };

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} changeView={changeView} onLogout={handleLogout} toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out">
        <Header title={currentScreenTitle} toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-800 transition-colors duration-300 overflow-y-auto">
          {renderScreen()}
        </main>
      </div>
      {toast && <NotificationToast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default App;