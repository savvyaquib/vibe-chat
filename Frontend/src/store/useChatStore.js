import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';
import { useAuthStore } from './useAuthStore';
import { usePreferencesStore } from './usePreferencesStore';

const playNotificationSound = () => {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const playTone = (freq, startTime, duration) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.05, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        };
        
        const now = audioCtx.currentTime;
        playTone(587.33, now, 0.12); // D5
        playTone(880, now + 0.08, 0.2);   // A5
    } catch (e) {
        console.error("Audio playback error:", e);
    }
};

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    typingUsers: {},

    setSocket: (socket) => {
        if (!socket) return;
        
        // Ensure we don't attach duplicate listeners if setSocket is called multiple times
        socket.off('message_received');
        socket.off('user_typing');
        socket.off('user_stop_typing');

        socket.on('message_received', (message) => {
            const { selectedUser, messages } = get();

            const isRelevant = selectedUser && (
                message.sender?._id === selectedUser._id ||
                message.receiver?._id === selectedUser._id
            );

            if (isRelevant) {
                set({ messages: [...messages, message] });
            }

            const authUser = useAuthStore.getState().authUser;
            const isFromOther = authUser && message.sender?._id !== authUser._id && message.sender !== authUser._id;
            
            console.log("Message received - isFromOther:", isFromOther, "soundAlerts:", usePreferencesStore.getState().soundAlerts);
            
            if (isFromOther && usePreferencesStore.getState().soundAlerts === true) {
                playNotificationSound();
            }

            const senderId = message.sender?._id;
            if (senderId) {
                set((state) => ({
                    users: state.users.map(user => 
                        user._id === senderId 
                            ? { 
                                ...user, 
                                lastMessage: message,
                                unreadCount: !isRelevant ? (user.unreadCount || 0) + 1 : user.unreadCount 
                              }
                            : user
                    )
                }));
            }
        });

        socket.on('user_typing', ({ senderId }) => {
            set((state) => ({
                typingUsers: { ...state.typingUsers, [senderId]: true }
            }));
        });

        socket.on('user_stop_typing', ({ senderId }) => {
            set((state) => {
                const newTypingUsers = { ...state.typingUsers };
                delete newTypingUsers[senderId];
                return { typingUsers: newTypingUsers };
            });
        });

        socket.on('messages_read', ({ userId }) => {
            const { selectedUser } = get();
            
            if (selectedUser && selectedUser._id === userId) {
                set((state) => ({
                    messages: state.messages.map(msg => 
                        msg.receiver?._id === userId || msg.receiver === userId
                            ? { ...msg, isRead: true }
                            : msg
                    )
                }));
            }

            set((state) => ({
                users: state.users.map(user => {
                    if (user._id === userId && user.lastMessage && (user.lastMessage.receiver?._id === userId || user.lastMessage.receiver === userId)) {
                        return { 
                            ...user, 
                            lastMessage: { ...user.lastMessage, isRead: true } 
                        };
                    }
                    return user;
                })
            }));
        });
    },

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data.users });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true, messages: [] });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    markMessagesAsRead: async (userId) => {
        try {
            await axiosInstance.put(`/messages/mark-read/${userId}`);
            set((state) => ({
                messages: state.messages.map(msg => 
                    msg.sender?._id === userId || msg.sender === userId
                        ? { ...msg, isRead: true }
                        : msg
                ),
                users: state.users.map(user => 
                    user._id === userId ? { ...user, unreadCount: 0 } : user
                )
            }));
        } catch (error) {
            console.error('Failed to mark messages as read:', error);
        }
    },
    sendMessage: async ({ text, image, images }) => {
        const { selectedUser, messages } = get();
        try {
            const payload = {
                content: text,
            };

            if (image) {
                payload.image = image;
            }

            if (images && images.length > 0) {
                payload.images = images;
            }

            const response = await axiosInstance.post(`/messages/${selectedUser._id}`, payload);

            if (response.data?.message) {
                set((state) => ({ 
                    messages: [...state.messages, response.data.message],
                    users: state.users.map(user => 
                        user._id === selectedUser._id 
                            ? { ...user, lastMessage: response.data.message }
                            : user
                    )
                }));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    },

    setSelectedUser: (user) => {
        set((state) => ({
            selectedUser: user,
            users: state.users.map(u => 
                u._id === user?._id ? { ...u, unreadCount: 0 } : u
            )
        }));
    },
}));