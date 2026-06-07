import { create } from 'zustand';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import axiosInstance from '../lib/axios';

let socket;

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    initSocket: (userId) => {
        if (socket || !userId) return;

        socket = io('http://localhost:5500', {
            withCredentials: true,
        });

        socket.on('connect', () => {
            socket.emit('join', userId);
        });

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
    sendMessage: async ({ text, image }) => {
        const { selectedUser, messages } = get();
        try {
            const response = await axiosInstance.post(`/messages/${selectedUser._id}`, {
                content: text,
                image,
            });

            if (response.data?.message) {
                set({ messages: [...messages, response.data.message] });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send message');
        }
    },

    setSelectedUser: (user) => set({ selectedUser: user }),
}));