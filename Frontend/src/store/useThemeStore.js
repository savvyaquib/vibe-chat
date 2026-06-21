import { create } from 'zustand';

const getThemePref = (userId, defaultTheme = 'light') => {
    if (userId) {
        const userTheme = localStorage.getItem(`chat-theme_${userId}`);
        if (userTheme) return userTheme;
    }
    return localStorage.getItem('chat-theme') || defaultTheme;
};

export const useThemeStore = create((set, get) => ({
    userId: null,
    theme: localStorage.getItem('chat-theme') || 'light', // default theme

    loadTheme: (userId) => {
        set({
            userId,
            theme: getThemePref(userId, 'light'),
        });
    },

    setTheme: (theme) => {
        const userId = get().userId;
        if (userId) {
            localStorage.setItem(`chat-theme_${userId}`, theme);
        }
        localStorage.setItem('chat-theme', theme);
        set({ theme });
    },
}));