// utils/localStorage.ts
import { UserProfile, AuthUser } from '../types/user';
import { DailyLog } from '../types/meal';
import { Reminder } from '../types/reminder';
import { FastingState } from '../types/fasting';
import { Challenge } from '../types/challenge';

const USER_PROFILE_PREFIX = 'userProfile_';
const DAILY_LOGS_PREFIX = 'dailyLogs_';
const REMINDERS_PREFIX = 'reminders_';
const FASTING_PREFIX = 'fasting_';
const CHALLENGES_PREFIX = 'challenges_';
const AUTH_USER_KEY = 'authUser'; // Used by utils/auth.ts but defined here for completeness

// --- Auth User ---
export const saveAuthUser = (user: AuthUser): void => {
    try {
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } catch (error) {
        console.error("Error saving auth user to local storage:", error);
    }
};

export const loadAuthUser = (): AuthUser | null => {
    try {
        const userJson = localStorage.getItem(AUTH_USER_KEY);
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        console.error("Error loading auth user from local storage:", error);
        return null;
    }
};

export const removeAuthUser = (): void => {
    try {
        localStorage.removeItem(AUTH_USER_KEY);
    } catch (error) {
        console.error("Error removing auth user from local storage:", error);
    }
};


// --- User Profile ---
export const saveUserProfile = (userEmail: string, profile: UserProfile): void => {
    try {
        localStorage.setItem(`${USER_PROFILE_PREFIX}${userEmail}`, JSON.stringify(profile));
    } catch (error) {
        console.error(`Error saving user profile for ${userEmail}:`, error);
    }
};

export const loadUserProfile = (userEmail: string): UserProfile | null => {
    try {
        const profileJson = localStorage.getItem(`${USER_PROFILE_PREFIX}${userEmail}`);
        return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
        console.error(`Error loading user profile for ${userEmail}:`, error);
        return null;
    }
};

// --- Daily Logs ---
export const saveDailyLogs = (userEmail: string, dailyLogs: { [date: string]: DailyLog }): void => {
    try {
        localStorage.setItem(`${DAILY_LOGS_PREFIX}${userEmail}`, JSON.stringify(dailyLogs));
    } catch (error) {
        console.error(`Error saving daily logs for ${userEmail}:`, error);
    }
};

export const loadDailyLogs = (userEmail: string): { [date: string]: DailyLog } => {
    try {
        const logsJson = localStorage.getItem(`${DAILY_LOGS_PREFIX}${userEmail}`);
        return logsJson ? JSON.parse(logsJson) : {};
    } catch (error) {
        console.error(`Error loading daily logs for ${userEmail}:`, error);
        return {};
    }
};

// --- Reminders ---
export const saveReminders = (userEmail: string, reminders: Reminder[]): void => {
    try {
        localStorage.setItem(`${REMINDERS_PREFIX}${userEmail}`, JSON.stringify(reminders));
    } catch (error) {
        console.error(`Error saving reminders for ${userEmail}:`, error);
    }
};

export const loadReminders = (userEmail: string): Reminder[] => {
    try {
        const remindersJson = localStorage.getItem(`${REMINDERS_PREFIX}${userEmail}`);
        return remindersJson ? JSON.parse(remindersJson) : [];
    } catch (error) {
        console.error(`Error loading reminders for ${userEmail}:`, error);
        return [];
    }
};

// --- Fasting State ---
export const saveFastingState = (userEmail: string, state: FastingState | null): void => {
    try {
        localStorage.setItem(`${FASTING_PREFIX}${userEmail}`, JSON.stringify(state));
    } catch (error) {
        console.error(`Error saving fasting state for ${userEmail}:`, error);
    }
};

export const loadFastingState = (userEmail: string): FastingState | null => {
    try {
        const stateJson = localStorage.getItem(`${FASTING_PREFIX}${userEmail}`);
        return stateJson ? JSON.parse(stateJson) : null;
    } catch (error) {
        console.error(`Error loading fasting state for ${userEmail}:`, error);
        return null;
    }
};

// --- Challenges ---
export const saveChallenges = (userEmail: string, challenges: Challenge[]): void => {
    try {
        localStorage.setItem(`${CHALLENGES_PREFIX}${userEmail}`, JSON.stringify(challenges));
    } catch (error) {
        console.error(`Error saving challenges for ${userEmail}:`, error);
    }
};

export const loadChallenges = (userEmail: string): Challenge[] => {
    try {
        const challengesJson = localStorage.getItem(`${CHALLENGES_PREFIX}${userEmail}`);
        return challengesJson ? JSON.parse(challengesJson) : [];
    } catch (error) {
        console.error(`Error loading challenges for ${userEmail}:`, error);
        return [];
    }
};
