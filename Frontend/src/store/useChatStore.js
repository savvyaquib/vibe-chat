import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

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
            } else {
                const senderId = message.sender?._id;
                if (senderId) {
                    set((state) => ({
                        users: state.users.map(user => 
                            user._id === senderId 
                                ? { ...user, unreadCount: (user.unreadCount || 0) + 1 }
                                : user
                        )
                    }));
                }
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
        set({ isMessagesLoading: true });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            set({ isMessagesLoading: false });
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
                set({ messages: [...messages, response.data.message] });
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