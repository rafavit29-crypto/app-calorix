// utils/auth.ts
import { AuthUser } from '../types/user';

const AUTH_KEY = 'authUser';
const USERS_DB_KEY = 'usersDB'; // Stores registered users with passwords (for simulation)

interface UserCredentials {
    email: string;
    passwordHash: string; // In a real app, this would be a hash
}

export const saveAuthUser = (user: AuthUser): void => {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
};

export const loadAuthUser = (): AuthUser | null => {
    const userJson = localStorage.getItem(AUTH_KEY);
    return userJson ? JSON.parse(userJson) : null;
};

export const removeAuthUser = (): void => {
    localStorage.removeItem(AUTH_KEY);
};

// --- Simulated User Database Functions ---
export const registerUser = (email: string, password: string): boolean => {
    const usersDB: UserCredentials[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    if (usersDB.some(user => user.email === email)) {
        return false; // User already exists
    }
    usersDB.push({ email, passwordHash: btoa(password) }); // Simple base64 encoding for demo
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
    return true;
};

export const validateUser = (email: string, password: string): AuthUser | null => {
    const usersDB: UserCredentials[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const user = usersDB.find(u => u.email === email && u.passwordHash === btoa(password));
    return user ? { email: user.email } : null;
};

// For password changes (simplified)
export const updateUserPassword = (email: string, newPassword: string): boolean => {
    const usersDB: UserCredentials[] = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    const userIndex = usersDB.findIndex(u => u.email === email);
    if (userIndex !== -1) {
        usersDB[userIndex].passwordHash = btoa(newPassword);
        localStorage.setItem(USERS_DB_KEY, JSON.stringify(usersDB));
        return true;
    }
    return false;
};
