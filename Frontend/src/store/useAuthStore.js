import { create } from "zustand"
import axiosInstance from "../lib/axios.js"
import toast from "react-hot-toast"
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.MODE === "development" ? "http://localhost:5500" : "/";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check-auth");
            set({ authUser: res.data.user, isCheckingAuth: false });
            setTimeout(() => get().connectSocket(), 100);
        } catch (error) {
            console.error("Error checking auth:", error);
            set({ authUser: null, isCheckingAuth: false });
        }
        finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (formData) => {
        set({ isSigningUp: true });
        try {
            const res = await axiosInstance.post("/auth/signup", formData);
            set({ authUser: res.data.user });
            toast.success("Account created successfully!");
            setTimeout(() => get().connectSocket(), 100);
        }
        catch (error) {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during signup.";
            toast.error(errorMessage);
        }
        finally {
            set({ isSigningUp: false });
        }
    },

    login: async (formData) => {
        set({ isLoggingIn: true });
        try {
            const res = await axiosInstance.post("/auth/login", formData);
            set({ authUser: res.data.user });
            toast.success("Logged in successfully!");
            setTimeout(() => get().connectSocket(), 100);
        }
        catch (error) {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "An error occurred during login.";
            toast.error(errorMessage);
        }
        finally {
            set({ isLoggingIn: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            get().disconnectSocket();
            set({ authUser: null });
            toast.success("Logged out successfully!");
        } catch (error) {
            console.error("Logout error:", error);
            toast.error(error.response?.data?.message || "An error occurred during logout.");
        }
    },

    updateProfile: async (payload) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axiosInstance.patch("/auth/update-profile", payload);
            set({ authUser: res.data.user });
            toast.success("Profile updated successfully!");
            return true;
        } catch (error) {
            console.error("Update profile error:", error);
            toast.error(error.response?.data?.message || "An error occurred while updating the profile.");
            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    },

    connectSocket: () => {
        const { authUser, socket } = get();
        if (!authUser || socket?.connected) return;

        const newSocket = io(SOCKET_URL, {
            withCredentials: true,
            query: {
                userId: authUser._id
            },
        });

        newSocket.on('connect', () => {
            console.log("Connected to socket server");
            newSocket.emit('join', authUser._id);
        });

        newSocket.on('online_users', (users) => {
            console.log("Received online users:", users);
            set({ onlineUsers: users });
        });

        newSocket.on('disconnect', () => {
            console.log("Disconnected from socket server");
        });

        set({ socket: newSocket });
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) socket.disconnect();
    }
}))
