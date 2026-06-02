import { create } from 'zustand';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export const useChatStore = create((set) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUserLoading: false,
    isMessageLoading: false,

    getUsers: async () => {
        set({ isUserLoading: true });
        try {
            const response = await axiosInstance.get('/messages/users');
            set({ users: response.data.users });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch users');
        } finally {
            set({ isUserLoading: false });
        }

    },
    getMessages: async (userId) => {
        set({ isMessageLoading: true, selectedUser: userId });
        try {
            const response = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: response.data.messages });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch messages');
        } finally {
            set({ isMessageLoading: false });
        }
    },
    sendMessage: async ({ text, image }) => {
        const { selectedUser, messages } = get();
        try {
            const formData = new FormData();
            formData.append('text', text);
            if (image) {
                formData.append('image', image);
            }
            await axiosInstance.post(`/messages/${selectedUser._id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));