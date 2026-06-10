import { create } from 'zustand';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    setSocket: (socket) => {
        if (!socket) return;
        
        socket.on('message_received', (message) => {
            const { selectedUser, messages } = get();
            if (!selectedUser) return;

            const isRelevant =
                message.sender?._id === selectedUser._id ||
                message.receiver?._id === selectedUser._id;

            if (isRelevant) {
                set({ messages: [...messages, message] });
            }
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

    setSelectedUser: (user) => set({ selectedUser: user }),
}));