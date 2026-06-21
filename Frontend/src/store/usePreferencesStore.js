import { create } from 'zustand';

const getLocalStorageBool = (key, defaultValue) => {
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true';
};

const getPref = (key, userId, defaultValue) => {
    if (userId) {
        const userVal = localStorage.getItem(`${key}_${userId}`);
        if (userVal !== null) return userVal === 'true';
    }
    const val = localStorage.getItem(key);
    if (val === null) return defaultValue;
    return val === 'true';
};

export const usePreferencesStore = create((set, get) => ({
    userId: null,
    compactMode: getLocalStorageBool('chat-compact-mode', false),
    enterToSend: getLocalStorageBool('chat-enter-to-send', true),
    soundAlerts: getLocalStorageBool('chat-sound-alerts', true),

    loadPreferences: (userId) => {
        set({
            userId,
            compactMode: getPref('chat-compact-mode', userId, false),
            enterToSend: getPref('chat-enter-to-send', userId, true),
            soundAlerts: getPref('chat-sound-alerts', userId, true),
        });
    },

    setCompactMode: (compactMode) => {
        const userId = get().userId;
        const val = compactMode === true || compactMode === 'true';
        const key = 'chat-compact-mode';
        if (userId) {
            localStorage.setItem(`${key}_${userId}`, val ? 'true' : 'false');
        }
        localStorage.setItem(key, val ? 'true' : 'false');
        set({ compactMode: val });
    },
    setEnterToSend: (enterToSend) => {
        const userId = get().userId;
        const val = enterToSend === true || enterToSend === 'true';
        const key = 'chat-enter-to-send';
        if (userId) {
            localStorage.setItem(`${key}_${userId}`, val ? 'true' : 'false');
        }
        localStorage.setItem(key, val ? 'true' : 'false');
        set({ enterToSend: val });
    },
    setSoundAlerts: (soundAlerts) => {
        const userId = get().userId;
        const val = soundAlerts === true || soundAlerts === 'true';
        const key = 'chat-sound-alerts';
        if (userId) {
            localStorage.setItem(`${key}_${userId}`, val ? 'true' : 'false');
        }
        localStorage.setItem(key, val ? 'true' : 'false');
        set({ soundAlerts: val });
    },
}));

