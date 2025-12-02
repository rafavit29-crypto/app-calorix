import { UserProfileData } from '../types';

const STORAGE_KEY = 'userProfile';

export const saveUserProfile = (profile: UserProfileData): void => {
  try {
    const serializedProfile = JSON.stringify(profile);
    localStorage.setItem(STORAGE_KEY, serializedProfile);
  } catch (error) {
    console.error("Error saving user profile to local storage:", error);
  }
};

export const loadUserProfile = (): UserProfileData | null => {
  try {
    const serializedProfile = localStorage.getItem(STORAGE_KEY);
    if (serializedProfile === null) {
      return null;
    }
    return JSON.parse(serializedProfile);
  } catch (error) {
    console.error("Error loading user profile from local storage:", error);
    return null;
  }
};
