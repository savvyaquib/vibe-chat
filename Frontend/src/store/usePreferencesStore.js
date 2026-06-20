import { create } from 'zustand';

export const usePreferencesStore = create((set) => ({
    compactMode: localStorage.getItem('chat-compact-mode') === 'true',
    enterToSend: localStorage.getItem('chat-enter-to-send') !== 'false', // default true
    soundAlerts: localStorage.getItem('chat-sound-alerts') !== 'false', // default true

    setCompactMode: (compactMode) => {
        localStorage.setItem('chat-compact-mode', compactMode);
        set({ compactMode });
    },
    setEnterToSend: (enterToSend) => {
        localStorage.setItem('chat-enter-to-send', enterToSend);
        set({ enterToSend });
    },
    setSoundAlerts: (soundAlerts) => {
        localStorage.setItem('chat-sound-alerts', soundAlerts);
        set({ soundAlerts });
    },
}));
