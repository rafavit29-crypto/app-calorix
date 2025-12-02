// utils/theme.ts

export const loadThemePreference = (): 'light' | 'dark' => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
        return storedTheme;
    }
    // Default to light if no preference or invalid value
    return 'light';
};

export const saveThemePreference = (theme: 'light' | 'dark'): void => {
    localStorage.setItem('theme', theme);
};

export const applyTheme = (theme: 'light' | 'dark'): void => {
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
